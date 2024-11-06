import Select from 'react-select';

const ReactSelect = ({
  form,
  field,
  label,
  options,
  placeholder,
  isDisabled,
  isLoading,
  isMulti,
  error,
  onSelectChange,
  value,
}) => {
  const style = {
    control: (base) => ({
      ...base,
      border: 0,
    }),
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: '#94A3B8',
        fontWeight: 400,
      };
    },
  };

  return (
    <>
      <div className="w-full">
        {label && (
          <label
            className="block mb-1 text-sm max-w-[95%] text-[#475569]"
            htmlFor={field.name}
          >
            {label}
          </label>
        )}

        <Select
          styles={style}
          className={`w-full p-0 form-input border-[#E2E8F0] rounded-md placeholder:text-[#94A3B8] my-1.5 ${
            error && error[field.name] && '!border-red-500'
          }`}
          menuPlacement="auto"
          classNamePrefix="select"
          placeholder={placeholder || field.placeholder}
          isDisabled={isDisabled}
          isLoading={isLoading}
          isClearable={false}
          isSearchable={true}
          isMulti={isMulti}
          name={field.name}
          options={options}
          value={value || field.value}
          instanceId={field.name}
          onChange={(option) =>
            form
              ? form?.setFieldValue(field.name, option)
              : onSelectChange(option)
          }
        />
      </div>
    </>
  );
};

export default ReactSelect;
