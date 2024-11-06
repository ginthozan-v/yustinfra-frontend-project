import React from 'react';

const Card = ({ children }) => {
  return (
    <div className="flex flex-col w-full h-full bg-white border rounded-sm shadow-lg min-h-[300px] border-slate-200">
      {children}
    </div>
  );
};

export default Card;
