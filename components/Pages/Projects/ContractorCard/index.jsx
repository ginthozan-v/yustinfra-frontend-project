import Card from '@/components/Card';
import Avatar from '@/components/UI/Avatar/Index';
import DropdownEditMenu from '@/components/UI/DropdownEditMenu';
import { MAIN_FORM_TYPE } from '@/constants/fieldType';
import { CREATE_FORM_TEMPLATE_ROUTE, PROJECT_ROUTE } from '@/constants/routes';
import { getForms, getUsers } from '@/utils/projectLinkageHelper';
import { PencilIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

const ContractorCard = ({ id, title, assigned, actions }) => {
  const users = getUsers(assigned);
  const forms = getForms(assigned);

  return (
    <Card>
      <Link href={`${PROJECT_ROUTE}/${id}`}>
        <div className="p-5 border-b">
          <header className="flex items-start justify-between mb-2">
            <h2 className="mb-2 text-lg font-semibold text-slate-800">
              {title}
            </h2>
            {/* Menu button */}
            <DropdownEditMenu
              onClick={(e) => e.preventDefault()}
              align="right"
              className="relative inline-flex"
            >
              {actions?.map((action) => (
                <li key={action.id}>
                  <button
                    className="flex px-3 py-1 text-sm font-medium text-slate-600 hover:text-slate-800"
                    onClick={() => action.handleAction(id)}
                  >
                    {action.label}
                  </button>
                </li>
              ))}
            </DropdownEditMenu>
          </header>
          <div className="mb-1 text-xs uppercase text-[#B6B6B6]">
            Assigend users ({users?.length})
          </div>

          <div className="flex items-start mt-2">
            <div className="flex -space-x-3 -ml-0.5">
              {users?.map((user) => (
                <Avatar key={user.id} picture={user.profilePic} size="small" />
              ))}
            </div>
          </div>
        </div>
        <div className="p-5 grow">
          <div className="mb-1 text-xs uppercase text-[#B6B6B6]">
            Assigend forms ({forms?.length})
          </div>
          <div className="mt-3 ml-4">
            <ul className="space-y-3 text-sm list-disc list-outside text-[#475569]">
              {forms?.map((form) => (
                <li key={form?.id}>
                  <span className="flex items-start justify-between gap-5">
                    {form?.form_name}
                    <Link
                      href={{
                        pathname: CREATE_FORM_TEMPLATE_ROUTE,
                        query: { form_type: MAIN_FORM_TYPE, formId: form?.id },
                      }}
                      className="flex items-center justify-center w-8 h-8 transition-colors rounded-full hover:text-indigo-500 hover:bg-slate-100"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Link>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ContractorCard;
