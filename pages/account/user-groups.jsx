import api from '@/api';
import FormWrapper from '@/components/Form';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import SettingsWrapper from '@/components/Pages/Account/SettingsWrapper';
import Pagination from '@/components/Pagination';
import Container from '@/components/partials/Container';
import PageHeader from '@/components/partials/PageHeader';
import RightPanel from '@/components/RightPanel';
import Table from '@/components/Table';
import Toast from '@/components/Toast';
import Button from '@/components/UI/Button';
import SelectDropdown from '@/components/UI/Select';
import TextInput from '@/components/UI/TextInput';
import { useUsers } from '@/context/UsersContext';
import { getAuthUser } from '@/utils/auth';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Form } from 'formik';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const buttonGroup = [
  { name: 'add', label: 'New User Group', icon: 'ADD', variant: 'filled' },
];

const UserGroups = () => {
  const [activeTab, setActiveTab] = useState('my');
  const [openRightPanel, setOpenRightPanel] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [page, setPage] = useState(0);

  const user = getAuthUser();
  const handleChangePage = (page) => {
    setPage(page);
  };

  const handleSelectGroup = (id) => {
    const group = groups.filter((x) => x.id === id);
    setSelectedGroup(group[0]);
    setOpenRightPanel(true);
  };

  const deleteGroup = async () => {
    try {
      await api.group.deleteGroup(user.id, groupId);
      toast.custom((t) => (
        <Toast
          t={t}
          title="Success"
          message={`User group deleted successfully!`}
          toast={toast}
        />
      ));
      setIsConfirm(false);
      fetchUserGroups();
    } catch (error) {
      console.log(error);
      toast.custom((t) => (
        <Toast
          t={t}
          title="Error"
          message={`Something went wrong, please try again later!`}
          toast={toast}
        />
      ));
    }
  };

  const handleDeleteGroup = async (id) => {
    setIsConfirm(true);
    setGroupId(id);
  };

  const columns = [
    {
      id: 'name',
      name: 'Group Name',
    },
    {
      id: 'action',
      actions: [
        {
          id: 'edit',
          name: 'Edit',
          Icon: PencilIcon,
          handleAction: (e) => handleSelectGroup(e),
        },
        {
          id: 'delete',
          name: 'Delete',
          Icon: TrashIcon,
          handleAction: (e) => handleDeleteGroup(e),
        },
      ],
    },
  ];

  const fetchUserGroups = async (search) => {
    const user = getAuthUser();
    setIsLoading(true);
    try {
      const res = await api.group.getAllGroups(user.id, search);

      const groups = res.data.map((res) => ({
        id: res.id,
        name: res.name,
        users: res.user_groups,
      }));
      setGroups(groups);
    } catch (error) {
      console.log(error);
      setGroups([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserGroups();
  }, []);

  return (
    <>
      <ConfirmModal
        title="The user group will be deleted, are you sure?"
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        onYes={deleteGroup}
      />
      <PageHeader
        tabs={[]}
        activeTab={activeTab}
        handleTabClick={setActiveTab}
        isSearch={true}
        buttonGroup={buttonGroup}
        onBtnClick={() => setOpenRightPanel(true)}
        title="Settings"
        search={fetchUserGroups}
      />

      <Container>
        <SettingsWrapper>
          <div className="h-full grow">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-800">User Groups</h2>
            </div>

            <div className="min-h-[70vh] flex flex-col">
              <div className="w-full max-w-sm md:max-w-full">
                <Table
                  columns={columns}
                  rowData={groups}
                  isLoading={isLoading}
                />
              </div>
              <div className="p-5 mt-auto">
                <Pagination
                  page={page}
                  max={10}
                  total={groups.length}
                  handleChangePage={handleChangePage}
                />
              </div>
            </div>
          </div>
        </SettingsWrapper>
      </Container>
      <CreateNewUserGroupPanel
        openRightPanel={openRightPanel}
        setOpenRightPanel={setOpenRightPanel}
        fetchUserGroups={fetchUserGroups}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      />
    </>
  );
};

UserGroups.Title = 'Settings';
UserGroups.auth = true;
UserGroups.Layout = DashboardLayout;
export default UserGroups;

const CreateNewUserGroupPanel = ({
  openRightPanel,
  setOpenRightPanel,
  fetchUserGroups,
  selectedGroup,
  setSelectedGroup,
}) => {
  const authUser = getAuthUser();
  const { users } = useUsers();
  const [initialValues, setInitialValues] = useState({
    name: '',
    user: [],
  });
  const [error, setError] = useState(null);

  const user = getAuthUser();

  const formSubmit = async (values) => {
    try {
      const users = [];
      values.user.map((user) => {
        users.push(user.value);
      });

      const body = {
        name: values.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: authUser.id,
        updated_by: authUser.id,
        user_id: users,
      };

      if (selectedGroup) {
        await api.group.updateGroup(body, user.id, selectedGroup.id);
        setSelectedGroup(null);
      } else {
        await api.group.createGroup(body);
      }

      toast.custom((t) => (
        <Toast
          t={t}
          title="Success"
          message={`User group ${
            selectedGroup ? 'Updated' : 'created'
          } successfully!`}
          toast={toast}
        />
      ));

      setOpenRightPanel(false);
      fetchUserGroups();
    } catch (error) {
      console.log('🚀 error at login page >> line: 23', error);
      setError(error?.response?.data?.error?.message);
    }
  };

  useEffect(() => {
    if (selectedGroup) {
      const selectedUsers = selectedGroup.users.map((user) => ({
        value: user.user_id,
        label: user.up_user.username,
      }));

      setInitialValues({
        name: selectedGroup.name,
        user: selectedUsers,
      });
    }
  }, [selectedGroup]);

  return (
    <RightPanel
      title="New User Group"
      rightPanelOpen={openRightPanel}
      setRightPanelOpen={setOpenRightPanel}
      error={error}
    >
      <div className="mt-10">
        <FormWrapper initialValues={initialValues} handleSubmit={formSubmit}>
          {({ isSubmitting }) => (
            <Form className="flex flex-col space-y-7">
              <TextInput label="Name" name="name" type="text" />
              <SelectDropdown
                label="Add users"
                name="user"
                isMulti={true}
                options={users?.map((user) => ({
                  value: user.id,
                  label: `${user.firstName} ${user.lastName}`,
                }))}
              />

              <div className="space-x-2">
                <Button
                  variant="outlined"
                  onBtnClick={() => setOpenRightPanel(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disable={isSubmitting}
                  isLoading={isSubmitting}
                >
                  Save & Close
                </Button>
              </div>
            </Form>
          )}
        </FormWrapper>
      </div>
    </RightPanel>
  );
};
