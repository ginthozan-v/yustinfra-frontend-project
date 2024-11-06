import FormWrapper from '@/components/Form';
import CheckboxGroup from '@/components/UI/CheckboxGroup';
import DatePicker from '@/components/UI/DatePicker';
import FilePicker from '@/components/UI/FilePicker/DropZone';
import IconButton from '@/components/UI/IconButton';
import LocationCapture from '@/components/UI/LocationCapture';
import RadioGroup from '@/components/UI/RadioGroup';
import Switch from '@/components/UI/Switch';
import ToggleSwitch from '@/components/UI/ToggleSwitch';

import {
  DATE_FIELD,
  DOCUMENT,
  LOCATION,
  LONG_TEXT_FIELD,
  MULTIPLE_PHOTO_FIELD,
  NUMERIC_FIELD,
  SINGLE_PHOTO_FIELD,
  TEXT_FIELD,
  VIDEO_FIELD,
  SUB_FORM,
  STATIC_TEXT,
  SWITCH,
  TOGGLE,
  RADIO_OPTIONS,
  CHECKBOX_OPTIONS,
  SIGNATURE,
  STATIC_IMAGE,
} from '@/constants/fieldType';
import { CREATE_FORM_TEMPLATE_ROUTE } from '@/constants/routes';
import { useForms } from '@/context/FormContext';
import { DocumentTextIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PaperClipIcon } from '@heroicons/react/24/solid';
import { Form } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'SORTABLE_ITEM';

const SortableItem = ({ item, index, moveItem, updateItem }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
    drop: () => {
      updateItem();
    },
  });

  return (
    <div key={item.id} ref={(node) => ref(drop(node))}>
      {RenderInput(item)}
    </div>
  );
};

export const TemplateFields = () => {
  const {
    pages,
    currentPage,
    sections,
    currentSection,
    formFields,
    setFormFields,
  } = useForms();

  const [fields, setFields] = useState(null);

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...fields];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setFields(updatedItems);
  };

  const updateItem = () => {
    const UPDATED_ARRAY = formFields.map((field) => {
      if (field.page === currentPage && field.sections === currentSection) {
        return { ...field, fields: fields };
      }
      return field;
    });

    setFormFields(UPDATED_ARRAY);
  };

  useEffect(() => {
    setFields(
      formFields?.filter(
        (x) => x.page === currentPage && x.sections === currentSection
      )[0]?.fields
    );
  }, [formFields, currentPage, currentSection]);

  return (
    <div className="h-full col-span-6 overflow-hidden border-x">
      <div className="w-full px-5 py-2 text-center bg-white border-b">
        <h3 className="text-base font-semibold leading-none text-gray-900">
          {pages?.filter((x) => x.id === currentPage)[0]?.name ?? 'Page Title'}
        </h3>
        <p className="mt-2 text-sm leading-none text-gray-500">
          {sections?.filter((x) => x.id === currentSection)[0]?.name ??
            'Section Title'}
        </p>
      </div>
      <div className="h-full p-5 overflow-y-auto pb-[300px] lg:pb-20 xl:pb-36 2xl:pb-40 xl:p-8 2xl:p-10 no-scrollbar">
        <FormWrapper initialValues={{}}>
          <Form className="w-full">
            <div className="space-y-2">
              {fields?.map((item, index) => {
                const assignedToSwitch = fields.some((field) =>
                  field.assinged_fields?.some((aField) => aField.id === item.id)
                );

                if (!assignedToSwitch) {
                  return (
                    <SortableItem
                      key={item.id}
                      item={item}
                      index={index}
                      moveItem={moveItem}
                      updateItem={updateItem}
                    />
                  );
                }
              })}
            </div>
          </Form>
        </FormWrapper>
      </div>
    </div>
  );
};

