import React from 'react';
import FlatPickr from 'react-flatpickr';
import InputGroup from '../InputGroup';

const DatePicker = ({
  name,
  label,
  error,
  hint,
  align,
  defaultDate,
  onChange,
  disabled,
}) => {
  const options = {
    monthSelectorType: 'static',
    dateFormat: 'M j, Y H:i',
    enableTime: true,
    prevArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    nextArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    // onReady: (selectedDates, dateStr, instance) => {
    //   instance.element.value = dateStr.replace('to', '-');
    //   const customClass = align ? align : '';
    //   instance.calendarContainer.classList.add(`flatpickr-${customClass}`);
    // },
    onChange: (selectedDates, dateStr, instance) => {
      // instance.element.value = dateStr.replace('to', '-');
      onChange && onChange(selectedDates);
    },
  };

  if (defaultDate) {
    options['defaultDate'] = new Date();
  }

  return (
    <InputGroup name={name} label={label} error={error} hint={hint}>
      <div className="relative w-full">
        <FlatPickr
          className="form-input pl-9 border-[#E2E8F0] rounded-md placeholder:text-[#94A3B8] font-sm text-slate-500 hover:text-slate-600 focus:border-slate-300 w-full disabled:border-[#E2E8F0] disabled:bg-gray-100"
          options={options}
          disabled={disabled}
        />

        <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 ml-3 fill-current text-slate-500"
            viewBox="0 0 16 16"
          >
            <path d="M15 2h-2V0h-2v2H9V0H7v2H5V0H3v2H1a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V3a1 1 0 00-1-1zm-1 12H2V6h12v8z" />
          </svg>
        </div>
      </div>
    </InputGroup>
  );
};

export default DatePicker;
