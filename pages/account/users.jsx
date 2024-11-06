import React, { useEffect, useState } from "react";
import api from "@/api";
import FormWrapper from "@/components/Form";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import SettingsWrapper from "@/components/Pages/Account/SettingsWrapper";
import Pagination from "@/components/Pagination";
import Container from "@/components/partials/Container";
import PageHeader from "@/components/partials/PageHeader";
import RightPanel from "@/components/RightPanel";
import Table from "@/components/Table";
import Toast from "@/components/Toast";
import Button from "@/components/UI/Button";
import SelectDropdown from "@/components/UI/Select";
import Switch from "@/components/UI/Switch";
import TextInput from "@/components/UI/TextInput";
import {
  ADMIN_ROLE,
  COLLECTOR_ROLE,
  MANAGER_ROLE,
  CLIENT_ROLE,
} from "@/constants/roles";
import { useUsers } from "@/context/UsersContext";
import { getAuthUser } from "@/utils/auth";
import { getForms, getUsers, linkUserForm } from "@/utils/projectLinkageHelper";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Form } from "formik";
import { toast } from "react-hot-toast";

const buttonGroup = [
  { name: "add", label: "New User", icon: "ADD", variant: "filled" },
];

const Users = () => {
  const { users, isLoading, fetchUsers } = useUsers();
  const [activeTab, setActiveTab] = useState("my");
  const [openRightPanel, setOpenRightPanel] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isConfirm, setIsConfirm] = useState(false);
  const [page, setPage] = useState(0);
  const handleChangePage = (page) => {
    setPage(page);
  };

  const handleSelectUser = (id) => {
    const user = users.filter((x) => x.id === id);
    setSelectedUser(user[0]);
    setOpenRightPanel(true);
  };

  const deleteUser = async () => {
    try {
      await api.user.deleteUser(selectedUser);
      toast.custom((t) => (
        <Toast
          t={t}
          title="Success"
          message={`User deleted successfully!`}
          toast={toast}
        />
      ));
      setIsConfirm(false);
      fetchUsers();
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

  const handleDeleteUser = async (id) => {
    setIsConfirm(true);
    setSelectedUser(id);
  };

  const columns = [
    {
      id: "user",
      name: "User",
    },
    {
      id: "firstName",
      name: "First Name",
    },
    {
      id: "lastName",
      name: "Last Name",
    },
    {
      id: "role",
      name: "Role",
      isStatus: true,
    },
    {
      id: "action",
      actions: [
        {
          id: "edit",
          name: "Edit",
          Icon: PencilIcon,
          handleAction: (e) => handleSelectUser(e),
        },
        {
          id: "delete",
          name: "Delete",
          Icon: TrashIcon,
          handleAction: (e) => handleDeleteUser(e),
        },
      ],
    },
  ];

  return (
    <>
      <ConfirmModal
        title="The user will be deleted, are you sure?"
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        onYes={deleteUser}
      />
      <PageHeader
        tabs={[]}
        activeTab={activeTab}
        handleTabClick={setActiveTab}
        isSearch={true}
        buttonGroup={buttonGroup}
        onBtnClick={() => setOpenRightPanel(true)}
        search={fetchUsers}
        title="Setting"
      />
      <Container>
        <SettingsWrapper>
          <div className="h-full grow">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-800">Users</h2>
            </div>

            <div className="min-h-[70vh] flex flex-col w-full">
              <div className="max-w-sm md:max-w-none">
                <Table
                  columns={columns}
                  rowData={users}
                  isLoading={isLoading}
                  page={page}
                  rowsPerPage={10}
                />
              </div>
              <div className="p-5 mt-auto">
                <Pagination
                  page={page}
                  max={10}
                  total={users.length}
                  handleChangePage={handleChangePage}
                />
              </div>
            </div>
          </div>
        </SettingsWrapper>
      </Container>
      <CreateUserRightPanel
        openRightPanel={openRightPanel}
        setOpenRightPanel={setOpenRightPanel}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
    </>
  );
};

Users.Title = "Settings";
Users.auth = true;
Users.Layout = DashboardLayout;
export default Users;

const CreateUserRightPanel = ({
  openRightPanel,
  setOpenRightPanel,
  selectedUser,
  setSelectedUser,
}) => {
  const init = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    admin: false,
  };
  const [initialValues, setInitialValues] = useState(init);

  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const { fetchUsers } = useUsers();
  const user = getAuthUser();

  const fetchProjects = async () => {
    try {
      let projects = await api.project.getAllUserProjects(user.id);
      projects = projects.data.map((project) => ({
        value: project.id,
        label: project.name,
      }));
      setProjects(projects);
    } catch (error) {
      console.log(error);
    }
  };

  const formSubmit = async (values) => {
    try {
      const body = {
        username: values.email,
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        role: 1,
        user_role: values.admin
          ? 1
          : values.collector
          ? 2
          : values.manager
          ? 3
          : values.client
          ? 4
          : null,
      };

      if (selectedUser) {
        await api.user.updateUser(body, selectedUser.id);
        if (values.project) {
          await assignProject(selectedUser.id, values.project);
        } else {
          setOpenRightPanel(false);
          setInitialValues(init);
          fetchUsers();
        }
        setSelectedUser(null);
      } else {
        body["password"] = "Test123!";
        const user = await api.user.createUser(body);
        const resetBody = {
          identifier: values.email,
        };
        await api.auth.forgotPassword(resetBody);

        if (user && values.project) {
          await assignProject(user.id, values.project);
        } else {
          setOpenRightPanel(false);
          setInitialValues(init);
          fetchUsers();
        }
      }
      toast.custom((t) => (
        <Toast
          t={t}
          title="Success"
          message={`User ${selectedUser ? "Updated" : "created"} successfully!`}
          toast={toast}
        />
      ));
    } catch (error) {
      console.log("🚀 error at login page >> line: 23", error);
      setError(error?.response?.data?.error?.message);
    }
  };

  const assignProject = async (userId, project) => {
    try {
      const PROJECT = await api.project.getProject(user.id, project.value);

      const FORMS = getForms(PROJECT.project_user_forms);
      const USERS = getUsers(PROJECT.project_user_forms);
      let bulk;

      if (USERS.some((x) => x.id === userId)) {
        setError("This user is already assigned to this project!");
        return;
      } else if (USERS || FORMS) {
        const USER_FROMS = {
          form: [],
          user: [],
        };
        FORMS.map((form) => {
          USER_FROMS.form.push({ value: form.id });
        });
        USERS.map((user) => {
          USER_FROMS.user.push({ value: user.id });
        });
        USER_FROMS.user.push({ value: userId });
        bulk = linkUserForm(USER_FROMS);
      } else {
        bulk = [{ user_id: userId, form_id: null }];
      }

      const projectBody = {
        updated_at: new Date().toISOString(),
        updated_by: user.id,
        bulk,
      };

      await api.project.updateProject(projectBody, user.id, project.value);

      setOpenRightPanel(false);
      fetchUsers();
    } catch (error) {
      console.log("error>>", error);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      const init = {
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.user,
      };
      if (selectedUser.role === ADMIN_ROLE) {
        init["admin"] = true;
      }
      if (selectedUser.role === COLLECTOR_ROLE) {
        init["collector"] = true;
      }
      if (selectedUser.role === MANAGER_ROLE) {
        init["manager"] = true;
      }
      if (selectedUser.role === CLIENT_ROLE) {
        init["client"] = true;
      }
      setInitialValues(init);
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchProjects().catch((e) => console.log(e));
  }, []);

  return (
    <RightPanel
      title="New User"
      rightPanelOpen={openRightPanel}
      setRightPanelOpen={() => {
        setOpenRightPanel();
        setInitialValues(init);
      }}
      error={error}
    >
      <div className="mt-10">
        <FormWrapper initialValues={initialValues} handleSubmit={formSubmit}>
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-4">
              <TextInput label="First Name" name="firstName" type="text" />
              <TextInput label="Last Name" name="lastName" type="text" />
              <TextInput label="Email" name="email" type="email" />
              <SelectDropdown
                label="Project"
                name="project"
                isMulti={false}
                options={projects}
              />

              <h5>Roles</h5>

              <Switch
                label="Admin"
                name="admin"
                onChange={() => {
                  setFieldValue("admin", !values["admin"]);
                  setFieldValue("collector", false);
                  setFieldValue("manager", false);
                  setFieldValue("client", false);
                }}
              />
              <Switch
                label="Collector"
                name="collector"
                onChange={() => {
                  setFieldValue("collector", !values["collector"]);
                  setFieldValue("admin", false);
                  setFieldValue("manager", false);
                  setFieldValue("client", false);
                }}
              />
              <Switch
                label="Manager"
                name="manager"
                onChange={() => {
                  setFieldValue("manager", !values["manager"]);
                  setFieldValue("admin", false);
                  setFieldValue("collector", false);
                  setFieldValue("client", false);
                }}
              />
              <Switch
                label="Client"
                name="client"
                onChange={() => {
                  setFieldValue("client", !values["client"]);
                  setFieldValue("admin", false);
                  setFieldValue("collector", false);
                  setFieldValue("manager", false);
                }}
              />

              <div className="pt-10 space-x-2">
                <Button
                  variant="outlined"
                  onBtnClick={() => setOpenRightPanel()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disable={isSubmitting}
                >
                  Save Changes
                </Button>
              </div>
            </Form>
          )}
        </FormWrapper>
      </div>
    </RightPanel>
  );
};
