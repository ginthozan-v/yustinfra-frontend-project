import React from 'react';
import InputGroup from '../InputGroup';

const CheckboxGroup = ({ label, name, error, hint, disabled, options }) => {
  return (
    <InputGroup name={name} label={label} error={error} hint={hint}>
      <fieldset className="mt-2">
        <div className="space-y-1">
          {options?.map((option) => (
            <div key={option.value} className="relative flex items-start">
              <div className="flex items-center h-6">
                <input
                  id={option.value}
                  aria-describedby="comments-description"
                  name={option.value}
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600 disabled:bg-gray-100"
                  disabled={disabled}
                />
              </div>
              <div className="text-sm leading-6 ">
                <label
                  htmlFor={option.value}
                  className="block ml-3 text-sm font-medium leading-6 text-gray-900"
                >
                  {option.label}
                </label>
              </div>
            </div>
          ))}
        </div>
      </fieldset>
    </InputGroup>
  );
};

export default CheckboxGroup;
