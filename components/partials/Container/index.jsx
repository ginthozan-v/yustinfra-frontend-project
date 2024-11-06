import React from 'react';

const Container = ({ children }) => {
  return (
    <div className="relative z-10 w-full h-full px-4 py-8 mx-auto overflow-x-hidden sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

export default Container;
