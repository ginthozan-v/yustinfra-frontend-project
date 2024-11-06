import React from 'react';
import InputGroup from '../InputGroup';

const RadioGroup = ({ label, name, error, hint, disabled, options }) => {
  return (
    <InputGroup name={name} label={label} error={error} hint={hint}>
      <fieldset className="mt-2">
        <div className="space-y-1">
          {options?.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                id={option.value}
                name={name}
                type="radio"
                defaultChecked={option.id === 'email'}
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-600 disabled:bg-gray-100"
                disabled={disabled}
              />
              <label
                htmlFor={option.value}
                className="block ml-3 text-sm font-medium leading-6 text-gray-900"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </InputGroup>
  );
};

export default RadioGroup;