const RenderInput = (value, canDelete) => {
  const className =
    'w-full form-input border-[#E2E8F0] hover:border-[#E2E8F0] rounded-md disabled:bg-gray-100';

  switch (value.fieldType) {
    case TEXT_FIELD:
      return (
        <FieldWrapper
          key={value.id}
          id={value.id}
          name={value.label}
          isRequired={value.isRequired}
          hint={value.hint}
          canDelete={canDelete}
          suffix={value.suffix}
        >
          <input
            type="text"
            placeholder={value.placeholder}
            className={className}
            disabled
          />
        </FieldWrapper>
      );
    case LONG_TEXT_FIELD:
      return (
        <FieldWrapper
          key={value.id}
          id={value.id}
          name={value.label}
          isRequired={value.isRequired}
          hint={value.hint}
          canDelete={canDelete}
        >
          <textarea
            type="text"
            placeholder={value.placeholder}
            className={className}
            disabled
          />
        </FieldWrapper>
      );
    case NUMERIC_FIELD:
      return (
        <FieldWrapper
          key={value.id}
          id={value.id}
          name={value.label}
          isRequired={value.isRequired}
          hint={value.hint}
          canDelete={canDelete}
        >
          <input
            type="number"
            placeholder={value.placeholder}
            className={className}
            value={0}
            disabled
          />
        </FieldWrapper>
      );
    case STATIC_TEXT:
      return (
        <FieldWrapper key={value.id} id={value.id} canDelete={canDelete}>
          <p className="text-sm text-slate-500">
            {value.text ||
              `This is a static long text which will be shown in the app but wont
            show in delivery report. It’s a helper text for when you are filling
            a form in the app.`}
          </p>
        </FieldWrapper>
      );
    case DATE_FIELD:
      return (
        <FieldWrapper
          key={value.id}
          id={value.id}
          name={value.label}
          isRequired={value.isRequired}
          hint={value.hint}
          canDelete={canDelete}
        >
          <DatePicker
            align="right"
            defaultDate={value?.defaultCurrent}
            disabled={true}
          />
        </FieldWrapper>
      );
    case VIDEO_FIELD:
      return (
        <FieldWrapper
          key={value.id}
          id={value.id}
          // name={value.label}
          isRequired={value.isRequired}
          hint={value.hint}
          canDelete={canDelete}
        >
          <div className="flex items-center justify-between w-full p-5 border border-gray-100 bg-gray-50">
            <p>{value.label ? value.label : 'Label'}</p>
            <button className="px-5 py-2 text-white bg-indigo-500 rounded-lg">
              Take Video
            </button>
          </div>
        </FieldWrapper>
      );
    case SINGLE_PHOTO_FIELD:
      return (
        <FieldWrapper
          key={value.id}
          id={value.id}
          // name={value.label}
          isRequired={value.isRequired}
          hint={value.hint}
          canDelete={canDelete}
        >
          <div className="flex items-center justify-between w-full p-5 border border-gray-100 bg-gray-50">
            <p>{value.label ? value.label : 'Label'}</p>
            <button className="px-5 py-2 text-white bg-indigo-500 rounded-lg">
              Take Picture
            </button>
          </div>
        </FieldWrapper>
      );
    case MULTIPLE_PHOTO_FIELD:
      return (
        <FieldWrapper
          key={value.id}
          id={value.id}
          // name={value.label}
          isRequired={value.isRequired}
          hint={value.hint}
          canDelete={canDelete}
        >
          <div className="flex items-center justify-between w-full p-5 border border-gray-100 bg-gray-50">
            <p>{value.label ? value.label : 'Label'}</p>
            <button className="px-5 py-2 text-white bg-indigo-500 rounded-lg">
              Upload Pictures
            </button>
          </div>
        </FieldWrapper>
      );
    case LOCATION:
      return (
        <FieldWrapper
          key={value.id}
          id={value.id}
          name={value.label}
          isRequired={value.isRequired}
          hint={value.hint}
          canDelete={canDelete}
        >
          <LocationCapture placeholder={value.placeholder} disabled={true} />
        </FieldWrapper>
      );
    case DOCUMENT:
      return (
        <FieldWrapper
          key={value.id}
          id={value.id}
          name={value.label}
          isRequired={value.isRequired}
          hint={value.hint}
          canDelete={canDelete}
        >
          <IconButton label="View Document" disabled>
            <PaperClipIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
            View Document
          </IconButton>
        </FieldWrapper>
      );
    case SUB_FORM:
      return <SubForm key={value.id} value={value} canDelete={canDelete} />;
    case SWITCH:
      return RenderSwitchComponent(value, canDelete);
    case TOGGLE:
      return (
        <FieldWrapper
          key={value.id}
          id={value.id}
          name={value.label}
          hint={value.hint}
          isRequired={value.isRequired}
          canDelete={canDelete}
        >
          <ToggleSwitch label="This is a yes / no" name={value.name} disabled />
        </FieldWrapper>
      );
    case RADIO_OPTIONS:
      return (
        <FieldWrapper
          key={value.id}
          id={value.id}
          name={value.label}
          hint={value.hint}
          isRequired={value.isRequired}
          canDelete={canDelete}
        >
          <RadioGroup
            name={value.name}
            options={value.options?.map((option) => ({
              label: option,
              value: option,
            }))}
            disabled={true}
          />
        </FieldWrapper>
      );
    case CHECKBOX_OPTIONS:
      return (
        <FieldWrapper
          key={value.id}
          id={value.id}
          name={value.label}
          hint={value.hint}
          isRequired={value.isRequired}
          canDelete={canDelete}
        >
          <CheckboxGroup
            id={value.id}
            name={value.name}
            options={value.options?.map((option) => ({
              label: option,
              value: option,
            }))}
            disabled={true}
          />
        </FieldWrapper>
      );
    case SIGNATURE:
      return (
        <FieldWrapper
          key={value.id}
          id={value.id}
          name={value.label}
          hint={value.hint}
          isRequired={value.isRequired}
          canDelete={canDelete}
        >
          <div className="w-full h-32 border-2 rounded border-slate-300"></div>
        </FieldWrapper>
      );
    case STATIC_IMAGE:
      const img = value.imageUrl && JSON.parse(value.imageUrl)?.[0];
      return (
        <FieldWrapper key={value.id} id={value.id} canDelete={canDelete}>
          <Image
            src={img || '/no-image.png'}
            width={1024}
            height={1024}
            className="object-contain w-full h-44"
            alt="static image"
          />
        </FieldWrapper>
      );
    default:
      break;
  }
};

