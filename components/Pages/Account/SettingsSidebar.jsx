import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  UserIcon,
  UsersIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import {
  SETTINGS_COMPANY_ROUTE,
  SETTINGS_ROUTE,
  SETTINGS_USERS_GROUPS_ROUTE,
  SETTINGS_USERS_ROUTE,
} from '@/constants/routes';

function SettingsSidebar() {
  const location = useRouter();
  const { pathname } = location;

  const businessSettings = [
    {
      id: 0,
      label: 'My Profile',
      Icon: UserIcon,
      url: SETTINGS_ROUTE + SETTINGS_COMPANY_ROUTE,
    },
  ];

  const userSettings = [
    {
      id: 0,
      label: 'Users',
      Icon: UsersIcon,
      url: SETTINGS_ROUTE + SETTINGS_USERS_ROUTE,
    },
    {
      id: 1,
      label: 'User Groups',
      Icon: UserGroupIcon,
      url: SETTINGS_ROUTE + SETTINGS_USERS_GROUPS_ROUTE,
    },
  ];

  return (
    <div className="flex max-w-xs px-3 py-6 overflow-x-scroll border-b sm:max-w-sm md:max-w-none md:basis-2/5 xl:basis-1/5 flex-nowrap no-scrollbar md:block md:overflow-auto md:border-b-0 md:border-r border-slate-200 md:space-y-3">
      {/* Group 1 */}
      <div>
        <div className="mb-3 text-xs font-semibold uppercase text-slate-400">
          Business settings
        </div>
        <ul className="flex mr-3 flex-nowrap md:block md:mr-0">
          {businessSettings.map(({ id, label, url, Icon }) => (
            <li key={id} className="mr-0.5 md:mr-0 md:mb-0.5">
              <Link
                href={url}
                className={`flex items-center px-2.5 py-2 rounded whitespace-nowrap ${
                  pathname.includes(url) && 'bg-indigo-50'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 text-slate-400 mr-2 ${
                    pathname.includes(url) && 'text-indigo-200'
                  }`}
                />

                <span
                  className={`text-sm font-medium ${
                    pathname.includes(url)
                      ? 'text-indigo-500'
                      : 'hover:text-slate-700'
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* Group 2 */}
      <div>
        <div className="mb-3 text-xs font-semibold uppercase text-slate-400">
          User Settings
        </div>
        <ul className="flex mr-3 flex-nowrap md:block md:mr-0">
          {userSettings.map(({ id, label, url, Icon }) => (
            <li key={id} className="mr-0.5 md:mr-0 md:mb-0.5">
              <Link
                href={url}
                className={`flex items-center px-2.5 py-2 rounded whitespace-nowrap ${
                  pathname.includes(url) && 'bg-indigo-50'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0  text-slate-400 mr-2 ${
                    pathname.includes(url) && 'text-indigo-400'
                  }`}
                />

                <span
                  className={`text-sm font-medium ${
                    pathname.includes(url)
                      ? 'text-indigo-500'
                      : 'hover:text-slate-700'
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SettingsSidebar;
