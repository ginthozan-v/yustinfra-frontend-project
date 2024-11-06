import React from 'react';

const IconButton = ({ handleClick, disabled, children }) => {
  return (
    <button
      onClick={handleClick}
      type="button"
      className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-gray-100 shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 w-full"
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default IconButton;
