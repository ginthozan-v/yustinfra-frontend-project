import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ContractorCard from '@/components/Pages/Projects/ContractorCard';
import Container from '@/components/partials/Container';
import PageHeader from '@/components/partials/PageHeader';
import RightPanel from '@/components/RightPanel';
import TextInput from '@/components/UI/TextInput';
import FormWrapper from '@/components/Form';
import { Form } from 'formik';
import Button from '@/components/UI/Button';
import SelectDropdown from '@/components/UI/Select';
import { getAuthUser } from '@/utils/auth';
import api from '@/api';
import { useUsers } from '@/context/UsersContext';
import EmptyState from '@/components/EmptyState';
import Loading from '@/components/UI/Loading';
import { getForms, getUsers, linkUserForm } from '@/utils/projectLinkageHelper';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import ReactSelect from '@/components/UI/Select/ReactSelect';
import { ADMIN_ROLE, CLIENT_ROLE } from '@/constants/roles';
import { MANAGER_ROLE } from '@/constants/roles';

const buttonGroup = [
  { name: 'add', label: 'New Project', icon: 'ADD', variant: 'filled' },
];

const Project = () => {
  const [openRightPanel, setOpenRightPanel] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [showBtn, setShowBtn] = useState(true);

  const user = getAuthUser();
  const { users } = useUsers();

  const onClick = () => {
    setOpenRightPanel(!openRightPanel);
  };

  const fetchProjects = async (searchKey) => {
    setIsLoading(true);
    try {
      let projects;
      if (user.role === ADMIN_ROLE) {
        projects = await api.project.getAllProjects();
      } else if (user.role === MANAGER_ROLE) {
        projects = await api.project.getAllUserProjects(user.id, searchKey);
      } else {
        projects = await api.project.getAssignedProjects(user.id, searchKey);
      }

      await Promise.all(
        projects.data.map((project) => {
          project.project_user_forms.map(async (userForm) => {
            userForm.up_user['profilePic'] = await users?.find(
              (x) => x.id === userForm.up_user.id
            )?.profilePicture;
          });
        })
      );

      setProjects(projects.data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const fetchUserGroups = async (search) => {
    // setIsLoading(true);
    try {
      const res = await api.group.getAllGroups(user.id, search);

      // user group id is inside user_groups > id
      const groups = res.data.map((res) => ({
        id: res.id,
        name: res.name,
        users: res.user_groups,
      }));
      setUserGroups(groups);
    } catch (error) {
      console.log(error);
      setUserGroups([]);
    }
    // setIsLoading(false);
  };

  const handleSelectProject = (id) => {
    const project = projects.filter((x) => x.id === id);

    setSelectedProject(project[0]);
    setOpenRightPanel(true);
  };

  const deleteProject = async () => {
    const user = getAuthUser();
    try {
      await api.project.deleteProject(user.id, selectedProject);
      setIsConfirm(false);
      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProject = async (e) => {
    setIsConfirm(true);
    setSelectedProject(e);
  };

  const QuickActions = [
    {
      id: 1,
      label: 'Edit',
      handleAction: (e) => handleSelectProject(e),
    },
    {
      id: 2,
      label: 'Remove',
      handleAction: (e) => handleDeleteProject(e),
    },
  ];

  useEffect(() => {
    fetchUserGroups();
    if (user.role === CLIENT_ROLE) {
      setShowBtn(false);
      fetchProjects();
    } else if (user.role === MANAGER_ROLE) {
      fetchProjects();
    } else {
      fetchProjects();
    }
  }, [users]);

  return (
    <div>
      <ConfirmModal
        title="The project will be deleted, are you sure?"
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        onYes={deleteProject}
      />
      <PageHeader
        title="Projects"
        isSearch={true}
        buttonGroup={showBtn ? buttonGroup : null}
        onBtnClick={onClick}
        search={fetchProjects}
      />

      <Container>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {!isLoading &&
            projects?.map((project) => (
              <ContractorCard
                key={project.id}
                id={project.id}
                title={project.name}
                assigned={project.project_user_forms}
                actions={QuickActions}
              />
            ))}

          {!isLoading && projects.length === 0 && (
            <div className="sm:col-span-2 xl:col-span-3">
              <EmptyState
                title="Nothing to show here"
                btnTitle={showBtn ? 'New Project' : ''}
                onBtnClick={() => onClick()}
              />
            </div>
          )}

          {isLoading && (
            <div className="text-center sm:col-span-2 xl:col-span-3">
              <Loading />
            </div>
          )}
        </div>
      </Container>

      <CreateNewProjectPanel
        userId={user.id}
        users={users}
        userGroups={userGroups}
        selectedProject={selectedProject}
        openRightPanel={openRightPanel}
        setOpenRightPanel={setOpenRightPanel}
        fetchProjects={() => fetchProjects()}
        setSelectedProject={setSelectedProject}
      />
    </div>
  );
};

Project.Title = 'Project';
Project.auth = true;
Project.Layout = DashboardLayout;
export default Project;

const CreateNewProjectPanel = ({
  userId,
  selectedProject,
  openRightPanel,
  setOpenRightPanel,
  fetchProjects,
  users,
  userGroups,
  setSelectedProject,
}) => {
  const [initialValues, setInitialValues] = useState({
    name: '',
    user_groups: '',
    user: [],
    form: [],
  });

  const [forms, setForms] = useState([]);
  const [error, setError] = useState(null);

  const formSubmit = async (values) => {
    try {
      const bulk = linkUserForm(values);

      const body = {
        name: values.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: userId,
        updated_by: userId,
        bulk,
      };

      if (selectedProject) {
        await api.project.updateProject(body, userId, selectedProject.id);
        setSelectedProject(null);
      } else {
        await api.project.createProject(body);
      }
      setOpenRightPanel(false);
      fetchProjects();
    } catch (error) {
      console.log('🚀 error at login page >> line: 23', error);
      setError(error?.response?.data?.error?.message);
    }
  };

  const fetchForms = async () => {
    try {
      const response = await api.form.getAllForms(userId);
      setForms(response.data);
    } catch (error) {
      console.log('>>', error);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      const users = getUsers(selectedProject?.project_user_forms);
      const forms = getForms(selectedProject?.project_user_forms);

      const selectedUsers = users.map((user) => ({
        value: user?.id,
        label: user?.username,
      }));

      const selectedForms = forms.map((form) => ({
        value: form?.id,
        label: form?.form_name,
      }));

      setInitialValues({
        name: selectedProject?.name,
        user: selectedUsers,
        form: selectedForms,
      });
    }
  }, [selectedProject]);

  return (
    <RightPanel
      title={initialValues.name !== '' ? 'Update Project' : 'New Project'}
      rightPanelOpen={openRightPanel}
      setRightPanelOpen={() => {
        setOpenRightPanel();
        setInitialValues({
          name: '',
          user_groups: '',
          user: [],
          form: [],
        });
      }}
      error={error}
    >
      <div className="mt-10">
        <FormWrapper initialValues={initialValues} handleSubmit={formSubmit}>
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-9">
              <TextInput label="Name" name="name" type="text" />
              <ReactSelect
                field={{ name: 'user_groups' }}
                label="Add user groups"
                placeholder="Select..."
                options={userGroups?.map((user) => ({
                  value: user.id,
                  label: `${user.name}`,
                  users: user.users,
                }))}
                onSelectChange={(e) => {
                  const users = [];
                  e.map((group) =>
                    group.users?.map((user) => {
                      users.push({
                        value: user.up_user.id,
                        label:
                          user.up_user.first_name +
                          ' ' +
                          user.up_user.last_name,
                        user_group_id: user.id,
                      });
                    })
                  );
                  setFieldValue('user', users);
                  setFieldValue('user_groups', e.value);
                }}
                isMulti={true}
              />

              <SelectDropdown
                label="Add users"
                name="user"
                isMulti={true}
                options={users?.map((user) => ({
                  value: user.id,
                  label: `${user.firstName} ${user.lastName}`,
                }))}
              />

              <SelectDropdown
                label="Add forms"
                name="form"
                isMulti={true}
                options={forms
                  .filter((x) => x.status === 'published')
                  ?.map((form) => ({
                    value: form.id,
                    label: `${form.form_name}`,
                  }))}
              />

              <Button
                type="submit"
                disable={isSubmitting}
                isLoading={isSubmitting}
              >
                Submit
              </Button>
            </Form>
          )}
        </FormWrapper>
      </div>
    </RightPanel>
  );
};
