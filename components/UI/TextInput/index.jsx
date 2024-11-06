import { Field } from "formik";
import InputGroup from "../InputGroup";

const TextInput = ({
  label,
  placeholder,
  name,
  type,
  error,
  hint,
  required,
  onBlur,
}) => {
  return (
    <InputGroup
      name={name}
      label={label}
      error={error}
      hint={hint}
      required={required}
    >
      <Field
        name={name}
        type={type}
        placeholder={placeholder}
        errors={error && error[name]}
        onBlur={(e) => onBlur && onBlur(e.target.value)}
        className={`w-full form-input border-[#E2E8F0] rounded-md placeholder:text-[#94A3B8] ${
          error && error[name] && "!border-red-500"
        }`}
      />
    </InputGroup>
  );
};

export default TextInput;
