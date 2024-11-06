import ConfirmModal from '@/components/Modal/ConfirmModal';
import Tab from '@/components/Tab';
import { useForms } from '@/context/FormContext';
import useWarnIfUnsavedChanges from '@/hooks/useWarnIfUnsavedChanges';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Header = ({ tabs, activeTab, handleTabClick, isBack }) => {
  const { formTitle, setFormTitle, isEditing, setIsEditing } = useForms();
  const [isConfirm, setIsConfirm] = useState(false);

  const router = useRouter();
  const { query } = router;

  const title = {
    sub_form: 'Sub Form',
    template: 'Template',
  };

  const handleBackBtn = () => {
    if (isEditing) {
      setIsConfirm(true);
    } else {
      router.back();
    }
  };

  return (
    <div className="relative z-50 bg-white shadow">
      <ConfirmModal
        title="You have unsaved changes. Do you really want to leave?"
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        yesText="Yes"
        noText="Cancel"
        onYes={() => {
          setIsEditing(false);
          setIsConfirm(false);
          router.back();
        }}
      />
      <div className="flex flex-wrap items-center justify-between w-full h-12 px-5 py-2 mx-auto -mb-px md:px-8 ">
        {isBack && (
          <button
            onClick={() => handleBackBtn()}
            className="flex items-center justify-center w-6 h-6 mr-8 transition-transform ease-linear rounded hover:scale-105 bg-indigo-50"
          >
            <ChevronLeftIcon className="w-4 h-4 text-indigo-700" />
          </button>
        )}

        <div className="flex">
          <h1 className="text-lg font-semibold text-slate-500">
            {title[query.form_type]}
          </h1>
        </div>

        <div className="absolute bottom-0 flex-1 mt-auto ml-14">
          {tabs &&
            query.form_type === 'main_form' &&
            !query.formId &&
            Tabs(tabs, activeTab, handleTabClick)}
        </div>

        {/* <div className="grid py-1.5 justify-start grid-flow-col gap-2 sm:auto-cols-max sm:justify-end">
          <input
            type="text"
            placeholder="Fill in the form name *"
            className="w-full form-input border-[#E2E8F0] rounded-md z-40 placeholder:text-[#94A3B8]"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
        </div> */}
      </div>
    </div>
  );
};

export default Header;

const Tabs = (tabs, activeTab, handleTabClick) => {
  return (
    <div className="max-w-2xl mb-4 sm:mb-0">
      <Tab tabs={tabs} activeTab={activeTab} handleTabClick={handleTabClick} />
    </div>
  );
};
