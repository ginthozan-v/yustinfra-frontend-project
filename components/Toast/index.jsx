import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const Toast = ({ t, title, message, toast, type }) => {
  return (
    <div className="flex flex-col items-center w-full space-y-4">
      <Transition
        appear
        show={t?.visible}
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-0 opacity-0"
        enterTo="translate-y-2 opacity-100"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="flex w-full max-w-md bg-white rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5">
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                {title === 'Error' ? (
                  <ExclamationCircleIcon className="w-10 h-10 text-red-500" />
                ) : (
                  title === 'Success' && (
                    <CheckCircleIcon className="w-10 h-10 text-green-500" />
                  )
                )}
              </div>
              <div className="flex-1 w-0 ml-3">
                <p className="text-sm font-medium text-gray-900">{title}</p>
                <p className="mt-1 text-sm text-gray-500">{message}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              type="button"
              className="flex items-center justify-center w-full p-4 text-sm font-medium text-indigo-600 border border-transparent rounded-none rounded-r-lg hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => toast?.dismiss(t?.id)}
            >
              Close
            </button>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default Toast;
