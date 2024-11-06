import api from '@/api';
import Toast from '@/components/Toast';
import {
  CHECKBOX_OPTIONS,
  DATE_FIELD,
  DOCUMENT,
  LOCATION,
  LONG_TEXT_FIELD,
  MAIN_FORM_TYPE,
  MULTIPLE_PHOTO_FIELD,
  NUMERIC_FIELD,
  RADIO_OPTIONS,
  SIGNATURE,
  SINGLE_PHOTO_FIELD,
  STATIC_IMAGE,
  STATIC_TEXT,
  SUB_FORM,
  SUB_FORM_TYPE,
  SWITCH,
  TEMPLATE_TYPE,
  TEXT_FIELD,
  TOGGLE,
  VIDEO_FIELD,
} from '@/constants/fieldType';
import {
  CREATE_FORM_TEMPLATE_ROUTE,
  FORM_ROUTE,
  FORM_SETTINGS_ROUTE,
} from '@/constants/routes';
import { getAuthUser } from '@/utils/auth';
import { useRouter } from 'next/router';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';

const FormsContext = createContext(null);

export const FormProvider = ({ children }) => {
  const [openRightPanel, setOpenRightPanel] = useState(false);
  const [pages, setPages] = useState([{ id: 1, name: 'Page 1' }]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sections, setSections] = useState([
    { id: 1, pageId: 1, name: 'Section 1' },
  ]);
  const [currentSection, setCurrentSection] = useState(1);
  const [formFields, setFormFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formVersion, setFormVersion] = useState(1);
  const [selectedSubForm, setSelectedSubForm] = useState(null);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldType, setFieldType] = useState('page');
  const [fieldSchema, setFieldSchema] = useState(
    Yup.object().shape({
      name: Yup.string().required('Required'),
    })
  );
  const [isEditing, setIsEditing] = useState(false);

  const prevFormPagesRef = useRef([]);
  const prevFormSectionsRef = useRef([]);
  const prevFormFieldsRef = useRef([]);
  const router = useRouter();
  const user = getAuthUser();

  const { query } = router;

  const createPages = (value) => {
    setIsEditing(true);
    const id = pages?.length === 0 ? 1 : pages?.slice(-1)[0].id + 1;
    setPages([...pages, { id, name: value }]);

    const sectionId = sections.length === 0 ? 1 : sections.slice(-1)[0].id + 1;
    setSections([
      ...sections,
      { id: sectionId, pageId: id, name: 'Section 1' },
    ]);

    setCurrentPage(id);
    setCurrentSection(sectionId);
  };

  const createSections = (value) => {
    setIsEditing(true);
    const id = sections.length === 0 ? 1 : sections.slice(-1)[0].id + 1;
    setSections([...sections, { id, pageId: currentPage, name: value }]);
    setCurrentSection(id);
  };

  const updateSections = (values) => {
    setIsEditing(true);
    const SECTIONS_COPY = [...sections];
    SECTIONS_COPY.forEach((section) => {
      if (section.id === currentSection) {
        section['name'] = values.name;
        section['color'] = values.color;
      }
    });
    setSections(SECTIONS_COPY);
  };

  const updatePage = (values) => {
    setIsEditing(true);
    const PAGE_COPY = [...pages];
    PAGE_COPY.forEach((page) => {
      if (page.id === currentPage) {
        page['name'] = values.name;
      }
    });
    setPages(PAGE_COPY);
  };

  const createFormFields = (value) => {
    setIsEditing(true);
    const isLabelEmpty = formFields.some((pages) =>
      pages.fields.some((field) => field.name === '')
    );

    if (isLabelEmpty) {
      toast.custom((t) => (
        <Toast
          t={t}
          title="Field label is mandatory."
          message="Please give a name to the field!"
          toast={toast}
        />
      ));
      return;
    }

    const id = uuidv4();
    let PAGE_SECTION;
    setOpenRightPanel(true);
    setSelectedField(id);

    if (!formFields[0]) {
      PAGE_SECTION = [
        {
          page: currentPage,
          sections: currentSection,
          fields: [],
        },
      ];
    } else {
      if (currentSection) {
        PAGE_SECTION = formFields.filter(
          (x) => x.page === currentPage && x.sections === currentSection
        );

        if (!PAGE_SECTION[0]) {
          PAGE_SECTION = [
            {
              page: currentPage,
              sections: currentSection,
              fields: [],
            },
          ];
        }
      } else if (currentPage) {
        PAGE_SECTION = formFields.filter((x) => x.page === currentPage);
        if (!PAGE_SECTION[0]) {
          PAGE_SECTION = [
            {
              page: currentPage,
              sections: currentSection,
              fields: [],
            },
          ];
        }
      } else {
        PAGE_SECTION = formFields;
      }
    }

    const index = formFields.findIndex(
      (x) =>
        x.page === PAGE_SECTION[0].page &&
        x.sections === PAGE_SECTION[0].sections
    );

    let FORMFIELD_COPY = [...formFields];
    if (index === -1) {
      FORMFIELD_COPY = [...FORMFIELD_COPY, { ...PAGE_SECTION[0] }];
    } else {
      FORMFIELD_COPY[index] = PAGE_SECTION[0];
    }

    const attributes = {
      id: id,
      fieldType: value,
      type: value,
      label: '',
      name: '',
      placeholder: '',
      hint: '',
      suffix: '',
    };

    switch (value) {
      case TEXT_FIELD:
      case LONG_TEXT_FIELD:
      case NUMERIC_FIELD:
        setFieldSchema(
          Yup.object().shape({
            label: Yup.string().required('Required'),
          })
        );
        PAGE_SECTION[0].fields.push({
          ...attributes,
          placeholder: '',
          isRequired: false,
        });
        break;
      case STATIC_TEXT:
        setFieldSchema(
          Yup.object().shape({
            text: Yup.string().required('Required'),
          })
        );

        PAGE_SECTION[0].fields.push({
          id: id,
          fieldType: STATIC_TEXT,
          type: STATIC_TEXT,
          text: '',
          exclude_report: true,
        });
        break;
      case STATIC_IMAGE:
        setFieldSchema(
          Yup.object().shape({
            imageUrl: Yup.string().required('Required'),
          })
        );

        PAGE_SECTION[0].fields.push({
          id: id,
          fieldType: STATIC_IMAGE,
          name: STATIC_IMAGE,
          type: STATIC_IMAGE,
          imageUrl: '',
          exclude_report: true,
        });
        break;
      case DOCUMENT:
        setFieldSchema(
          Yup.object().shape({
            label: Yup.string().required('Required'),
            documentURL: Yup.string().required('Required'),
          })
        );
        PAGE_SECTION[0].fields.push({
          ...attributes,
          documentURL: '',
          exclude_report: true,
          isRequired: false,
        });
        break;
      case DATE_FIELD:
        setFieldSchema(
          Yup.object().shape({
            label: Yup.string().required('Required'),
          })
        );
        PAGE_SECTION[0].fields.push({
          ...attributes,
          isRequired: false,
          defaultCurrent: false,
        });
        break;
      case VIDEO_FIELD:
        setFieldSchema(
          Yup.object().shape({
            label: Yup.string().required('Required'),
          })
        );
        PAGE_SECTION[0].fields.push({
          ...attributes,
          accepts: 'video/*',
          isRequired: false,
        });
        break;
      case SINGLE_PHOTO_FIELD:
        setFieldSchema(
          Yup.object().shape({
            label: Yup.string().required('Required'),
          })
        );
        PAGE_SECTION[0].fields.push({
          ...attributes,
          isMultple: false,
          accepts: 'image/*',
          allowCamera: true,
          allowPhotoLibrary: false,
          isRequired: false,
        });
        break;
      case MULTIPLE_PHOTO_FIELD:
        setFieldSchema(
          Yup.object().shape({
            label: Yup.string().required('Required'),
          })
        );
        PAGE_SECTION[0].fields.push({
          ...attributes,
          isMultple: true,
          accepts: 'image/*',
          isRequired: false,
        });
        break;
      case LOCATION:
        setFieldSchema(
          Yup.object().shape({
            label: Yup.string().required('Required'),
          })
        );
        PAGE_SECTION[0].fields.push({
          ...attributes,
          isRequired: false,
        });
        break;
      case SUB_FORM:
        PAGE_SECTION[0].fields.push({
          id: id,
          fieldType: SUB_FORM,
          type: SUB_FORM,
          label: selectedSubForm?.label,
          value: selectedSubForm?.value,
        });
        break;
      case SWITCH:
      case TOGGLE:
      case SIGNATURE:
        setFieldSchema(
          Yup.object().shape({
            label: Yup.string().required('Required'),
          })
        );
        PAGE_SECTION[0].fields.push({
          ...attributes,
        });
        break;
      case RADIO_OPTIONS:
      case CHECKBOX_OPTIONS:
        setFieldSchema(
          Yup.object().shape({
            label: Yup.string().required('Required'),
          })
        );
        PAGE_SECTION[0].fields.push({
          ...attributes,
          options: [],
        });
        break;
      default:
        break;
    }
    setFormFields(FORMFIELD_COPY);
  };

  function countIdOccurrences(array, targetId) {
    let count = 0;

    array.forEach((obj) => {
      if (obj.id === targetId) {
        count++;
      }
      if (Array.isArray(obj.assinged_fields)) {
        count += countIdOccurrences(obj.assinged_fields, targetId);
      }
    });

    return count;
  }

  const updateFormFields = (values) => {
    setIsEditing(true);
    let PAGE_SECTION = formFields.filter(
      (x) => x.page === currentPage && x.sections === currentSection
    );
    let FIELDS = PAGE_SECTION[0].fields;
    const SELECTED_FIELD = FIELDS.find((x) => x.id === selectedField);
    let UPDATED_FIELDS;

    const ASSIGNING_FIELD = FIELDS.find(
      (x) =>
        x.id ===
        values.assinged_fields?.[values.assinged_fields?.length - 1].value
    );

    if (
      SELECTED_FIELD.fieldType === SWITCH &&
      countIdOccurrences(FIELDS, selectedField) === 3 &&
      ASSIGNING_FIELD.fieldType === SWITCH
    ) {
      toast.custom((t) => (
        <Toast
          t={t}
          title="Error"
          message="You can't assign any switch field. Maximum 3 nested fields only allowed!"
          toast={toast}
        />
      ));
      return;
    }

    const ASSINGED_TO_SWITCH = FIELDS.find((field) =>
      field.assinged_fields?.some((aField) => aField.id === selectedField)
    );

    const ASSINGED_TO_SWITCH_TWO = FIELDS.find((field) =>
      field.assinged_fields?.some((aField) =>
        aField.assinged_fields?.some((aField) => aField.id === selectedField)
      )
    )?.assinged_fields.find((x) =>
      x.assinged_fields?.some((y) => y.id === selectedField)
    );

    const ASSINGED_TO_SWITCH_THREE = FIELDS.find((field) =>
      field.assinged_fields?.some((aField) =>
        aField.assinged_fields?.some((aField) =>
          aField.assinged_fields?.some((aField) => aField.id === selectedField)
        )
      )
    )
      ?.assinged_fields.find((x) =>
        x.assinged_fields?.some((y) =>
          y.assinged_fields?.some((y) => y.id === selectedField)
        )
      )
      ?.assinged_fields.find((x) =>
        x.assinged_fields?.some((y) => y.id === selectedField)
      );

    UPDATED_FIELDS = updateObjectValues(
      SELECTED_FIELD,
      values,
      FIELDS,
      ASSINGED_TO_SWITCH
    );

    if (ASSINGED_TO_SWITCH_THREE) {
      const FIELD = ASSINGED_TO_SWITCH_THREE.assinged_fields?.find(
        (field) => field.id === selectedField
      );

      updateObjectValues(FIELD, values);
    }

    if (ASSINGED_TO_SWITCH_TWO) {
      const FIELD = ASSINGED_TO_SWITCH_TWO.assinged_fields?.find(
        (field) => field.id === selectedField
      );

      updateObjectValues(FIELD, values);
    }

    if (ASSINGED_TO_SWITCH) {
      const FIELD = ASSINGED_TO_SWITCH.assinged_fields?.find(
        (field) => field.id === selectedField
      );

      updateObjectValues(FIELD, values);
    }

    UPDATED_FIELDS = updateObjectValues(
      SELECTED_FIELD,
      values,
      FIELDS,
      ASSINGED_TO_SWITCH,
      ASSINGED_TO_SWITCH_TWO
    );

    FIELDS = UPDATED_FIELDS;
    setFormFields(PAGE_SECTION);
  };

  const duplicateFormFields = () => {
    setIsEditing(true);
    const id = uuidv4();

    const FORM_FIELDS = formFields;

    const PAGE_SECTION = FORM_FIELDS.find(
      (page) => page.page === currentPage && page.sections === currentSection
    );

    const PAGE_INDEX = FORM_FIELDS.findIndex(
      (x) =>
        x.page === PAGE_SECTION.page && x.sections === PAGE_SECTION.sections
    );

    const FIELD = PAGE_SECTION.fields?.find(
      (field) => field.id === selectedField
    );

    const COPY_FIELD = { ...FIELD, id: id };

    PAGE_SECTION.fields.push(COPY_FIELD);
    FORM_FIELDS[PAGE_INDEX] = PAGE_SECTION;

    setFormFields(FORM_FIELDS);
    setSelectedField(id);
  };

  const removeField = (id) => {
    setIsEditing(true);
    let PAGE_SECTION = formFields.filter(
      (x) => x.page === currentPage && x.sections === currentSection
    );

    PAGE_SECTION[0].fields = PAGE_SECTION[0].fields.filter((x) => x.id !== id);
    const index = formFields.findIndex(
      (x) =>
        x.page === PAGE_SECTION[0].page &&
        x.sections === PAGE_SECTION[0].sections
    );

    let FORMFIELD_COPY = [...formFields];
    FORMFIELD_COPY[index] = PAGE_SECTION[0];
    if (FORMFIELD_COPY[index].fields.length === 0) {
      setFormFields(
        FORMFIELD_COPY.filter((x) => x.page !== FORMFIELD_COPY[index].page)
      );
    } else {
      setFormFields(FORMFIELD_COPY);
    }
  };

  const createForm = async (saveType) => {
    setIsEditing(false);
    try {
      const isLabelEmpty = formFields.some((pages) =>
        pages.fields.some((field) => field.name === '')
      );

      if (isLabelEmpty) {
        toast.custom((t) => (
          <Toast
            t={t}
            title="Field label is mandatory."
            message="Please give a name to the field!"
            toast={toast}
          />
        ));

        return;
      }

      if (!formTitle) {
        toast.custom((t) => (
          <Toast
            t={t}
            title="Error"
            message="Please give a name to your form!"
            toast={toast}
          />
        ));

        return;
      }

      if (!formFields.length) {
        toast.custom((t) => (
          <Toast
            t={t}
            title="Error"
            message="The template is empty!"
            toast={toast}
          />
        ));

        return;
      }

      const isUpdatedFields = formFields !== prevFormFieldsRef.current;
      const isUpdatedPages = pages !== prevFormPagesRef.current;
      const isUpdatedSections = sections !== prevFormSectionsRef.current;

      setIsSubmitting(true);
      const formObj = {
        pages: pages,
        sections: sections,
        forms: formFields,
      };

      const body = {};

      if (query.formId) {
        body['updated_at'] = new Date().toISOString();
        // body['updated_by'] = user?.id;
        body['version'] = `v${formVersion}`;
      } else {
        body['submitted_on'] = new Date().toISOString();
        body['last_date'] = new Date().toISOString();
        body['created_at'] = new Date().toISOString();
        body['updated_at'] = new Date().toISOString();
        body['version'] = `v${formVersion}`;
        body['updated_by'] = user?.id;
        body['created_by'] = user?.id;
      }

      let response = {};

      if (query.form_type === SUB_FORM_TYPE) {
        // SUB FORM TYPE
        body['name'] = formTitle;
        body['form_details_json'] = formObj;
        body['status'] = saveType;
        response = await createUpdateSubForm(body, user.id, query.formId);
        response['form_type'] = SUB_FORM_TYPE;
        router.back();
      } else if (query.form_type === TEMPLATE_TYPE) {
        // TEMPLATE FORM TYPE
        body['template_name'] = formTitle;
        body['template_details_json'] = formObj;
        body['status'] = saveType;
        response = await createUpdateTemplate(body, user.id, query.formId);
        response['form_type'] = TEMPLATE_TYPE;
        router.back();
      } else {
        // MAIN FORM TYPE
        body['form_name'] = formTitle;
        body['form_details_json'] = formObj;
        body['status'] = saveType;

        if (isUpdatedFields || isUpdatedPages || isUpdatedSections) {
          response = await createUpdateMainForm(body, user?.id, query.formId);
          prevFormPagesRef.current = pages;
          prevFormSectionsRef.current = sections;
          prevFormFieldsRef.current = formFields;
        }

        response['form_type'] = MAIN_FORM_TYPE;

        const formId = query?.formId ?? response?.data?.id;

        if (formId) {
          await router.push(
            `${FORM_SETTINGS_ROUTE}/delivery?form_type=${query.form_type}&formId=${formId}`
          );
        }
      }
    } catch (error) {
      console.log('create form error', error);
    }

    setIsSubmitting(false);
  };

  const fetchForm = async () => {
    try {
      let res;
      if (query.form_type === MAIN_FORM_TYPE) {
        res = await api.form.getForm(user.id, query.formId);
      } else if (query.form_type === SUB_FORM_TYPE) {
        res = await api.form.getSubForm(user.id, query.formId);
      } else if (query.form_type === TEMPLATE_TYPE) {
        res = await api.form.getTemplate(user.id, query.formId);
      }

      let FORM_DATA;

      if (res && query.form_type === TEMPLATE_TYPE) {
        FORM_DATA = res.data?.template_details_json;
        setFormTitle(res.data?.template_name);
      } else {
        FORM_DATA = res.data?.form_details_json;
        setFormTitle(res.data?.form_name || res.data?.name);
      }

      setPages(FORM_DATA.pages);
      setSections(FORM_DATA.sections);
      setFormFields(FORM_DATA.forms);
      setFormVersion(parseInt(res.data?.version.slice(1)) + 1);
      prevFormPagesRef.current = FORM_DATA.pages;
      prevFormSectionsRef.current = FORM_DATA.sections;
      prevFormFieldsRef.current = FORM_DATA.forms;
    } catch (error) {
      console.log('error', error);
    }
  };

  const selectTemplate = async (id) => {
    setIsEditing(true);
    try {
      const res = await api.form.getTemplate(user.id, id);
      const FORM_DATA = res.data.template_details_json;
      setPages(FORM_DATA.pages);
      setSections(FORM_DATA.sections);
      setFormFields(FORM_DATA.forms);
    } catch (error) {
      console.log('error', error);
    }
  };

  const deleteForm = async () => {
    if (query.form_type === MAIN_FORM_TYPE) {
      await api.form.deleteForm(user.id, query.formId);
    } else if (query.form_type === SUB_FORM_TYPE) {
      await api.form.deleteSubForm(user.id, query.formId);
    } else if (query.form_type === TEMPLATE_TYPE) {
      await api.form.deleteFormTemplate(user.id, query.formId);
    }
    router.push(FORM_ROUTE);
  };

  const duplicateForm = async (title) => {
    try {
      if (title) {
        const formObj = {
          pages: pages,
          sections: sections,
          forms: formFields,
        };

        const body = {};
        body['submitted_on'] = new Date().toISOString();
        body['last_date'] = new Date().toISOString();
        body['created_at'] = new Date().toISOString();
        body['updated_at'] = new Date().toISOString();
        body['version'] = `v1`;
        body['updated_by'] = user?.id;
        body['created_by'] = user?.id;

        let RESPONSE;

        if (query.form_type === MAIN_FORM_TYPE) {
          body['form_name'] = title;
          body['form_details_json'] = formObj;
          RESPONSE = await createUpdateMainForm(body);
        } else if (query.form_type === SUB_FORM_TYPE) {
          body['name'] = title;
          body['form_details_json'] = formObj;
          RESPONSE = await createUpdateSubForm(body);
        } else if (query.form_type === TEMPLATE_TYPE) {
          body['template_name'] = title;
          body['template_details_json'] = formObj;
          RESPONSE = await createUpdateTemplate(body);
        }
        if (RESPONSE?.data) {
          router.push({
            pathname: CREATE_FORM_TEMPLATE_ROUTE,
            query: { form_type: query.form_type, formId: RESPONSE.data.id },
          });
        }
        setIsDuplicateModalOpen(false);
        toast.custom((t) => (
          <Toast
            t={t}
            title="Success"
            message="Form duplicated successfully!"
            toast={toast}
          />
        ));
      }
    } catch (error) {
      toast.custom((t) => (
        <Toast
          t={t}
          title="Error"
          message="Something went wrong!"
          toast={toast}
        />
      ));
    }
  };

  const saveAsTemplate = async () => {
    try {
      if (!formTitle) {
        toast.custom((t) => (
          <Toast
            t={t}
            title="Error"
            message="Please give a name to your form!"
            toast={toast}
          />
        ));

        return;
      }

      if (!formFields.length) {
        toast.custom((t) => (
          <Toast
            t={t}
            title="Error"
            message="The template is empty!"
            toast={toast}
          />
        ));

        return;
      }

      const formObj = {
        pages: pages,
        sections: sections,
        forms: formFields,
      };

      const body = {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: user?.id,
        created_by: user?.id,
        template_name: formTitle,
        template_details_json: JSON.stringify(formObj),
      };

      await createUpdateTemplate(body);
    } catch (error) {
      console.log('create form error', error);
    }
  };

  const fetchSubformPreview = async (formId) => {
    const response = await api.form.getSubForm(user.id, formId);
    const FORM_DATA = response.data.form_details_json;
    setFormTitle(response.data.form_name || response.data.name);
    setPages(FORM_DATA.pages);
    setSections(FORM_DATA.sections);
    setFormFields(FORM_DATA.forms);
    router.push({
      pathname: CREATE_FORM_TEMPLATE_ROUTE,
      query: { form_type: SUB_FORM_TYPE, formId: formId },
    });
  };

  const value = useMemo(
    () => ({
      pages,
      sections,
      currentPage,
      currentSection,
      openRightPanel,
      formFields,
      selectedField,
      formTitle,
      isLoading,
      selectedSubForm,
      isDuplicateModalOpen,
      isPreview,
      formVersion,
      isSubmitting,
      fieldType,
      fieldSchema,
      isEditing,
      createPages,
      setCurrentPage,
      createSections,
      setCurrentSection,
      createFormFields,
      setOpenRightPanel,
      setSelectedField,
      setFormFields,
      removeField,
      setFormTitle,
      createForm,
      setIsLoading,
      updateFormFields,
      setSelectedSubForm,
      selectTemplate,
      deleteForm,
      setIsDuplicateModalOpen,
      duplicateForm,
      saveAsTemplate,
      setIsPreview,
      setSections,
      updateSections,
      fetchSubformPreview,
      updatePage,
      setFieldType,
      duplicateFormFields,
      setFieldSchema,
      setIsEditing,
    }),
    [
      pages,
      currentPage,
      sections,
      currentSection,
      openRightPanel,
      formFields,
      selectedField,
      formTitle,
      isLoading,
      selectedSubForm,
      isDuplicateModalOpen,
      isPreview,
      formVersion,
      isSubmitting,
      fieldType,
      fieldSchema,
      isEditing,
    ]
  );

  useEffect(() => {
    if (query.formId && router.pathname === CREATE_FORM_TEMPLATE_ROUTE) {
      fetchForm().catch((e) => console.log(e));
    }

    return () => {
      setFormTitle('');
      setPages([{ id: 1, name: 'Page 1' }]);
      setSections([{ id: 1, pageId: 1, name: 'Section 1' }]);
      setFormFields([]);
      setFormVersion(1);
    };
  }, [query]);

  useEffect(() => {
    // For reloading.
    window.onbeforeunload = () => {
      if (isEditing) {
        return 'You have unsaved changes. Do you really want to leave?';
      }
    };
  }, [isEditing]);

  useEffect(() => {
    router.beforePopState(({ as }) => {
      const currentPath = router.asPath;
      if (as !== currentPath && isEditing) {
        // Will run when leaving the current page; on back/forward actions
        // Add your logic here, like toggling the modal state
        // for example
        if (confirm('Are you sure?')) return true;
        else {
          window.history.pushState(null, '', currentPath);
          return false;
        }
      }
      return true;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router, isEditing]);

  return (
    <FormsContext.Provider value={value}>{children}</FormsContext.Provider>
  );
};

export const useForms = () => {
  return useContext(FormsContext);
};

const createUpdateMainForm = async (body, userId, formId) => {
  try {
    if (formId) {
      const res = await api.form.updateForm(body, userId, formId);
      toast.custom((t) => (
        <Toast
          t={t}
          title="Success"
          message="Form updated successfully!"
          toast={toast}
        />
      ));
      return res;
    } else {
      const res = await api.form.createForm(body);
      await linkSubForm(res);
      return res;
    }
  } catch (error) {
    console.log('main form error', error);
  }
};

const linkSubForm = async (values) => {
  const FORM_ID = values.data.id;
  const FORMS = values.data.form_details_json;
  const user = getAuthUser();

  const bulk = [];
  const sub_form_details_json = [];

  await Promise.all(
    FORMS.forms.map(async (form) => {
      await Promise.all(
        form.fields.map(async (field) => {
          if (field.fieldType === SUB_FORM) {
            let subFormResponse = await api.form.getSubForm(
              user.id,
              field.value
            );
            let form_details_json = subFormResponse.data.form_details_json;
            let KEY = `sub_form_${field.value}`;

            bulk.push({ sub_form_id: field.value });
            sub_form_details_json.push({
              [KEY]: form_details_json,
            });
          }
        })
      );
    })
  );

  const LINK_BODY = {
    form_id: FORM_ID,
    bulk: bulk,
    sub_form_details_json: sub_form_details_json,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: user.id,
    updated_by: user.id,
  };
  await api.form.createLink(LINK_BODY);
};

const createUpdateSubForm = async (body, userId, formId) => {
  try {
    if (formId) {
      await api.form.updateSubForm(body, userId, formId);
      toast.custom((t) => (
        <Toast
          t={t}
          title="Success"
          message="Sub form updated successfully!"
          toast={toast}
        />
      ));
    } else {
      return await api.form.createSubForm(body);
    }
  } catch (error) {
    console.log('sub form error', error);
  }
};

const createUpdateTemplate = async (body, userId, formId) => {
  try {
    if (formId) {
      await api.form.updateFormTemplate(body, userId, formId);
      toast.custom((t) => (
        <Toast
          t={t}
          title="Success"
          message="Template updated successfully!"
          toast={toast}
        />
      ));
    } else {
      return await api.form.createFormTemplate(body);
    }
  } catch (error) {
    console.log('sub form error', error);
  }
};

const updateObjectValues = (
  field,
  values,
  FIELDS,
  ASSINGED_TO_SWITCH,
  ASSINGED_TO_SWITCH_TWO
) => {
  return Object.keys(values).forEach((key) => {
    if (field[key] !== values[key]) {
      field[key] = values[key];
      field['name'] = values.label?.replace(/\s/g, '_').toLowerCase();
    }

    if (field.fieldType === TOGGLE) {
      field['yes_fields'] = FIELDS?.filter((field1) =>
        values.yes_fields?.some((field2) => field2.value === field1.id)
      )?.map((val) => ({
        ...val,
        value: val.id, // for dropdown value
      }));
      field['no_fields'] = FIELDS?.filter((field1) =>
        values.no_fields?.some((field2) => field2.value === field1.id)
      )?.map((val) => ({
        ...val,
        value: val.id, // for dropdown value
      }));
    }

    if (field.fieldType === STATIC_TEXT) {
      field['name'] = values.text.split(' ').slice(0, 3).join('_');
      field['label'] = values.text.split(' ').slice(0, 3).join('_');
    }

    if (field.fieldType === SWITCH && FIELDS) {
      field['assinged_fields'] = FIELDS?.filter((field1) =>
        values.assinged_fields?.some((field2) => field2.value === field1.id)
      )?.map((val) => ({
        ...val,
        value: val.id,
      }));

      if (ASSINGED_TO_SWITCH) {
        let SELECTED_SWITCH = ASSINGED_TO_SWITCH.assinged_fields?.find(
          (x) => x.id === field.id
        );

        SELECTED_SWITCH.assinged_fields = FIELDS?.filter((field1) =>
          values.assinged_fields?.some((field2) => field2.value === field1.id)
        )?.map((val) => ({
          ...val,
          value: val.id,
        }));
      }

      if (ASSINGED_TO_SWITCH_TWO) {
        let SELECTED_SWITCH = ASSINGED_TO_SWITCH_TWO.assinged_fields?.find(
          (x) => x.id === field.id
        );

        SELECTED_SWITCH.assinged_fields = FIELDS?.filter((field1) =>
          values.assinged_fields?.some((field2) => field2.value === field1.id)
        )?.map((val) => ({
          ...val,
          value: val.id,
        }));
      }
    }
  });
};
