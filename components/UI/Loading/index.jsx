import React from 'react';

const Loading = () => {
  return (
    <div className="m-1.5">
      <button
        className="text-white bg-indigo-500 shadow-none btn hover:bg-indigo-600 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
        disabled
      >
        <svg
          className="w-4 h-4 fill-current animate-spin shrink-0"
          viewBox="0 0 16 16"
        >
          <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
        </svg>
        <span className="ml-2">Loading</span>
      </button>
    </div>
  );
};

export default Loading;
