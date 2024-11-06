import api from '@/api';
import Card from '@/components/Card';
import FormWrapper from '@/components/Form';
import RightPanel from '@/components/RightPanel';
import Toast from '@/components/Toast';
import Button from '@/components/UI/Button';
import ReactSelect from '@/components/UI/Select/ReactSelect';
import TextInput from '@/components/UI/TextInput';
import { CardType } from '@/constants';
import { NUMERIC_FIELD } from '@/constants/fieldType';
import { getAuthUser } from '@/utils/auth';
import { Form } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';

const AddViewRightPanel = ({
  addViewRightPanel,
  setAddViewRightPanel,
  fetchAllCards,
}) => {
  const [addDataRightPanel, setAddDataRightPanel] = useState(false);
  const [cardType, setCardType] = useState('');
  const [forms, setForms] = useState([]);

  const user = getAuthUser();

  const fetchForms = async () => {
    try {
      const response = await api.form.getAllForms(user.id);
      const forms = response?.data?.map((form) => ({
        id: form.id,
        formName: form.form_name,
        lastDate: form.last_date,
        version: form.version,
        editedBy: form.up_user.username,
      }));

      setForms(forms);
    } catch (error) {
      console.log(
        'Error at Component > Template > AddViewRightPanel > line: 43',
        error
      );
      toast.custom((t) => (
        <Toast
          t={t}
          title="Error"
          message="Something went wrong, Try again later!"
          toast={toast}
        />
      ));
    }
  };

  useEffect(() => {
    fetchForms().catch((e) => console.log(e));
  }, []);

  return (
    <>
      {/* Add view */}
      <RightPanel
        title="Add View"
        rightPanelOpen={addViewRightPanel}
        setRightPanelOpen={setAddViewRightPanel}
      >
        <div className="mt-10 space-y-6">
          <div>
            <p className="mb-2">Metric Card</p>
            <Card>
              <button
                onClick={() => {
                  setAddViewRightPanel(false);
                  setCardType(CardType.METRIC);
                }}
              >
                <header className="flex items-center px-5 py-4 border-b border-slate-100">
                  <h2 className="font-semibold text-slate-800">Card Name</h2>
                </header>
                <div className="relative w-full h-[80px]">
                  <Image
                    src="/images/metric.png"
                    alt="Vertical chart"
                    fill={true}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </button>
            </Card>
          </div>
          <div>
            <p className="mb-2">Vertical card</p>
            <Card>
              <button
                onClick={() => {
                  setAddViewRightPanel(false);
                  setCardType(CardType.VERTICAL);
                }}
              >
                <header className="flex items-center px-5 py-4 border-b border-slate-100">
                  <h2 className="font-semibold text-slate-800">Card Name</h2>
                </header>
                <div className="relative w-full h-[350px]">
                  <Image
                    src="/images/vertical.png"
                    alt="Vertical chart"
                    fill={true}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </button>
            </Card>
          </div>
          <div>
            <p className="mb-2">Doughnut Chart</p>
            <Card>
              <button
                onClick={() => {
                  setAddViewRightPanel(false);
                  setCardType(CardType.DAUGHNUT);
                }}
              >
                <header className="flex items-center px-5 py-4 border-b border-slate-100">
                  <h2 className="font-semibold text-slate-800">Card Name</h2>
                </header>
                <div className="relative w-full h-[300px]">
                  <Image
                    src="/images/doughnut.png"
                    alt="Vertical chart"
                    fill={true}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </button>
            </Card>
          </div>
        </div>
      </RightPanel>

      {/* Add Data */}
      <RightPanel
        title="Add Graph"
        rightPanelOpen={!!cardType}
        setRightPanelOpen={() => setCardType('')}
      >
        {RenderForm(cardType, setCardType, forms, fetchAllCards)}
      </RightPanel>
    </>
  );
};

export default AddViewRightPanel;

const RenderForm = (cardType, setCardType, forms, fetchAllCards) => {
  switch (cardType) {
    case CardType.METRIC:
      return (
        <MetricForm
          setCardType={setCardType}
          forms={forms}
          fetchAllCards={fetchAllCards}
        />
      );

    case CardType.VERTICAL:
      return (
        <VerticalForm
          setCardType={setCardType}
          forms={forms}
          fetchAllCards={fetchAllCards}
        />
      );

    case CardType.DAUGHNUT:
      return (
        <DaughnutForm
          setCardType={setCardType}
          forms={forms}
          fetchAllCards={fetchAllCards}
        />
      );

    default:
      break;
  }
};

