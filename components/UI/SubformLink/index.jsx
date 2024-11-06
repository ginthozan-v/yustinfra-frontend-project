import { CREATE_FORM_TEMPLATE_ROUTE } from '@/constants/routes';
import { useForms } from '@/context/FormContext';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React from 'react';

const SubformLink = ({ label, value, link }) => {
  const { fetchSubformPreview } = useForms();

  return (
    <div
      onClick={() => fetchSubformPreview(value)}
      className="sm:flex sm:items-center sm:justify-between"
    >
      <div className="flex items-center text-sm sm:grow">
        <div className="flex items-center justify-center w-8 h-8 my-2 mr-3 rounded-full shrink-0 bg-amber-500">
          <DocumentTextIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-medium text-slate-800">{label}</div>
          <div className="flex items-center space-x-2 flex-nowrap whitespace-nowrap">
            <div className="text-indigo-500 hover:underline">
              {link && (
                <Link
                  href={`${CREATE_FORM_TEMPLATE_ROUTE}?form_type=sub_form&formId=${value}`}
                  target="_blank"
                >
                  View form
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubformLink;
