import {
  DATE_FIELD,
  LONG_TEXT_FIELD,
  MULTIPLE_PHOTO_FIELD,
  NUMERIC_FIELD,
  SINGLE_PHOTO_FIELD,
  VIDEO_FIELD,
  TEXT_FIELD,
  STATIC_TEXT,
  RADIO_OPTIONS,
  CHECKBOX_OPTIONS,
  LOCATION,
  TOGGLE,
  SWITCH,
  SIGNATURE,
  DOCUMENT,
  SUB_FORM,
  SUB_FORM_TYPE,
} from '@/constants/fieldType';
import { useForms } from '@/context/FormContext';
import { Dialog, Transition } from '@headlessui/react';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import DatePicker from '@/components/UI/DatePicker';

import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/24/outline';
import TextInput from '@/components/UI/TextInput';
import FormWrapper from '@/components/Form';
import { Form } from 'formik';
import TextArea from '@/components/UI/TextArea';
import LocationCapture from '@/components/UI/LocationCapture';
import ToggleSwitch from '@/components/UI/ToggleSwitch';
import Switch from '@/components/UI/Switch';
import SignaturePad from '@/components/UI/SignaturePad';
import IconButton from '@/components/UI/IconButton';
import SubformLink from '@/components/UI/SubformLink';
import { useRouter } from 'next/router';
import RadioDropdown from '@/components/UI/RadioDropdown';
import CheckboxDropdown from '@/components/UI/CheckboxDropdown';
import { PaperClipIcon, XMarkIcon } from '@heroicons/react/24/solid';

import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

import './styles.module.css';
import CameraCapture from '@/components/CameraCapture';
import FileUploadButton from '@/components/UI/FilePicker/FileUploadButton';
import InputGroup from '@/components/UI/InputGroup';

const getFileExtensionFromUrl = (url) => {
  const extension = url?.toString()?.split('.')?.pop()?.toLowerCase();
  return extension;
};

const RenderSection = ({ color, name }) => {
  return (
    <div
      style={{
        backgroundColor: color || '#fff',
      }}
      className={`py-3 mb-6 font-semibold text-center  border shadow text-slate-800 border-gray-100 `}
    >
      {name}
    </div>
  );
};