const MetricForm = ({ setCardType, forms, fetchAllCards }) => {
  const [options, setOptions] = useState([]); // array of objects
  const [selectedForm, setSelectedForm] = useState(null); // id
  const [selectedField, setSelectedField] = useState(null); // object

  const router = useRouter();
  const user = getAuthUser();

  const schema = {
    card_name: Yup.string().required('This field cannot be empty'),
    form: Yup.string().required('This field cannot be empty'),
    numeric_field_1: Yup.string().required('This field cannot be empty'),
  };
  const validationSchema = Yup.object().shape(schema);

  // Submit form handler
  const formSubmit = async (values) => {
    try {
      const date = new Date();

      const data = {
        form_id: selectedForm,
        project_id: router.asPath.includes('/project')
          ? parseInt(router.query.projectId)
          : null,
        card_name: values.card_name,
        created_at: date.toISOString(),
        updated_at: date.toISOString(),
        created_by: user.id,
        updated_by: user.id,
        form_field_names: [
          {
            user_id: user.id,
            form_id: selectedForm,
            field_name: selectedField,
            cart_type: CardType.METRIC,
          },
        ],
        status: 1,
        // type: router.asPath.includes('/project') ? 'project' : 'main',
      };

      if (router.asPath.includes('/project')) {
        await api.project.createProjectCard(data);
      } else {
        await api.dashboard.createDashboardCard(data);
      }

      fetchAllCards();
      setCardType('');
    } catch (error) {
      console.log('>>', error);
      toast.custom((t) => (
        <Toast
          t={t}
          title="Error"
          message="Something went wrong, Try again later!"
          toast={toast}
        />
      ));
    }
  };

  // Numeric field change handler
  const handleFieldChange = (selectedOption) => {
    setSelectedField(selectedOption);
  };

  // Form change handler
  const handleChange = async (e) => {
    setSelectedField(' ');
    setSelectedForm(e.value);
    try {
      const RES = await api.project.getFormDetails(e.value);
      const form = RES.data.form_details_json;

      const fields = [];

      form.forms.map((page) => {
        page.fields.map((field) => {
          if (field.fieldType === NUMERIC_FIELD) {
            fields.push(field);
          }
        });
      });

      setOptions(fields);
    } catch (error) {
      console.log('>>', error);
      toast.custom((t) => (
        <Toast
          t={t}
          title="Error"
          message="Something went wrong, Try again later!"
          toast={toast}
        />
      ));
    }
  };

  return (
    <FormWrapper
      validationSchema={validationSchema}
      initialValues={{}}
      handleSubmit={formSubmit}
    >
      {({ errors, setFieldValue, isSubmitting }) => (
        <Form className="flex flex-col justify-between min-h-[calc(100vh-12rem)] mt-10 gap-9">
          <div className="space-y-9">
            <TextInput
              required={true}
              label="Card name"
              placeholder=""
              name="card_name"
              type="text"
              error={errors}
            />
            <div className="w-full">
              <label
                className="block mb-1 text-sm text-[#475569]"
                htmlFor="form"
              >
                Choose your form<span className="text-red-500">*</span>
              </label>

              <ReactSelect
                field={{ name: 'form' }}
                options={forms.map((form) => ({
                  value: form.id,
                  label: form.formName,
                }))}
                onSelectChange={(e) => {
                  handleChange(e);
                  setFieldValue('form', e.value);
                }}
                error={errors}
              />
              {errors['form'] && (
                <small className="text-red-500">{errors['form']}</small>
              )}
            </div>

            <div className="w-full">
              <label
                className="block mb-1 text-sm text-[#475569]"
                htmlFor="numeric_field_1"
              >
                Choose your numeric field 1
                <span className="text-red-500">*</span>
              </label>

              <ReactSelect
                field={{ name: 'numeric_field_1' }}
                options={options.map((field) => ({
                  value: field.name,
                  label: field.label,
                }))}
                value={selectedField}
                onSelectChange={(e) => {
                  handleFieldChange(e, setSelectedField);
                  setFieldValue('numeric_field_1', e.value);
                }}
              />
              {errors['numeric_field_1'] && (
                <small className="text-red-500">
                  {errors['numeric_field_1']}
                </small>
              )}
            </div>
          </div>

          <div className="space-x-2">
            <Button onBtnClick={() => setCardType('')} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="filled">
              Save & Close
            </Button>
          </div>
        </Form>
      )}
    </FormWrapper>
  );
};