const FieldWrapper = ({
  id,
  name,
  isRequired,
  hint,
  canDelete,
  suffix,
  children,
}) => {
  const { selectedField, setSelectedField, removeField, setOpenRightPanel } =
    useForms();

  return (
    <div
      key={id}
      className={`p-3 border bg-white relative ${
        selectedField === id
          ? 'border-indigo-300'
          : 'border-slate-200 hover:border-slate-300 '
      }`}
    >
      <div
        className="flex flex-col items-start w-full"
        onClick={() => {
          setSelectedField(id);
          setOpenRightPanel(true);
        }}
      >
        <div className="flex items-center justify-between w-full mb-2">
          <label>
            {name !== '' ? name : 'Label'}
            {isRequired && <span className="text-red-500">*</span>}
          </label>
          {!canDelete && (
            <TrashIcon
              onClick={() => removeField(id)}
              className="w-5 h-5 text-gray-500 cursor-pointer hover:text-red-500"
            />
          )}
        </div>
        <div className="flex items-center w-full gap-2">
          {children}
          {suffix && (
            <p className="p-2 text-gray-500 bg-gray-100 border rounded">
              {suffix}
            </p>
          )}
        </div>
        {hint && (
          <p className="mt-1 text-sm text-gray-500">{hint || `Hint text`}</p>
        )}
      </div>
    </div>
  );
};

const SubForm = ({ value, canDelete }) => {
  const { selectedField, setSelectedField, removeField, setSelectedSubForm } =
    useForms();

  return (
    <div
      onClick={() => {
        setSelectedField(value.id);
      }}
      className={`p-3 border ${
        selectedField === value.id
          ? 'border-indigo-500'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center text-sm sm:grow">
          <div className="flex items-center justify-center w-8 h-8 my-2 mr-3 rounded-full shrink-0 bg-amber-500">
            <DocumentTextIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-slate-800">{value.label}</div>
            <div className="flex items-center space-x-2 flex-nowrap whitespace-nowrap">
              <div className="text-indigo-500 hover:underline">
                <Link
                  href={`${CREATE_FORM_TEMPLATE_ROUTE}?form_type=sub_form&formId=${value.value}`}
                  target="_blank"
                >
                  View form
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Tags */}
        {!canDelete && (
          <div className="mt-2 sm:ml-2 sm:mt-0">
            <ul className="flex flex-wrap -m-1 sm:justify-end">
              <li className="m-1">
                <button
                  onClick={() => {
                    removeField(value.id);
                    setSelectedSubForm(null);
                  }}
                  className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out"
                >
                  Unlink
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const RenderSwitchComponent = (value, canDelete) => {
  return (
    <>
      <FieldWrapper
        key={value.id}
        id={value.id}
        name={value.label}
        hint={value.hint}
        canDelete={canDelete}
      >
        <Switch label="This is a yes / no" name={value.name} disabled />
      </FieldWrapper>

      <div className="relative mt-2 space-y-2 max-w-[99%] ml-auto border-l-2 pl-3">
        {value.assinged_fields &&
          value.assinged_fields.map((props) => {
            return (
              <div key={props.id}>
                {/* <div className="absolute w-2 h-2 pt-5 bg-indigo-500 rounded-full -left-1" /> */}
                {RenderInput(props, true)}
              </div>
            );
          })}
      </div>
    </>
  );
};
