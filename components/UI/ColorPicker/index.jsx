import { Field } from 'formik';
import InputGroup from '../InputGroup';

const ColorPicker = ({ label, placeholder, name, hint, error, onBlur }) => {
  return (
    <InputGroup name={name} label={label} error={error} hint={hint}>
      <Field
        name={name}
        type={'color'}
        placeholder={placeholder}
        errors={error && error[name]}
        onBlur={(e) => onBlur && onBlur(e.target.value)}
        className={`w-12 h-12 form-input p-1 border-[#E2E8F0] rounded-md placeholder:text-[#94A3B8] ${
          error && error[name] && '!border-red-500'
        }`}
      />
    </InputGroup>
  );
};

export default ColorPicker;
