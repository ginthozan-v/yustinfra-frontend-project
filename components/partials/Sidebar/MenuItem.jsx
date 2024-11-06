import ConfirmModal from '@/components/Modal/ConfirmModal';
import { useForms } from '@/context/FormContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const MenuItem = ({ menu, Icon }) => {
  const { label } = menu;
  const router = useRouter();
  const pathname = router.pathname;
  const [isConfirm, setIsConfirm] = useState(false);
  const { isEditing, setIsEditing } = useForms();

  const handleNavigation = () => {
    if (isEditing) {
      setIsConfirm(true);
    } else {
      router.push(menu.url2 ? menu.url + menu.url2 : menu.url);
    }
  };

  return (
    <>
      <ConfirmModal
        title="You have unsaved changes. Do you really want to leave?"
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        yesText="Yes"
        noText="Cancel"
        onYes={() => {
          setIsConfirm(false);
          setIsEditing(false);
          router.push(menu.url2 ? menu.url + menu.url2 : menu.url);
        }}
      />
      <li
        className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0  ${
          pathname.includes('calendar') && 'bg-slate-900'
        }`}
      >
        <button
          onClick={() => handleNavigation()}
          className="w-full"
          // href={menu.url2 ? menu.url + menu.url2 : menu.url}
        >
          <div
            className={`block text-slate-400 cursor-pointer hover:text-slate-600 truncate transition duration-150 p-2 ${
              pathname.includes(menu.url) &&
              'text-slate-700 bg-slate-200 rounded'
            }`}
          >
            <div className="flex items-center">
              <Icon isActive={pathname.includes(menu.url)} />
              <span className="ml-3 text-sm font-medium duration-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100">
                {label}
              </span>
            </div>
          </div>
        </button>
      </li>
    </>
  );
};

export default MenuItem;
