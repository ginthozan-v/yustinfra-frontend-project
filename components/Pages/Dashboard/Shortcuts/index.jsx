import { PROJECT_ROUTE, SETTINGS_USERS_GROUPS_ROUTE } from '@/constants/routes';
import { SETTINGS_USERS_ROUTE } from '@/constants/routes';
import { FORM_ROUTE } from '@/constants/routes';
import { SETTINGS_COMPANY_ROUTE } from '@/constants/routes';
import { SETTINGS_ROUTE } from '@/constants/routes';
import { CREATE_FORM_TEMPLATE_ROUTE } from '@/constants/routes';
import {
  PlusIcon,
  TruckIcon,
  UserPlusIcon,
  ViewColumnsIcon,
  ClipboardIcon,
  Cog8ToothIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const Shortcuts = () => {
  const shortcuts = [
    {
      id: 0,
      label: 'Create new form',
      Icon: PlusIcon,
      link: CREATE_FORM_TEMPLATE_ROUTE,
    },
    {
      id: 1,
      label: 'Projects',
      Icon: TruckIcon,
      link: PROJECT_ROUTE,
    },
    {
      id: 3,
      label: 'Users',
      Icon: UserPlusIcon,
      link: SETTINGS_ROUTE + SETTINGS_USERS_ROUTE,
    },
    {
      id: 4,
      label: 'User Groups',
      Icon: UsersIcon,
      link: SETTINGS_ROUTE + SETTINGS_USERS_GROUPS_ROUTE,
    },
    {
      id: 5,
      label: 'Forms',
      Icon: ClipboardIcon,
      link: FORM_ROUTE,
    },
    {
      id: 6,
      label: 'Settings',
      Icon: Cog8ToothIcon,
      link: SETTINGS_ROUTE + SETTINGS_COMPANY_ROUTE,
    },
  ];

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-base font-medium text-slate-800">Shortcuts</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {shortcuts?.map(({ id, label, link, Icon }) => (
          <Link key={id} href={link}>
            <div className="p-5 text-center transition-shadow duration-300 ease-in-out bg-white border rounded-sm cursor-pointer aspect-square hover:shadow">
              <div className="flex flex-col items-center justify-center h-full">
                <div>
                  <div className="inline-flex w-6 h-6 xl:w-10 xl:h-10 text-[#111826] rounded-full">
                    <Icon />
                  </div>
                  <div className="mt-2 text-base xl:text-lg text-[#1E293B]">
                    {label}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Shortcuts;
