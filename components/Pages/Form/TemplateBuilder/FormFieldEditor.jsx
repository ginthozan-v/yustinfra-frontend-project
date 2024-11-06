import React, { useEffect, useState } from 'react';
import { useForms } from '@/context/FormContext';
import { Form } from 'formik';
import FormWrapper from '@/components/Form';
import RightPanel from '@/components/RightPanel';
import ArrayFields from '@/components/UI/ArrayFields';
import Button from '@/components/UI/Button';
import Switch from '@/components/UI/Switch';
import TextInput from '@/components/UI/TextInput';
import {
  CHECKBOX_OPTIONS,
  DATE_FIELD,
  DOCUMENT,
  LOCATION,
  LONG_TEXT_FIELD,
  MULTIPLE_PHOTO_FIELD,
  NUMERIC_FIELD,
  RADIO_OPTIONS,
  SIGNATURE,
  SINGLE_PHOTO_FIELD,
  STATIC_IMAGE,
  STATIC_TEXT,
  SUB_FORM,
  SWITCH,
  TOGGLE,
  VIDEO_FIELD,
} from '@/constants/fieldType';
import useCheckMobileScreen from '@/hooks/useCheckMobileScreen';
import FileUploadButton from '@/components/UI/FilePicker/FileUploadButton';
import ColorPicker from '@/components/UI/ColorPicker';
import * as Yup from 'yup';
import ReactSelect from '@/components/UI/Select/ReactSelect';

const schema = Yup.object().shape({
  name: Yup.string().required('Required'),
});

