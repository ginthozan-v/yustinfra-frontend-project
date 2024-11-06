import Modal from '@/components/Modal';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import Button from '@/components/UI/Button';
import { MAIN_FORM_TYPE } from '@/constants/fieldType';
import { useForms } from '@/context/FormContext';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Bottom = ({ fetchTemplate }) => {
  const {
    isLoading,
    createForm,
    formFields,
    deleteForm,
    isDuplicateModalOpen,
    setIsDuplicateModalOpen,
    saveAsTemplate,
    setIsPreview,
    isSubmitting,
  } = useForms();
  const disabled = !formFields?.length > 0;
  const { query } = useRouter();
  const [isConfirm, setIsConfirm] = useState(false);

  const onDeliveryClick = async (saveType) => {
    createForm(saveType);
  };

  const onDeleteClick = async () => {
    setIsConfirm(true);
  };

  return (
    <>
      <DuplicateModal
        isModalOpen={isDuplicateModalOpen}
        setIsModalOpen={setIsDuplicateModalOpen}
      />
      <ConfirmModal
        title="The form will be deleted, are you sure?"
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        onYes={() => {
          deleteForm();
          setIsConfirm(true);
        }}
      />
      <div className="fixed bottom-0 z-40 w-full lg:w-[calc(100vw-256px)] py-2 bg-white border-t">
        <div className="flex flex-wrap items-center justify-center gap-2 px-8 md:justify-end">
          {query.formId && (
            <>
              <Button
                onBtnClick={(e) => {
                  e.stopPropagation();
                  setIsDuplicateModalOpen(true);
                }}
                disable={disabled || isSubmitting}
                isLoading={isLoading || isSubmitting}
                variant="outlined"
              >
                Duplicate
              </Button>
              <Button
                onBtnClick={() => onDeleteClick()}
                disable={disabled || isSubmitting}
                variant="outlined"
              >
                Delete
              </Button>
            </>
          )}

          {query.form_type === MAIN_FORM_TYPE && !query.formId && (
            <Button
              onBtnClick={async () => {
                await saveAsTemplate();
                fetchTemplate();
              }}
              disable={disabled || isSubmitting}
              isLoading={isLoading || isSubmitting}
              variant="outlined"
            >
              Save as template
            </Button>
          )}

          <Button
            onBtnClick={() => setIsPreview(true)}
            disable={disabled}
            variant="outlined"
          >
            Preview
          </Button>
          <Button
            onBtnClick={() => onDeliveryClick('draft')}
            disable={disabled}
            variant="outlined"
          >
            Save as draft
          </Button>
          <Button
            disable={disabled || isSubmitting}
            isLoading={isLoading || isSubmitting}
            onBtnClick={() => onDeliveryClick('published')}
            variant="filled"
          >
            {query.form_type === MAIN_FORM_TYPE ? 'Delivery' : 'Save'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Bottom;

const DuplicateModal = ({ isModalOpen, setIsModalOpen }) => {
  const { duplicateForm, setIsDuplicateModalOpen } = useForms();
  const [title, setTitle] = useState('');
  return (
    <Modal
      id="duplocate-form-title"
      modalOpen={isModalOpen}
      setModalOpen={setIsModalOpen}
      title="Duplicate Form"
    >
      <div className="p-6 space-y-6">
        <div>
          <label className="block mb-1 text-sm  text-[#475569]">
            Give a title to your form
          </label>
          <input
            type="text"
            value={title}
            className="w-full form-input border-[#E2E8F0] rounded-md placeholder:text-[#94A3B8]"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>
      <footer>
        <div className="flex flex-col px-6 py-5 border-t border-slate-200">
          <div className="flex self-end gap-2">
            <Button
              variant="outlined"
              onBtnClick={() => setIsDuplicateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onBtnClick={() => duplicateForm(title)}>
              Submit
            </Button>
          </div>
        </div>
      </footer>
    </Modal>
  );
};
