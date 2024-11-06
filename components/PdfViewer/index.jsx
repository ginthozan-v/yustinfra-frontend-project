import React, { Fragment, useState } from 'react';
import IconButton from '../UI/IconButton';
import { PaperClipIcon } from '@heroicons/react/24/solid';
import { Transition } from 'react-transition-group';

const PdfViewer = ({ label }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <div className="w-full">
        <IconButton handleClick={() => setOpen(true)}>
          <PaperClipIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
          {label}
        </IconButton>
      </div>

      <Transition
        as={Fragment}
        show={open}
        enter="transition ease duration-700 transform"
        enterFrom="opacity-0 translate-y-0"
        enterTo="opacity-100 -translate-y-10"
        leave="transition ease duration-1000 transform"
        leaveFrom="opacity-100 -translate-y-full"
        leaveTo="opacity-0 translate-y-0"
      >
        <div className="absolute bottom-0 left-0 z-40 w-full overflow-hidden text-center border-t rounded-t-3xl bg-slate-100 shadow-top">
          <ul className="divide-y ">
            {/* {pages?.map((page) => (
              <li
                key={page.id}
                className="px-5 py-3 text-lg font-semibold cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50 active:bg-indigo-50 text-slate-600"
                onClick={() => setPage(page.id)}
              >
                {page.name}
              </li>
            ))} */}

            <li
              className="px-5 pt-3 pb-5 text-lg font-semibold cursor-pointer text-slate-600 hover:bg-indigo-50 focus:bg-indigo-50 active:bg-indigo-50"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
};

export default PdfViewer;
