import { Field } from 'formik';
import InputGroup from '../InputGroup';

const TextArea = ({
  label,
  placeholder,
  name,
  type,
  error,
  hint,
  value,
  onBlur,
}) => {
  return (
    <InputGroup name={name} label={label} error={error} hint={hint}>
      <Field
        as="textarea"
        rows={4}
        name={name}
        type={type}
        placeholder={placeholder}
        errors={error?.[name]}
        onBlur={(e) => onBlur && onBlur(e.target.value)}
        className={`w-full form-input border-[#E2E8F0] rounded-md placeholder:text-[#94A3B8] ${
          error?.[name] && '!border-red-500'
        }`}
      />
    </InputGroup>
  );
};

export default TextArea;
