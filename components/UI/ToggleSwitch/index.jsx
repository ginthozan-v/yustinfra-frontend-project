import React from 'react';
import InputGroup from '../InputGroup';

const ToggleSwitch = ({
  name,
  label,
  error,
  hint,
  required,
  disabled,
  onChange,
  fields,
}) => {
  return (
    <>
      <InputGroup
        name={name}
        label={label}
        error={error}
        hint={hint}
        required={required}
      >
        <span className="inline-flex w-full rounded-md isolate">
          <button
            type="button"
            className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-l-md ring-1 ring-inset ring-gray-300 focus:bg-indigo-400 hover:bg-gray-50 focus:z-10 disabled:bg-gray-100 active:ring-indigo-400 focus:ring-indigo-400 "
            onClick={() => onChange('yes')}
            disabled={disabled}
          >
            Yes
          </button>

          <button
            type="button"
            className="relative inline-flex items-center px-3 py-2 -ml-px text-sm font-semibold text-gray-900 bg-white rounded-r-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:bg-indigo-400 focus:z-10 disabled:bg-gray-100 active:ring-indigo-400 focus:ring-indigo-400"
            disabled={disabled}
            onClick={() => onChange('no')}
          >
            No
          </button>
        </span>
      </InputGroup>
    </>
  );
};

export default ToggleSwitch;
