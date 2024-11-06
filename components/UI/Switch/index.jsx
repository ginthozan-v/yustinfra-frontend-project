import { Field } from 'formik';

const Switch = ({ id, label, name, onChange, value, disabled }) => {
  return (
    <>
      <div className="flex items-start">
        <div className="form-switch">
          {onChange ? (
            <Field
              type="checkbox"
              id={name}
              name={name}
              className="sr-only"
              onChange={(e) => onChange(e)}
            />
          ) : (
            <Field
              type="checkbox"
              id={name}
              name={name}
              className="sr-only"
              disabled={disabled}
            />
          )}

          <label className="bg-slate-400" htmlFor={name}>
            <span className="bg-white shadow-sm" aria-hidden="true"></span>
            <span className="sr-only">{label}</span>
          </label>
        </div>
        <div className="ml-2 text-base text-slate-400">{label}</div>
      </div>
    </>
  );
};

export default Switch;