const PreviewTwo = () => {
  const { isPreview, setIsPreview, formFields, sections, formTitle, pages } =
    useForms();
  const [sectionFields, setSectionFields] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [images, setImages] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const pageCount = formFields?.reduce(
      (max, obj) => (obj.page > max ? obj.page : max),
      formFields[0]?.page
    );
    setTotalPages(pageCount);
    setSectionFields(formFields?.filter((x) => x.page === page));
  }, [formFields, page]);

  return (
    <>
      <Transition.Root show={isPreview} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-60"
          onClose={() => {
            setIsPreview(false);
            setShowMenu(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto ">
            <div className="flex items-end justify-center min-h-full text-center md:p-4 sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="relative w-full max-w-md overflow-hidden rounded shadow-lg bg-gray-50">
                  <div className="relative">
                    {/* Close button */}
                    <button
                      className="absolute top-0 right-0 mt-5 mr-5 text-slate-50 hover:text-white"
                      onClick={() => {
                        setIsPreview(false);
                        setShowMenu(false);
                      }}
                    >
                      <div className="sr-only">Close</div>
                      <svg className="w-4 h-4 text-indigo-200 transition-colors fill-current hover:text-indigo-300">
                        <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                      </svg>
                    </button>
                    {router.query.form_type === SUB_FORM_TYPE && (
                      <button
                        className="absolute top-0 left-0 mt-5 ml-5 text-slate-50 hover:text-white"
                        onClick={() => {
                          router.back();
                        }}
                      >
                        <div className="sr-only">Go back</div>
                        <ArrowLongLeftIcon className="text-indigo-200 transition-colors hover:text-indigo-300 w-7 h-7" />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col h-[90vh] p-5">
                    {/* Modal header */}
                    <div className="mb-2">
                      <div className="mb-3">
                        <h1 className="text-lg font-semibold text-gray-600 underline decoration-2 underline-offset-8 decoration-indigo-500 ">
                          {formTitle}
                        </h1>
                      </div>
                    </div>

                    {/* Form Content */}
                    <div className="h-full pb-10 mb-5 overflow-y-auto text-sm">
                      {sectionFields?.map((section) => (
                        <div
                          key={`${section.sections}_${section.page}`}
                          className="mb-4"
                        >
                          {sections?.find((x) => x.id === section.sections) && (
                            <RenderSection
                              color={
                                sections?.find((x) => x.id === section.sections)
                                  ?.color
                              }
                              name={
                                sections?.find((x) => x.id === section.sections)
                                  ?.name
                              }
                            />
                          )}
                          {/* Desktop */}

                          <form className="space-y-4">
                            {section.fields?.map((state) => {
                              const isIdInYesFields = section.fields.some(
                                (item) =>
                                  item.yes_fields &&
                                  item.yes_fields.some(
                                    (field) => field.value === state.id
                                  )
                              );

                              const isIdInNoFields = section.fields.some(
                                (item) =>
                                  item.no_fields &&
                                  item.no_fields.some(
                                    (field) => field.value === state.id
                                  )
                              );

                              const assignedToSwitch = section.fields.some(
                                (item) =>
                                  item.assinged_fields &&
                                  item.assinged_fields.some(
                                    (field) => field.id === state.id
                                  )
                              );

                              if (
                                !isIdInYesFields &&
                                !isIdInNoFields &&
                                !assignedToSwitch
                              ) {
                                return (
                                  <div key={state.id}>
                                    {RenderInputFields(
                                      { ...state },
                                      section.fields,
                                      setPdfUrl,
                                      setShowPdf,
                                      setImages
                                    )}
                                  </div>
                                );
                              }
                            })}
                          </form>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Transition
                    as={Fragment}
                    show={showMenu}
                    enter="transition ease duration-700 transform"
                    enterFrom="opacity-0 translate-y-0"
                    enterTo="opacity-100 -translate-y-10"
                    leave="transition ease duration-1000 transform"
                    leaveFrom="opacity-100 -translate-y-full"
                    leaveTo="opacity-0 translate-y-0"
                  >
                    <div className="absolute bottom-0 left-0 z-40 w-full overflow-hidden text-center border-t rounded-t-3xl bg-slate-100 shadow-top">
                      <ul className="divide-y ">
                        {pages?.map((page) => (
                          <li
                            key={page.id}
                            className="px-5 py-3 text-lg font-semibold cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50 active:bg-indigo-50 text-slate-600"
                            onClick={() => setPage(page.id)}
                          >
                            {page.name}
                          </li>
                        ))}
                        <li
                          className="px-5 pt-3 pb-5 text-lg font-semibold cursor-pointer text-slate-600 hover:bg-indigo-50 focus:bg-indigo-50 active:bg-indigo-50"
                          onClick={() => {
                            setShowMenu(false);
                          }}
                        >
                          Cancel
                        </li>
                      </ul>
                    </div>
                  </Transition>
                  <ViewPDF
                    pdfUrl={pdfUrl}
                    open={showPdf}
                    setOpen={setShowPdf}
                  />
                  <ViewImages
                    images={images}
                    open={images.length > 0}
                    setOpen={setImages}
                  />
                  {/* Modal footer */}
                  <div className="absolute bottom-0 z-50 flex items-center justify-between w-full p-2 mt-auto border-t bg-gray-50">
                    <p className="text-sm font-semibold text-slate-500">
                      Page {page}
                    </p>
                    <div className="flex flex-wrap space-x-2">
                      <button
                        disabled={page === 1}
                        className="text-indigo-500 border-gray-300 btn-sm disabled:opacity-60"
                        onClick={() => {
                          setPage(page - 1);
                        }}
                      >
                        <ArrowLongLeftIcon className="w-5 h-5 mr-1 text-indigo-500" />{' '}
                        Previous
                      </button>
                      <button
                        disabled={totalPages <= 1}
                        className="text-white bg-indigo-500 btn-sm hover:bg-indigo-600 disabled:opacity-60 disabled:hover:opacity-60 disabled:bg-indigo-500"
                        onClick={() => {
                          setShowMenu(true);
                        }}
                      >
                        Menu
                      </button>
                      <button
                        disabled={page === totalPages}
                        className="text-indigo-500 border-gray-300 btn-sm disabled:opacity-60"
                        onClick={() => {
                          setPage(page + 1);
                        }}
                      >
                        Next{' '}
                        <ArrowLongRightIcon className="w-5 h-5 ml-1 text-indigo-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default PreviewTwo;

const RenderInputFields = (
  field,
  allFields,
  setPdfUrl,
  setShowPdf,
  setImages
) => {
  const {
    id,
    type,
    label,
    name,
    placeholder,
    isRequired,
    accepts,
    hint,
    defaultCurrent,
    text,
    options,
    value,
    suffix,
    color,
  } = field;

  switch (type) {
    case TEXT_FIELD:
      return (
        <InputWrap key={id} suffix={suffix} background={color}>
          <InputGroup
            name={name}
            label={label}
            hint={hint}
            required={isRequired}
          >
            <input
              type="text"
              className="w-full form-input border-[#E2E8F0] rounded-md placeholder:text-[#94A3B8]"
            />
          </InputGroup>
        </InputWrap>
      );
    case LONG_TEXT_FIELD:
      return (
        <InputWrap key={id} background={color}>
          <InputGroup
            name={name}
            label={label}
            hint={hint}
            required={isRequired}
          >
            <textarea
              rows={4}
              name={name}
              type={type}
              placeholder={placeholder}
              className={`w-full form-input border-[#E2E8F0] rounded-md placeholder:text-[#94A3B8]`}
            />
          </InputGroup>
        </InputWrap>
      );
    case STATIC_TEXT:
      return (
        <div
          className="p-3 bg-white rounded-lg shadow-md"
          key={id}
          background={color}
        >
          <p className="text-left">{text}</p>
        </div>
      );
    case NUMERIC_FIELD:
      return (
        <InputWrap key={id} suffix={suffix} background={color}>
          <InputGroup
            name={name}
            label={label}
            hint={hint}
            required={isRequired}
          >
            <input
              type="number"
              className="w-full form-input border-[#E2E8F0] rounded-md placeholder:text-[#94A3B8]"
            />
          </InputGroup>
        </InputWrap>
      );
    case DATE_FIELD:
      return (
        <InputWrap key={id} background={color}>
          <DatePicker
            id={id}
            label={label}
            name={name}
            hint={hint}
            required={isRequired}
            defaultDate={defaultCurrent}
          />
        </InputWrap>
      );
    case RADIO_OPTIONS:
      return (
        <InputWrap key={id} background={color}>
          <RadioDropdown
            label={label}
            options={options.map((option) => ({
              label: option,
              value: option,
            }))}
          />
        </InputWrap>
      );
    case CHECKBOX_OPTIONS:
      return (
        <InputWrap key={id} background={color}>
          <CheckboxDropdown
            label={label}
            options={options.map((option) => ({
              label: option,
              value: option,
            }))}
          />
        </InputWrap>
      );
    case SINGLE_PHOTO_FIELD:
      return (
        <InputWrap key={id} background={color}>
          <div className="flex items-center justify-between w-full p-5 border border-gray-100 bg-gray-50">
            <p>{label ?? 'Label'}</p>
            <CameraCapture />
          </div>
        </InputWrap>
      );
    case VIDEO_FIELD:
      return (
        <InputWrap key={id} background={color}>
          <div className="flex items-center justify-between w-full p-5 border border-gray-100 bg-gray-50">
            <p>{label ?? 'Label'}</p>

            <FileUploadButton
              placeholder="Upload Video"
              name="videos"
              accepts={'.mp4'}
              local={true}
              onChange={(e) => setImages(e)}
            />
          </div>
        </InputWrap>
      );
    case MULTIPLE_PHOTO_FIELD:
      return (
        <InputWrap key={id} background={color}>
          <div className="flex items-center justify-between w-full p-5 border border-gray-100 bg-gray-50">
            <p>{label ?? 'Label'}</p>

            <FileUploadButton
              placeholder="Upload Images"
              name="images"
              accepts={accepts}
              onChange={(e) => setImages(e)}
              isMultiple={true}
              local={true}
              min={field.min}
              max={field.max}
            />
          </div>
        </InputWrap>
      );
    case LOCATION:
      return (
        <InputWrap key={id} background={color}>
          <LocationCapture
            id={id}
            label={label}
            name={name}
            hint={hint}
            required={isRequired}
            placeholder={placeholder}
          />
        </InputWrap>
      );
    case TOGGLE:
      return (
        <RenderToggle
          key={name}
          id={id}
          label={label}
          name={name}
          hint={hint}
          required={isRequired}
          yesField={field.yes_fields}
          noField={field.no_fields}
          fields={allFields}
          background={color}
        />
      );
    case SWITCH:
      return (
        <RenderSwitch
          key={name}
          id={id}
          label={label}
          name={name}
          hint={hint}
          required={isRequired}
          field={field}
          background={color}
        />
      );
    case SIGNATURE:
      return (
        <InputWrap key={id} background={color}>
          <SignaturePad
            id={id}
            label={label}
            name={name}
            hint={hint}
            required={isRequired}
          />
        </InputWrap>
      );
    case DOCUMENT:
      return (
        <InputWrap key={id} background={color}>
          <div className="w-full">
            <IconButton
              handleClick={() => {
                setPdfUrl(field.documentURL && JSON.parse(field.documentURL));
                setShowPdf(true);
              }}
              Icon={PaperClipIcon}
              label={label}
            >
              <PaperClipIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
              {label}
            </IconButton>
          </div>
        </InputWrap>
      );
    case SUB_FORM:
      return (
        <InputWrap key={id} background={color}>
          <div className="w-full">
            <SubformLink value={value} label="View Sub Form" />
          </div>
        </InputWrap>
      );
    default:
      break;
  }
};

const RenderToggle = ({
  id,
  label,
  name,
  hint,
  isRequired,
  yesField,
  noField,
  fields,
  background,
}) => {
  const [toggleVal, setToggleVal] = useState(null);

  return (
    <>
      <InputWrap key={id} background={background}>
        <ToggleSwitch
          id={id}
          label={label}
          name={name}
          hint={hint}
          required={isRequired}
          onChange={(e) => setToggleVal(e)}
        />
      </InputWrap>
      <div className="mt-4 space-y-4">
        {toggleVal === 'yes'
          ? fields
              .filter((field1) =>
                yesField?.some((field2) => field2.value === field1.id)
              )
              ?.map(RenderInputFields)
          : toggleVal === 'no' &&
            fields
              .filter((field1) =>
                noField?.some((field2) => field2.value === field1.id)
              )
              ?.map(RenderInputFields)}
      </div>
    </>
  );
};

const RenderSwitch = ({
  id,
  label,
  name,
  hint,
  isRequired,
  field,
  fieldValues,
  setFieldValue,
  background,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  let switchRef = useRef(null);

  const handleOnClick = () => {
    const newValue = switchRef.current.checked;
    setIsChecked(newValue);
  };

  return (
    <>
      <InputWrap key={id} background={background}>
        <div className="flex items-start">
          <div className="form-switch">
            <input
              type="checkbox"
              id={id}
              name={id}
              className="sr-only"
              ref={switchRef}
              checked={isChecked}
              onChange={handleOnClick}
            />

            <label className="bg-slate-400" htmlFor={id}>
              <span className="bg-white shadow-sm" aria-hidden="true"></span>
              <span className="sr-only">{label}</span>
            </label>
          </div>
          <div className="ml-2 text-base text-slate-400">{label}</div>
        </div>
      </InputWrap>

      <div className="space-y-4">
        {isChecked &&
          field.assinged_fields &&
          field.assinged_fields?.map(RenderInputFields)}
      </div>
    </>
  );
};

const InputWrap = ({ children, suffix, background }) => {
  return (
    <div
      style={{
        backgroundColor: background || '#fff',
      }}
      className={`flex items-center gap-2 p-3`}
    >
      {children}
      {suffix && (
        <span className="h-full p-2 mt-6 border rounded bg-gray-50">
          {suffix}
        </span>
      )}
    </div>
  );
};

const ViewPDF = ({ open, setOpen, pdfUrl }) => {
  const [numPages, setNumPages] = useState(0);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Transition
      as={Fragment}
      show={open}
      enter="transition ease duration-700 transform"
      enterFrom="opacity-0 translate-y-0"
      enterTo="opacity-100 -translate-y-10"
      leave="transition ease duration-1000 transform"
      leaveFrom="opacity-100 -translate-y-full"
      leaveTo="opacity-0 translate-y-0"
    >
      <div className="absolute left-0 z-40 w-full h-screen overflow-x-hidden overflow-y-scroll text-center border-t top-10 bg-slate-100">
        <Document file={pdfUrl?.[0]} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              className="pdf-page"
            />
          ))}
        </Document>
        <button
          onClick={() => setOpen(false)}
          className="absolute flex items-center justify-center bg-gray-200 rounded w-7 h-7 top-5 right-5"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </Transition>
  );
};

const ViewImages = ({ open, setOpen, images }) => {
  return (
    <Transition
      as={Fragment}
      show={open}
      enter="transition ease duration-700 transform"
      enterFrom="opacity-0 translate-y-0"
      enterTo="opacity-100 -translate-y-10"
      leave="transition ease duration-1000 transform"
      leaveFrom="opacity-100 -translate-y-full"
      leaveTo="opacity-0 translate-y-0"
    >
      <div className="absolute left-0 z-40 w-full h-screen overflow-x-hidden overflow-y-scroll text-center border-t top-10 bg-slate-100">
        {images[0] && images[0].type === 'video/mp4' ? (
          <div className="p-5">
            <video width="100%" height="200" controls>
              <source src={images[0].file} type="video/mp4" />
            </video>
          </div>
        ) : (
          images[0] && (
            <div className="grid grid-cols-3 gap-2 p-5 align-top">
              {images.map((img, i) => (
                <img key={i} src={img.file} alt={`img-${i}`} />
              ))}
            </div>
          )
        )}

        <button
          onClick={() => setOpen(false)}
          className="absolute flex items-center justify-center bg-gray-200 rounded w-7 h-7 top-5 right-5"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </Transition>
  );
};
