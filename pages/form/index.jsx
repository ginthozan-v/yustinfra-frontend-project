import api from "@/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import Pagination from "@/components/Pagination";
import Container from "@/components/partials/Container";
import PageHeader from "@/components/partials/PageHeader";
import Table from "@/components/Table";
import Toast from "@/components/Toast";
import {
  MAIN_FORM_TYPE,
  SUB_FORM_TYPE,
  TEMPLATE_TYPE,
} from "@/constants/fieldType";
import { CREATE_FORM_TEMPLATE_ROUTE, FORM_DETAILS } from "@/constants/routes";
import { getAuthUser } from "@/utils/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const FormPage = () => {
  const [activeTab, setActiveTab] = useState("main_form");
  const [search, setSearch] = useState("");

  const user = getAuthUser();
  const router = useRouter();

  const buttonGroup = [
    { name: "add", label: "New Form", icon: "ADD", variant: "filled" },
  ];

  const columns = [
    {
      id: "formName",
      name: "Form Name",
    },
    {
      id: "lastDate",
      name: "Last Date",
      isDateTime: true,
    },
    {
      id: "version",
      name: "Version",
      isStatus: true,
    },
    {
      id: "editedBy",
      name: "Edited By",
    },
  ];

  const tabs = [
    {
      id: MAIN_FORM_TYPE,
      name: "Main Form",
      component: (activeTab) => (
        <MainForm
          columns={columns}
          userId={user.id}
          search={search}
          activeTab={activeTab}
        />
      ),
    },
    {
      id: SUB_FORM_TYPE,
      name: "Sub Form",
      component: (activeTab) => (
        <SubForm
          columns={columns}
          userId={user.id}
          search={search}
          activeTab={activeTab}
        />
      ),
    },
    {
      id: TEMPLATE_TYPE,
      name: "Templates",
      component: (activeTab) => (
        <Template
          columns={columns}
          userId={user.id}
          search={search}
          activeTab={activeTab}
        />
      ),
    },
  ];

  const onClick = () => {
    router
      .push({
        pathname: CREATE_FORM_TEMPLATE_ROUTE,
        query: { form_type: activeTab },
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="h-full">
      <PageHeader
        title="Forms"
        isSearch={true}
        buttonGroup={buttonGroup}
        onBtnClick={onClick}
        search={setSearch}
        tabs={tabs}
        activeTab={activeTab}
        handleTabClick={setActiveTab}
      />
      <Container>
        <div>{tabs.find((x) => x.id === activeTab).component(activeTab)}</div>
      </Container>
    </div>
  );
};

FormPage.Title = "Form";
FormPage.auth = true;
FormPage.Layout = DashboardLayout;
export default FormPage;

const MainForm = ({ columns, userId, search, activeTab }) => {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formId, setFormId] = useState(null);
  const [isConfirm, setIsConfirm] = useState(false);
  const router = useRouter();

  const deleteRow = async () => {
    try {
      await api.form.deleteForm(userId, formId);
      setIsConfirm(false);
      fetchForms();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteForm = (id) => {
    setFormId(id);
    setIsConfirm(true);
  };

  columns = [
    {
      id: "action",
      name: "Action",
      isDropdown: true,
      options: [
        {
          id: "details",
          title: "Details",
          action: (id) => {
            router.push({
              pathname: FORM_DETAILS + `/${id}`,
              query: { form_type: MAIN_FORM_TYPE },
            });
          },
        },
        {
          id: "edit",
          title: "Edit",
          action: (id) =>
            router.push({
              pathname: CREATE_FORM_TEMPLATE_ROUTE,
              query: { form_type: MAIN_FORM_TYPE, formId: id },
            }),
        },
        // {
        //   id: 'duplicate',
        //   title: 'Duplicate',
        //   action: (id) => {
        //     handleDuplicateModal();
        //   },
        // },
        {
          id: "delete",
          title: "Delete",
          action: (id) => handleDeleteForm(id),
        },
      ],
    },
    ...columns,
  ];

  const fetchForms = async (searchKey) => {
    setIsLoading(true);
    try {
      const response = await api.form.getAllForms(
        userId
        //&name=${searchKey ?? ''}
      );

      const forms = response?.data?.map((form) => ({
        id: form.id,
        formName: form.form_name,
        lastDate: form.last_date,
        version: form.version,
        editedBy: form.up_user.username,
      }));
      setForms(forms);
    } catch (error) {
      console.log(">>", error);
      toast.custom((t) => (
        <Toast
          t={t}
          title="Error"
          message="Something went wrong, Try again later!"
          toast={toast}
        />
      ));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (search && activeTab === MAIN_FORM_TYPE) {
      fetchForms(search).catch((e) => console.log(e));
    } else if (activeTab === MAIN_FORM_TYPE) {
      fetchForms().catch((e) => console.log(e));
    }
  }, [search, activeTab]);

  return (
    <>
      <ConfirmModal
        title="The main form will be deleted, are you sure?"
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        onYes={deleteRow}
      />
      <RenderTable columns={columns} rowData={forms} isLoading={isLoading} />
    </>
  );
};

const SubForm = ({ columns, userId, search, activeTab }) => {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formId, setFormId] = useState(null);
  const [isConfirm, setIsConfirm] = useState(false);

  const router = useRouter();

  const deleteRow = async () => {
    try {
      await api.form.deleteSubForm(userId, formId);
      setIsConfirm(false);
      fetchForms();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteForm = (id) => {
    setFormId(id);
    setIsConfirm(true);
  };

  columns = [
    {
      id: "action",
      name: "Action",
      isDropdown: true,
      options: [
        // {
        //   id: 'details',
        //   title: 'Details',
        //   action: (id) => {
        //     router.push({
        //       pathname: FORM_DETAILS + `/${id}`,
        //       query: { form_type: SUB_FORM_TYPE },
        //     });
        //   },
        // },
        {
          id: "edit",
          title: "Edit",
          action: (id) =>
            router.push({
              pathname: CREATE_FORM_TEMPLATE_ROUTE,
              query: { form_type: SUB_FORM_TYPE, formId: id },
            }),
        },
        {
          id: "delete",
          title: "Delete",
          action: (id) => handleDeleteForm(id),
        },
      ],
    },
    ...columns,
  ];

  const fetchForms = async (searchKey) => {
    setIsLoading(true);
    try {
      const response = await api.form.getAllSubForms(userId);
      const forms = response?.data?.map((form) => ({
        id: form.id,
        formName: form.name,
        lastDate: form.last_date,
        version: form.version,
        editedBy: form.up_user.username,
      }));

      const filtered = searchKey
        ? forms.filter((x) =>
            x.formName.toLowerCase().includes(searchKey.toLowerCase())
          )
        : forms;

      setForms(filtered);
    } catch (error) {
      console.log(">>", error);
      toast.custom((t) => (
        <Toast
          t={t}
          title="Error"
          message="Something went wrong, Try again later!"
          toast={toast}
        />
      ));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (search && activeTab === SUB_FORM_TYPE) {
      fetchForms(search);
    } else if (activeTab === SUB_FORM_TYPE) {
      fetchForms();
    }
  }, [search, activeTab]);

  return (
    <>
      <ConfirmModal
        title="The sub form will be deleted, are you sure?"
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        onYes={deleteRow}
      />
      <RenderTable columns={columns} rowData={forms} isLoading={isLoading} />
    </>
  );
};

const Template = ({ userId, search, activeTab }) => {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formId, setFormId] = useState(null);
  const [isConfirm, setIsConfirm] = useState(false);

  const router = useRouter();

  const deleteRow = async () => {
    try {
      await api.form.deleteFormTemplate(userId, formId);
      setIsConfirm(false);
      fetchForms();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteForm = (id) => {
    setFormId(id);
    setIsConfirm(true);
  };

  const columns = [
    {
      id: "action",
      name: "Action",
      isDropdown: true,
      options: [
        {
          id: "edit",
          title: "Edit",
          action: (id) =>
            router.push({
              pathname: CREATE_FORM_TEMPLATE_ROUTE,
              query: { form_type: TEMPLATE_TYPE, formId: id },
            }),
        },
        {
          id: "delete",
          title: "Delete",
          action: (id) => handleDeleteForm(id),
        },
      ],
    },
    {
      id: "formName",
      name: "Form Name",
    },
    {
      id: "lastDate",
      name: "Last Date",
      isDateTime: true,
    },
  ];

  const fetchForms = async (searchKey) => {
    setIsLoading(true);
    try {
      const response = await api.form.getAllFormTemplates(userId);
      const forms = response?.data?.map((form) => ({
        id: form.id,
        formName: form.template_name,
        lastDate: form.updated_at,
      }));

      const filtered = searchKey
        ? forms.filter((x) =>
            x.formName.toLowerCase().includes(searchKey.toLowerCase())
          )
        : forms;

      setForms(filtered);
    } catch (error) {
      console.log(">>", error);
      toast.custom((t) => (
        <Toast
          t={t}
          title="Error"
          message="Something went wrong, Try again later!"
          toast={toast}
        />
      ));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (search && activeTab === TEMPLATE_TYPE) {
      fetchForms(search);
    } else if (activeTab === TEMPLATE_TYPE) {
      fetchForms();
    }
  }, [search, activeTab]);

  return (
    <>
      <ConfirmModal
        title="The template will be deleted, are you sure?"
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        onYes={deleteRow}
      />
      <RenderTable columns={columns} rowData={forms} isLoading={isLoading} />
    </>
  );
};

const RenderTable = ({ columns, rowData, isLoading }) => {
  const [page, setPage] = useState(0);

  const handleChangePage = (page) => {
    setPage(page);
  };

  return (
    <>
      <div className="relative md:w-full w-[calc(100vw-2rem)] h-[73vh] overflow-hidden bg-white border rounded-sm shadow-lg border-slate-200">
        <Table
          columns={columns}
          rowData={rowData}
          isLoading={isLoading}
          page={page}
          rowsPerPage={10}
        />
      </div>
      <div className="mt-4">
        <Pagination
          page={page}
          max={10}
          total={rowData.length}
          handleChangePage={handleChangePage}
        />
      </div>
    </>
  );
};
