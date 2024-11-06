import React from 'react';

const Button = ({
  children,
  type,
  disable,
  isLoading,
  onBtnClick,
  variant,
  fullWidth,
}) => {
  const color = {
    filled:
      'text-white bg-indigo-600 btn hover:bg-indigo-500 disabled:hover:bg-indigo-300 disabled:bg-indigo-300',
    outlined:
      'text-slate-600 btn border-slate-300 hover:bg-slate-100  border bg-white disabled:hover:border-slate-300 disabled:hover:text-slate-600 disabled:hover:bg-white',
  };

  return (
    <button
      type={type || 'button'}
      className={`rounded-md text-xs md:text-sm  ${
        isLoading
          ? 'cursor-progress'
          : 'cursor-pointer disabled:cursor-not-allowed'
      } ${color[variant || 'filled']} ${fullWidth && 'w-full'}`}
      disabled={disable}
      onClick={onBtnClick}
    >
      {children}
    </button>
  );
};

export default Button;
