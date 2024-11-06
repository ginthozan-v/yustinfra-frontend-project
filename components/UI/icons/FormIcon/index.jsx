import React from 'react';

const FormIcon = ({ isActive }) => {
  const color2 = isActive ? 'text-indigo-600' : 'text-slate-600';
  const color3 = isActive ? 'text-indigo-200' : 'text-slate-200';

  return (
    <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
      <circle
        className={`fill-current  ${color3}`}
        cx="18.5"
        cy="5.5"
        r="4.5"
      />
      <circle className={`fill-current  ${color2}`} cx="5.5" cy="5.5" r="4.5" />
      <circle
        className={`fill-current  ${color2}`}
        cx="18.5"
        cy="18.5"
        r="4.5"
      />
      <circle
        className={`fill-current  ${color3}`}
        cx="5.5"
        cy="18.5"
        r="4.5"
      />
    </svg>
  );
};

export default FormIcon;
