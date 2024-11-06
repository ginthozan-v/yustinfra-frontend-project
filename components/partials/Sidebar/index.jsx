import React, { useRef, useState, useEffect } from 'react';
import MenuItem from './MenuItem';

import {
  DASHBOARD_ROUTE,
  FORM_ROUTE,
  HELP_ROUTE,
  PROJECT_ROUTE,
  SETTINGS_COMPANY_ROUTE,
  SETTINGS_ROUTE,
} from '@/constants/routes';
import Logo from '@/components/Logo';
import ProjectIcon from '@/components/UI/icons/ProjectIcon';
import DashboardIcon from '@/components/UI/icons/DashboardIcon';
import FormIcon from '@/components/UI/icons/FormIcon';
import SettingsIcon from '@/components/UI/icons/SettingsIcon';
import { getAuthUser } from '@/utils/auth';
import { ADMIN_ROLE, CLIENT_ROLE, MANAGER_ROLE } from '@/constants/roles';
import UserMenu from '../UserMenu';
import Link from 'next/link';
import { useRouter } from 'next/router';

let menus = [
  {
    label: 'Dashboard',
    icon: DashboardIcon,
    url: DASHBOARD_ROUTE,
  },
  {
    label: 'Projects',
    icon: ProjectIcon,
    url: PROJECT_ROUTE,
  },
  {
    label: 'Forms',
    icon: FormIcon,
    url: FORM_ROUTE,
  },
];

const sideMenus = [
  {
    label: 'Need Help?',
    icon: SettingsIcon,
    url: HELP_ROUTE,
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const trigger = useRef(null);
  const sidebar = useRef(null);
  const user = getAuthUser();

  const router = useRouter();

  const storedSidebarExpanded =
    typeof window !== 'undefined' && localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector('body').classList.add('sidebar-expanded');
    } else {
      document.querySelector('body').classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  useEffect(() => {
    if (user.role === ADMIN_ROLE) {
      sideMenus.push({
        label: 'Settings',
        icon: SettingsIcon,
        url: SETTINGS_ROUTE,
        url2: SETTINGS_COMPANY_ROUTE,
      });

      return () => {
        sideMenus.pop();
      };
    }
    if (user.role === CLIENT_ROLE || user.role === MANAGER_ROLE) {
      menus = menus.filter(
        (menu) => !['Dashboard', 'Forms'].includes(menu.label)
      );

      return () => {
        menus = menus;
      };
    }
  }, []);

  return (
    <div className="sticky top-0 z-50 h-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col fixed z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-gray-100  transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Sidebar header */}
        <div className="z-40 flex items-center justify-between h-12 p-5 bg-indigo-600 border-b border-r border-gray-200">
          {/* Close button */}
          <button
            ref={trigger}
            className="text-white lg:hidden hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <Link href={'/'} className="block cursor-pointer">
            <Logo isWhite />
          </Link>
        </div>

        {/* Links */}
        <div className="h-full px-4 space-y-8 border-r border-gray-200">
          {/* Pages group */}
          <div>
            <ul className="mt-3">
              {menus.map((menu) => (
                <MenuItem key={menu.label} menu={menu} Icon={menu.icon} />
              ))}
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        {/* <div className="justify-end hidden pt-3 mt-auto lg:inline-flex 2xl:hidden">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg
                className="w-6 h-6 fill-current sidebar-expanded:rotate-180"
                viewBox="0 0 24 24"
              >
                <path
                  className="text-slate-400"
                  d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
                />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div> */}

        {/* User Menu */}

        <div className="w-full mt-auto">
          <div className="border-t border-r border-gray-200">
            <ul className="mt-3">
              {sideMenus.map((menu) => (
                <MenuItem key={menu.label} menu={menu} Icon={menu.icon} />
              ))}
            </ul>
          </div>
          <div className="flex px-4 py-3 border-t border-r border-gray-200 ">
            <UserMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
