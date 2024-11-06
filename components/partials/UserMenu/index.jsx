import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Transition from '@/utils/Transition';
import { getAuthUser, logout } from '@/utils/auth';
import { useRouter } from 'next/router';
import {
  LOGIN_ROUTE,
  SETTINGS_COMPANY_ROUTE,
  SETTINGS_ROUTE,
} from '@/constants/routes';
import Avatar from '@/components/UI/Avatar/Index';
import {
  ArrowRightOnRectangleIcon,
  SignalIcon,
} from '@heroicons/react/24/solid';

const UserMenu = ({ align }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [role, setRole] = useState('');
  const user = getAuthUser();

  const trigger = useRef(null);
  const dropdown = useRef(null);

  const handleSignout = () => {
    setDropdownOpen(!dropdownOpen);
    logout();
  };

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    if (user) {
      setUsername(`${user.first_name} ${user.last_name}`);
      setRole(user.role);
      setProfilePicture(user.profile_picture);
    }
  }, [user]);

  return (
    <div className="inline-flex items-center justify-between w-full group">
      <div className="inline-flex items-center">
        <Avatar picture={profilePicture} size="small" />
        <div className="flex items-center justify-between truncate">
          <span className="mx-2 text-sm font-medium truncate text-slate-500 ">
            {username}
          </span>
        </div>
      </div>
      <Link
        className="flex items-center text-sm font-medium text-indigo-300 hover:text-indigo-400"
        href={LOGIN_ROUTE}
        onClick={() => handleSignout()}
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
      </Link>
    </div>
    // <div className="relative inline-flex">
    //   <button
    //     ref={trigger}
    //     className="inline-flex items-center justify-center group"
    //     aria-haspopup="true"
    //     onClick={() => setDropdownOpen(!dropdownOpen)}
    //     aria-expanded={dropdownOpen}
    //   >
    //     <Avatar picture={profilePicture} size="small" />

    //     <div className="flex items-center truncate">
    //       <span className="mx-2 text-sm font-medium truncate text-slate-400 group-hover:text-slate-500">
    //         {username}
    //       </span>
    //       <svg
    //         className="w-3 h-3 ml-1 text-white fill-current shrink-0"
    //         viewBox="0 0 12 12"
    //       >
    //         <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
    //       </svg>
    //     </div>
    //   </button>

    //   <Transition
    //     className={`origin-top-right z-60 absolute top-full min-w-44 bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${
    //       align === 'right' ? 'right-0' : 'left-0'
    //     }`}
    //     show={dropdownOpen}
    //     enter="transition ease-out duration-200 transform"
    //     enterStart="opacity-0 -translate-y-2"
    //     enterEnd="opacity-100 translate-y-0"
    //     leave="transition ease-out duration-200"
    //     leaveStart="opacity-100"
    //     leaveEnd="opacity-0"
    //   >
    //     <div
    //       ref={dropdown}
    //       onFocus={() => setDropdownOpen(true)}
    //       onBlur={() => setDropdownOpen(false)}
    //     >
    //       <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200">
    //         <div className="font-medium text-slate-800"> {username}</div>
    //         <div className="text-xs italic text-slate-500">{role}</div>
    //       </div>
    //       <ul>
    //         <li>
    //           <Link
    //             className="flex items-center px-3 py-1 text-sm font-medium text-indigo-500 hover:text-indigo-600"
    //             href={SETTINGS_ROUTE + SETTINGS_COMPANY_ROUTE}
    //             onClick={() => setDropdownOpen(!dropdownOpen)}
    //           >
    //             Settings
    //           </Link>
    //         </li>
    //         <li>
    //           <Link
    //             className="flex items-center px-3 py-1 text-sm font-medium text-indigo-500 hover:text-indigo-600"
    //             href={LOGIN_ROUTE}
    //             onClick={() => handleSignout()}
    //           >
    //             Sign Out
    //           </Link>
    //         </li>
    //       </ul>
    //     </div>
    //   </Transition>
    // </div>
  );
};

export default UserMenu;
