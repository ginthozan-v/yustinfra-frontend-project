import React from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

const Header = ({ title, sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="sticky top-0 left-0 w-full bg-indigo-600 border-b z-60 border-slate-200">
      <div className="flex items-center justify-between h-12 px-5 -mb-px md:px-8">
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        {/* Header: Left side */}
        <div className="flex">
          {/* Hamburger button */}
          <button
            className="text-white hover:text-slate-600 lg:hidden"
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
          >
            <span className="sr-only">Open sidebar</span>
            {sidebarOpen ? (
              <XMarkIcon className="w-6 h-6 text-white" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
