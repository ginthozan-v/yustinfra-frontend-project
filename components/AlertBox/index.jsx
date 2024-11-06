import React from 'react';

const AlertBox = ({ type, message }) => {
  const borderColor = {
    error: 'border-red-200',
    success: 'border-green-200',
  };

  const textColor = {
    error: 'text-red-600 bg-red-100',
    success: 'text-green-600 bg-green-100',
  };

  return (
    <div className={`border-t ${borderColor[type]}`}>
      <div className="mt-5">
        <div className={`px-3 py-2 rounded ${textColor[type]}`}>
          <svg
            className="inline w-3 h-3 mr-2 fill-current shrink-0"
            viewBox="0 0 12 12"
          >
            <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
          </svg>
          <span className="text-sm">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default AlertBox;
