import React from 'react';

const InputGroup = ({ name, label, error, required, hint, children }) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block mb-1 text-sm text-[#475569] text-left"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {children}
      {hint && <p className="mt-1 text-xs text-left text-gray-400">{hint}</p>}
      {error && <small className="text-red-500">{error[name]}</small>}
    </div>
  );
};

export default InputGroup;