const FormFieldEditor = () => {
  const {
    openRightPanel,
    setOpenRightPanel,
    setSelectedField,
    currentPage,
    sections,
    currentSection,
    formFields,
    selectedField,
    updateFormFields,
    updateSections,
    updatePage,
    pages,
    fieldType,
    setFieldType,
    formTitle,
    setFormTitle,
    fieldSchema,
    duplicateFormFields,
  } = useForms();

  const [initialValues, setInitialValues] = useState({});
  const [currentFields, setCurrentFields] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const isMobile = useCheckMobileScreen(1024);

  const formSubmit = async (values) => {
    if (fieldType === 'page') {
      await updatePage(values);
    } else if (fieldType === 'section') {
      await updateSections(values);
    } else {
      await updateFormFields(values);
    }
  };

  useEffect(() => {
    if (selectedField) {
      const PAGE_SECTION = formFields.filter(
        (x) => x.page === currentPage && x.sections === currentSection
      );
      const FORM_FIELD = PAGE_SECTION[0]?.fields?.filter(
        (x) => x.id === selectedField
      );

      if (FORM_FIELD) {
        if (FORM_FIELD[0]?.type === 'sub-form') {
          setDisabled(true);
        } else {
          setDisabled(false);
        }

        setFieldType(FORM_FIELD[0]?.type);
        setInitialValues(FORM_FIELD[0]);
      } else {
        setInitialValues({});
      }
    }
  }, [selectedField, formFields]);

  useEffect(() => {
    if (fieldType === 'section') {
      setSelectedField(null);
      const SECTION = sections.find((x) => x.id === currentSection);
      setFieldType('section');
      setInitialValues({
        id: SECTION?.id || '',
        pageId: SECTION?.pageId || '',
        name: SECTION?.name || '',
        color: SECTION?.color || '',
      });
    }
  }, [currentSection, sections, fieldType]);

  useEffect(() => {
    if (fieldType === 'page') {
      setSelectedField(null);
      const PAGE = pages.find((x) => x.id === currentPage);

      setFieldType('page');
      setInitialValues({
        id: PAGE?.id || '',
        name: PAGE?.name || '',
      });
    }
  }, [currentPage, pages, fieldType]);

  useEffect(() => {
    if (!isMobile) {
      setOpenRightPanel(true);
    }
  }, [isMobile]);

  useEffect(() => {
    setCurrentFields(
      formFields.find(
        (x) => x.page === currentPage && x.sections === currentSection
      )?.fields
    );
  }, [formFields]);

  return (
    <>
      <div className="hidden h-full col-span-3 overflow-hidden bg-white xl:block">
        <div className="h-full pb-10">
          <div className="w-full px-5 py-2 bg-white border-b">
            <div className="flex items-center gap-1">
              <label className="text-sm font-bold leading-none shrink-0">
                Form name<span className="text-red-500">*</span>:
              </label>
              <input
                type="text"
                placeholder="Fill in the form name"
                className="w-full placeholder:text-[#94A3B8] border-none outline-none text-sm"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="h-full p-5 pb-24">
            <h2 className="mb-3 text-2xl font-bold text-slate-800">
              Edit{' '}
              {fieldType === 'page'
                ? 'Page'
                : fieldType === 'section'
                ? 'Section'
                : 'Field'}
            </h2>
            <div className="h-full overflow-y-auto scroll-smooth">
              <FormWrapper
                initialValues={initialValues}
                handleSubmit={formSubmit}
                validationSchema={
                  fieldType === 'section' ? schema : fieldSchema
                }
              >
                {({ values, errors, setFieldValue, submitForm }) => (
                  <Form className="space-y-6">
                    {RenderInputField(
                      fieldType,
                      values,
                      errors,
                      setFieldValue,
                      currentFields,
                      submitForm,
                      selectedField
                    )}

                    <div className="pt-10">
                      <Button disable={disabled} type="submit">
                        Submit
                      </Button>
                    </div>
                  </Form>
                )}
              </FormWrapper>
            </div>
            {selectedField && (
              <button
                onClick={() => duplicateFormFields()}
                className="pb-5 text-gray-400 underline transition-colors hover:text-gray-500"
              >
                Duplicate field
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="xl:hidden">
        <RightPanel
          rightPanelOpen={openRightPanel}
          setRightPanelOpen={setOpenRightPanel}
        >
          <div className="pb-10 xl:basis-10/12">
            <div className="pb-20 lg:mt-12">
              <h2 className="mb-6 text-2xl font-bold text-slate-800">
                Edit{' '}
                {fieldType === 'page'
                  ? 'Page'
                  : fieldType === 'section'
                  ? 'Section'
                  : 'Field'}
              </h2>
              <div className="mt-10">
                {initialValues && (
                  <FormWrapper
                    initialValues={initialValues}
                    handleSubmit={formSubmit}
                    validationSchema={fieldType === 'section' && schema}
                  >
                    {({ values, errors, setFieldValue, submitForm }) => (
                      <Form className="space-y-6">
                        {RenderInputField(
                          fieldType,
                          values,
                          errors,
                          setFieldValue,
                          currentFields,
                          submitForm,
                          selectedField
                        )}

                        <div className="pt-10">
                          <Button disable={disabled} type="submit">
                            Submit
                          </Button>
                        </div>
                      </Form>
                    )}
                  </FormWrapper>
                )}
              </div>
            </div>
          </div>
        </RightPanel>
      </div>
    </>
  );
};

export default FormFieldEditor;

const RenderInputField = (
  type,
  values,
  errors,
  setFieldValue,
  currentFields,
  submitForm,
  selectedField
) => {
  switch (type) {
    case DATE_FIELD:
      return (
        <>
          <TextInput
            error={errors}
            label="Field Label"
            name="label"
            type="text"
            onBlur={submitForm}
          />
          <Switch label="Is required" name="isRequired" onBlur={submitForm} />
          <h4 className="pt-5 text-lg font-semibold border-t">
            Date & Time settings
          </h4>
          <Switch
            label="Default to current date/time"
            name="defaultCurrent"
            onBlur={submitForm}
          />
          <ColorPicker label="Field color" name="color" onBlur={submitForm} />
        </>
      );
    case STATIC_TEXT:
      return (
        <>
          <TextInput
            label="Text"
            placeholder="Enter static text"
            name="text"
            type="text"
            error={errors}
            onBlur={submitForm}
          />
          <Switch
            label="Exclude in Report"
            name="exclude_report"
            onBlur={submitForm}
          />
          <ColorPicker label="Field color" name="color" onBlur={submitForm} />
        </>
      );
    case SIGNATURE:
      return (
        <>
          <TextInput
            label="Label"
            placeholder=""
            name="label"
            type="text"
            error={errors}
            onBlur={submitForm}
          />
          <Switch
            label="Exclude in Report"
            name="exclude_report"
            onBlur={submitForm}
          />
          {(type === TOGGLE || type === SIGNATURE) && (
            <Switch label="Is required" name="isRequired" onBlur={submitForm} />
          )}
          <ColorPicker label="Field color" name="color" onBlur={submitForm} />
        </>
      );
    case RADIO_OPTIONS:
    case CHECKBOX_OPTIONS:
      return (
        <>
          <TextInput
            error={errors}
            label="Label"
            name="label"
            type="text"
            onBlur={submitForm}
          />
          {/* <TextInput label="Suffix" name="suffix" type="text" /> */}
          <Switch label="Is required" name="isRequired" onBlur={submitForm} />
          <Switch
            label="Exclude in Report"
            name="exclude_report"
            onBlur={submitForm}
          />

          <h4 className="pt-5 text-lg font-semibold border-t">
            Create options
          </h4>
          <ArrayFields values={values} onBlur={submitForm} />
          <ColorPicker label="Field color" name="color" onBlur={submitForm} />
        </>
      );
    case DOCUMENT:
      return (
        <>
          <TextInput
            error={errors}
            label="Document name"
            name="label"
            type="text"
            onBlur={submitForm}
          />
          <FileUploadButton
            error={errors}
            placeholder="Upload document"
            name="document"
            accepts=".pdf"
            onChange={(e) => {
              setFieldValue('documentURL', e);
              submitForm();
            }}
          />
          <Switch
            label="Exclude in Report"
            name="exclude_report"
            onBlur={submitForm}
          />
          <ColorPicker label="Field color" name="color" onBlur={submitForm} />
        </>
      );
    case 'section':
      return (
        <>
          <TextInput
            label="Section name"
            name="name"
            type="text"
            error={errors}
            onBlur={submitForm}
          />
          <ColorPicker label="Section color" name="color" onBlur={submitForm} />
        </>
      );
    case 'page':
      return (
        <>
          <TextInput
            label="Page name"
            name="name"
            type="text"
            error={errors}
            onBlur={submitForm}
          />
        </>
      );
    case SUB_FORM:
      return <></>;
    case STATIC_IMAGE:
      return (
        <>
          <FileUploadButton
            error={errors}
            placeholder="Upload image"
            name="static_image"
            accepts=".jpg, .jpeg, .png"
            onChange={(e) => {
              setFieldValue('imageUrl', e);
              submitForm();
            }}
          />
          <Switch
            label="Exclude in Report"
            name="exclude_report"
            onBlur={submitForm}
          />
        </>
      );
    case NUMERIC_FIELD:
      return (
        <>
          <TextInput
            error={errors}
            label="Field Label"
            name="label"
            type="text"
            onBlur={submitForm}
          />
          <TextInput
            label="Suffix"
            name="suffix"
            type="text"
            onBlur={submitForm}
          />
          <Switch label="Is Required" name="isRequired" onBlur={submitForm} />
          <Switch
            label="Exclude in Report"
            name="exclude_report"
            onBlur={submitForm}
          />
          <ColorPicker label="Field color" name="color" onBlur={submitForm} />
        </>
      );
    case TOGGLE:
      return (
        <>
          <TextInput
            error={errors}
            label="Field Label"
            name="label"
            type="text"
            onBlur={submitForm}
          />
          <ReactSelect
            label="Select which fields should show if the answer is “yes”"
            placeholder={'Select'}
            field={{ name: 'yes_fields', value: values?.['yes_fields'] ?? '' }}
            options={currentFields
              ?.filter(
                (x, index) =>
                  index >
                    currentFields.findIndex(
                      (item) => item.id === selectedField
                    ) &&
                  x.fieldType !== TOGGLE &&
                  !currentFields?.some(
                    (field) =>
                      (field.yes_fields &&
                        field.yes_fields.some(
                          (yesField) => yesField.value === x.id
                        )) ||
                      (field.no_fields &&
                        field.no_fields.some(
                          (noField) => noField.value === x.id
                        ))
                  )
              )

              .map((field) => ({
                label: field.label,
                value: field.id,
              }))}
            onSelectChange={(e) => {
              setFieldValue('yes_fields', e);
              submitForm();
            }}
            isMulti
          />
          <ReactSelect
            label="Select which fields should show if the answer is “no”"
            placeholder={'Select'}
            field={{ name: 'no_fields', value: values?.['no_fields'] ?? '' }}
            options={currentFields
              ?.filter(
                (x, index) =>
                  index >
                    currentFields.findIndex(
                      (item) => item.id === selectedField
                    ) &&
                  x.fieldType !== TOGGLE &&
                  !currentFields?.some(
                    (field) =>
                      (field.yes_fields &&
                        field.yes_fields.some(
                          (yesField) => yesField.value === x.id
                        )) ||
                      (field.no_fields &&
                        field.no_fields.some(
                          (noField) => noField.value === x.id
                        ))
                  )
              )

              .map((field) => ({
                label: field.label,
                value: field.id,
              }))}
            onSelectChange={(e) => {
              setFieldValue('no_fields', e);
              submitForm();
            }}
            isMulti
          />
          <Switch label="Is Required" name="isRequired" onBlur={submitForm} />
          <Switch
            label="Exclude in Report"
            name="exclude_report"
            onBlur={submitForm}
          />
          <ColorPicker label="Field color" name="color" onBlur={submitForm} />
        </>
      );
    case SWITCH:
      return (
        <>
          <TextInput
            error={errors}
            label="Field Label"
            name="label"
            type="text"
            onBlur={submitForm}
          />
          <div className="w-[300px]">
            <ReactSelect
              label="Assign fields to this question."
              placeholder={'Select'}
              field={{
                name: 'assinged_fields',
                value: values?.['assinged_fields'] ?? '',
              }}
              options={currentFields
                ?.filter(
                  (item, index) =>
                    index >
                      currentFields.findIndex(
                        (item) => item.id === selectedField
                      ) &&
                    !currentFields?.some(
                      (field) =>
                        field.assinged_fields &&
                        field.assinged_fields.some(
                          (assignedField) => assignedField.id === item.id
                        )
                    )
                )
                .map((field) => ({
                  label: field.label,
                  value: field.id,
                }))}
              onSelectChange={(e) => {
                setFieldValue('assinged_fields', e);
                submitForm();
              }}
              isMulti
            />
          </div>

          <Switch label="Is Required" name="isRequired" />
          <Switch label="Exclude in Report" name="exclude_report" />
          <ColorPicker label="Field color" name="color" />
        </>
      );
    case SINGLE_PHOTO_FIELD:
      return (
        <>
          <TextInput
            error={errors}
            label="Field Label"
            name="label"
            type="text"
            onBlur={submitForm}
          />
          <TextInput
            label="Field Placeholder"
            name="placeholder"
            type="text"
            onBlur={submitForm}
          />
          <Switch label="Allow Camera" name="allowCamera" onBlur={submitForm} />
          <Switch
            label="Allow Photo Library"
            name="allowPhotoLibrary"
            onBlur={submitForm}
          />

          <Switch label="Is Required" name="isRequired" onBlur={submitForm} />
          <Switch
            label="Exclude in Report"
            name="exclude_report"
            onBlur={submitForm}
          />
        </>
      );
    case MULTIPLE_PHOTO_FIELD:
      return (
        <>
          <TextInput
            error={errors}
            label="Field Label"
            name="label"
            type="text"
            onBlur={submitForm}
          />
          <TextInput
            label="Field Placeholder"
            name="placeholder"
            type="text"
            onBlur={submitForm}
          />
          <TextInput
            error={errors}
            label="Minimum"
            name="min"
            type="number"
            onBlur={submitForm}
          />
          <TextInput
            error={errors}
            label="Maximum"
            name="max"
            type="number"
            onBlur={submitForm}
          />
          <Switch label="Is Required" name="isRequired" onBlur={submitForm} />
          <Switch
            label="Exclude in Report"
            name="exclude_report"
            onBlur={submitForm}
          />
        </>
      );
    case VIDEO_FIELD:
      return (
        <>
          <TextInput
            error={errors}
            label="Field Label"
            name="label"
            type="text"
            onBlur={submitForm}
          />
          <TextInput
            label="Field Placeholder"
            name="placeholder"
            type="text"
            onBlur={submitForm}
          />
          <Switch label="Is Required" name="isRequired" onBlur={submitForm} />
          <Switch
            label="Exclude in Report"
            name="exclude_report"
            onBlur={submitForm}
          />
        </>
      );
    case LONG_TEXT_FIELD:
      return (
        <>
          <TextInput
            error={errors}
            label="Field Label"
            name="label"
            type="text"
            onBlur={submitForm}
          />
          <TextInput
            label="Field Placeholder"
            name="placeholder"
            type="text"
            onBlur={submitForm}
          />
          <Switch label="Is Required" name="isRequired" onBlur={submitForm} />
          <Switch
            label="Exclude in Report"
            name="exclude_report"
            onBlur={submitForm}
          />
        </>
      );
    case LOCATION:
      return (
        <>
          <TextInput
            error={errors}
            label="Field Label"
            name="label"
            type="text"
            onBlur={submitForm}
          />
          <TextInput
            label="Field Placeholder"
            name="placeholder"
            type="text"
            onBlur={submitForm}
          />
          <Switch label="Is Required" name="isRequired" onBlur={submitForm} />
          <Switch
            label="Exclude in Report"
            name="exclude_report"
            onBlur={submitForm}
          />
          <ColorPicker label="Field color" name="color" onBlur={submitForm} />
        </>
      );

    default:
      return (
        <>
          <TextInput
            error={errors}
            label="Field Label"
            name="label"
            type="text"
            onBlur={submitForm}
          />
          <TextInput
            label="Field Placeholder"
            name="placeholder"
            type="text"
            onBlur={submitForm}
          />
          <TextInput
            label="Suffix"
            name="suffix"
            type="text"
            onBlur={submitForm}
          />
          <Switch label="Is Required" name="isRequired" onBlur={submitForm} />
          <Switch
            label="Exclude in Report"
            name="exclude_report"
            onBlur={submitForm}
          />
          <ColorPicker label="Field color" name="color" onBlur={submitForm} />
        </>
      );
  }
};
