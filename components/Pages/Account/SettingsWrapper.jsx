import React from 'react';
import SettingsSidebar from './SettingsSidebar';

const SettingsWrapper = ({ children }) => {
  return (
    <div className="w-full mb-8 bg-white rounded-sm shadow-lg h-fit">
      <div className="flex flex-col h-full md:flex-row">
        <SettingsSidebar />
        {children}
      </div>
    </div>
  );
};

export default SettingsWrapper;
