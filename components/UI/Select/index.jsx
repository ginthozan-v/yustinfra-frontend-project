import React from 'react';
import ReactSelect from './ReactSelect';
import { Field } from 'formik';

const SelectDropdown = ({
  label,
  name,
  placeholder,
  isMulti,
  options,
  isDisabled,
  isLoading,
}) => {
  return (
    <div className="w-full">
      <label className="block mb-1 text-sm text-[#475569]" htmlFor={name}>
        {label}
      </label>
      <Field
        name={name}
        placeholder={placeholder}
        isMulti={isMulti}
        isDisabled={isDisabled}
        isLoading={isLoading}
        options={options}
        component={ReactSelect}
        className="outline-none"
      />
    </div>
  );
};

export default SelectDropdown;