const VerticalForm = ({ setCardType, forms, fetchAllCards }) => {
  const [options, setOptions] = useState([]); // array of objects
  const [selectedForm, setSelectedForm] = useState(null); // id
  const [selectedField1, setSelectedField1] = useState(null); // object
  const [selectedField2, setSelectedField2] = useState(null); // object

  const router = useRouter();
  const user = getAuthUser();

  const schema = {
    card_name: Yup.string().required('This field cannot be empty'),
    form: Yup.string().required('This field cannot be empty'),
    numeric_field_1: Yup.string().required('This field cannot be empty'),
    numeric_field_2: Yup.string().required('This field cannot be empty'),
  };
  const validationSchema = Yup.object().shape(schema);

  // Submit form handler
  const formSubmit = async (values) => {
    try {
      const date = new Date();

      const data = {
        form_id: selectedForm,
        project_id: parseInt(router.query.projectId),
        card_name: values.card_name,
        created_at: date.toISOString(),
        updated_at: date.toISOString(),
        created_by: user.id,
        updated_by: user.id,
        form_field_names: [
          {
            user_id: user.id,
            form_id: selectedForm,
            field_name: selectedField1,
            cart_type: CardType.VERTICAL,
          },
          {
            user_id: user.id,
            form_id: selectedForm,
            field_name: selectedField2,
            cart_type: CardType.VERTICAL,
          },
        ],
        type: router.asPath.includes('/project') ? 'project' : 'main',
      };

      await api.project.createProjectCard(data);
      fetchAllCards();
      setCardType('');
    } catch (error) {
      console.log('>>', error);
      toast.custom((t) => (
        <Toast
          t={t}
          title="Error"
          message="Something went wrong, Try again later!"
          toast={toast}
        />
      ));
    }
  };

  // Numeric field change handler
  const handleFieldChange = (selectedOption, setState) => {
    setState(selectedOption);
  };

  // Form change handler
  const handleChange = async (e) => {
    setSelectedField1(' ');
    setSelectedField2(' ');

    setSelectedForm(e.value);
    try {
      const RES = await api.project.getFormDetails(e.value);
      const form = RES.data.form_details_json;
      const fields = form.forms[0].fields;

      const numberFields = fields.filter(
        (field) => field.fieldType === NUMERIC_FIELD
      );

      setOptions(numberFields);
    } catch (error) {
      console.log('>>', error);
      toast.custom((t) => (
        <Toast
          t={t}
          title="Error"
          message="Something went wrong, Try again later!"
          toast={toast}
        />
      ));
    }
  };

  return (
    <FormWrapper
      validationSchema={validationSchema}
      initialValues={{}}
      handleSubmit={formSubmit}
    >
      {({ errors, setFieldValue, isSubmitting }) => (
        <Form className="flex flex-col justify-between min-h-[calc(100vh-12rem)] mt-10 gap-9">
          <div className="space-y-9">
            <TextInput
              required={true}
              label="Card name"
              placeholder=""
              name="card_name"
              type="text"
              error={errors}
            />
            <div className="w-full">
              <label
                className="block mb-1 text-sm text-[#475569]"
                htmlFor="form"
              >
                Choose your form<span className="text-red-500">*</span>
              </label>

              <ReactSelect
                field={{ name: 'form' }}
                options={forms.map((form) => ({
                  value: form.id,
                  label: form.formName,
                }))}
                onSelectChange={(e) => {
                  handleChange(e);
                  setFieldValue('form', e.value);
                }}
                error={errors}
              />
              {errors['form'] && (
                <small className="text-red-500">{errors['form']}</small>
              )}
            </div>

            <div className="w-full">
              <label
                className="block mb-1 text-sm text-[#475569]"
                htmlFor="numeric_field_1"
              >
                Choose your numeric field 1
                <span className="text-red-500">*</span>
              </label>

              <ReactSelect
                field={{ name: 'numeric_field_1' }}
                options={options.map((field) => ({
                  value: field.name,
                  label: field.label,
                }))}
                value={selectedField1}
                onSelectChange={(e) => {
                  handleFieldChange(e, setSelectedField1);
                  setFieldValue('numeric_field_1', e.value);
                }}
              />
              {errors['numeric_field_1'] && (
                <small className="text-red-500">
                  {errors['numeric_field_1']}
                </small>
              )}
            </div>

            <div className="w-full">
              <label
                className="block mb-1 text-sm text-[#475569]"
                htmlFor="numeric_field_2"
              >
                Choose your numeric field 2
                <span className="text-red-500">*</span>
              </label>

              <ReactSelect
                field={{ name: 'numeric_field_2' }}
                options={options.map((field) => ({
                  value: field.name,
                  label: field.label,
                }))}
                value={selectedField2}
                onSelectChange={(e) => {
                  handleFieldChange(e, setSelectedField2);
                  setFieldValue('numeric_field_2', e.value);
                }}
              />
              {errors['numeric_field_2'] && (
                <small className="text-red-500">
                  {errors['numeric_field_2']}
                </small>
              )}
            </div>
          </div>

          <div className="space-x-2">
            <Button onBtnClick={() => setCardType('')} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="filled">
              Save & Close
            </Button>
          </div>
        </Form>
      )}
      {/* <Form className="flex flex-col justify-between min-h-[calc(100vh-12rem)] mt-10 gap-9">
          <div className="space-y-9">
            <TextInput
              required={true}
              label="Card name"
              placeholder=""
              name="card_name"
              type="text"
            />
            <div className="w-full">
              <label className="block mb-1 text-sm text-[#475569]" htmlFor="form">
                Choose your form
              </label>
  
              <ReactSelect
                field={{ name: "form" }}
                options={forms.map((form) => ({
                  value: form.id,
                  label: form.formName,
                }))}
                onSelectChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
  
            <div className="w-full">
              <label
                className="block mb-1 text-sm text-[#475569]"
                htmlFor="numeric-field-1"
              >
                Choose your field
              </label>
  
              <ReactSelect
                field={{ name: "numeric-field-1" }}
                options={options.map((field) => ({
                  value: field.name,
                  label: field.label,
                }))}
                value={selectedField1}
                onSelectChange={(e) => handleFieldChange(e, setSelectedField1)}
              />
            </div>
            <div className="w-full">
              <label
                className="block mb-1 text-sm text-[#475569]"
                htmlFor="numeric-field-2"
              >
                Choose your field
              </label>
  
              <ReactSelect
                field={{ name: "numeric-field-2" }}
                options={options.map((field) => ({
                  value: field.name,
                  label: field.label,
                }))}
                value={selectedField2}
                onSelectChange={(e) => handleFieldChange(e, setSelectedField2)}
              />
            </div>
          </div>
  
          <div className="space-x-2">
            <Button onBtnClick={() => setCardType("")} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="filled">
              Save & Close
            </Button>
          </div>
        </Form> */}
    </FormWrapper>
  );
};

const DaughnutForm = ({ setCardType, forms, fetchAllCards }) => {
  const [options, setOptions] = useState([]); // array of objects
  const [selectedForm, setSelectedForm] = useState(null); // id
  const [selectedField1, setSelectedField1] = useState(null); // object
  const [selectedField2, setSelectedField2] = useState(null); // object

  const schema = {
    card_name: Yup.string().required('This field cannot be empty'),
    form: Yup.string().required('This field cannot be empty'),
    numeric_field_1: Yup.string().required('This field cannot be empty'),
    numeric_field_2: Yup.string().required('This field cannot be empty'),
    total_number: Yup.string().required('This field cannot be empty'),
  };
  const validationSchema = Yup.object().shape(schema);

  const router = useRouter();

  const user = getAuthUser();

  // Submit form handler
  const formSubmit = async (values) => {
    try {
      const date = new Date();

      const data = {
        form_id: selectedForm,
        project_id: parseInt(router.query.projectId),
        card_name: values.card_name,
        created_at: date.toISOString(),
        updated_at: date.toISOString(),
        created_by: user.id,
        updated_by: user.id,
        form_field_names: [
          {
            user_id: user.id,
            form_id: selectedForm,
            field_name: selectedField1,
            cart_type: CardType.DAUGHNUT,
          },
          {
            user_id: user.id,
            form_id: selectedForm,
            field_name: selectedField2,
            cart_type: CardType.DAUGHNUT,
          },
          {
            user_id: user.id,
            form_id: selectedForm,
            field_name: {
              label: 'Total Amount',
              value: values.total_number,
            },
            cart_type: CardType.DAUGHNUT,
          },
        ],
        type: router.asPath.includes('/project') ? 'project' : 'main',
      };

      await api.project.createProjectCard(data);
      fetchAllCards();
      setCardType('');
    } catch (error) {
      console.log(
        'Error at Component > Template > AddViewRightPanel > line: 708',
        error
      );
      toast.custom((t) => (
        <Toast
          t={t}
          title="Error"
          message="Something went wrong, Try again later!"
          toast={toast}
        />
      ));
    }
  };

  // Numeric field change handler
  const handleFieldChange = (selectedOption, setState) => {
    setState(selectedOption);
  };

  // Form change handler
  const handleChange = async (e) => {
    setSelectedField1(' ');
    setSelectedField2(' ');

    setSelectedForm(e.value);
    try {
      const RES = await api.project.getFormDetails(e.value);
      const form = RES.data.form_details_json;
      const fields = form.forms[0].fields;
      const numberFields = fields.filter(
        (field) => field.fieldType === NUMERIC_FIELD
      );

      setOptions(numberFields);
    } catch (error) {
      console.log(
        'Error at Component > Template > AddViewRightPanel > line: 745',
        error
      );
      toast.custom((t) => (
        <Toast
          t={t}
          title="Error"
          message="Something went wrong, Try again later!"
          toast={toast}
        />
      ));
    }
  };

  return (
    <FormWrapper
      validationSchema={validationSchema}
      initialValues={{}}
      handleSubmit={formSubmit}
    >
      {({ errors, setFieldValue, isSubmitting }) => (
        <Form className="flex flex-col justify-between min-h-[calc(100vh-12rem)] mt-10 gap-9">
          <div className="space-y-9">
            <TextInput
              required={true}
              label="Card name"
              placeholder=""
              name="card_name"
              type="text"
              error={errors}
            />
            <div className="w-full">
              <label
                className="block mb-1 text-sm text-[#475569]"
                htmlFor="form"
              >
                Choose your form<span className="text-red-500">*</span>
              </label>

              <ReactSelect
                field={{ name: 'form' }}
                options={forms.map((form) => ({
                  value: form.id,
                  label: form.formName,
                }))}
                onSelectChange={(e) => {
                  handleChange(e);
                  setFieldValue('form', e.value);
                }}
                error={errors}
              />
              {errors['form'] && (
                <small className="text-red-500">{errors['form']}</small>
              )}
            </div>

            <div className="w-full">
              <label
                className="block mb-1 text-sm text-[#475569]"
                htmlFor="numeric_field_1"
              >
                Choose your numeric field 1
                <span className="text-red-500">*</span>
              </label>

              <ReactSelect
                field={{ name: 'numeric_field_1' }}
                options={options.map((field) => ({
                  value: field.name,
                  label: field.label,
                }))}
                value={selectedField1}
                onSelectChange={(e) => {
                  handleFieldChange(e, setSelectedField1);
                  setFieldValue('numeric_field_1', e.value);
                }}
              />
              {errors['numeric_field_1'] && (
                <small className="text-red-500">
                  {errors['numeric_field_1']}
                </small>
              )}
            </div>

            <div className="w-full">
              <label
                className="block mb-1 text-sm text-[#475569]"
                htmlFor="numeric_field_2"
              >
                Choose your numeric field 2
                <span className="text-red-500">*</span>
              </label>

              <ReactSelect
                field={{ name: 'numeric_field_2' }}
                options={options.map((field) => ({
                  value: field.name,
                  label: field.label,
                }))}
                value={selectedField2}
                onSelectChange={(e) => {
                  handleFieldChange(e, setSelectedField2);
                  setFieldValue('numeric_field_2', e.value);
                }}
              />
              {errors['numeric_field_2'] && (
                <small className="text-red-500">
                  {errors['numeric_field_2']}
                </small>
              )}
            </div>

            <TextInput
              required={true}
              label="Choose total amount"
              placeholder=""
              name="total_number"
              type="number"
              error={errors}
            />
          </div>

          <div className="space-x-2">
            <Button onBtnClick={() => setCardType('')} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="filled">
              Save & Close
            </Button>
          </div>
        </Form>
      )}
    </FormWrapper>
  );
};
