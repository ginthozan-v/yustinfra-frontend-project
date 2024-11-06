import React from 'react';
import CloseXIcon from '../UI/icons/CloseXIcon';
import AlertBox from '../AlertBox';

function RightPanel({
  rightPanelOpen,
  setRightPanelOpen,
  title,
  subtitle,
  error,
  children,
}) {
  return (
    <>
      <div
        className={`fixed top-10 left-0 sm:right-0 w-fit sm:left-auto z-[40] shadow-xl transition-transform duration-200 ease-in-out ${
          rightPanelOpen ? 'translate-x-' : 'translate-x-full'
        }`}
      >
        <div className="bg-slate-50 overflow-x-hidden overflow-y-auto no-scrollbar shrink-0 border-l border-slate-200 w-full sm:w-[370px] h-[calc(100vh-40px)]">
          {setRightPanelOpen && (
            <button
              onClick={() => setRightPanelOpen(false)}
              className="absolute top-0 right-0 z-50 p-2 mt-6 mr-6 lg:top-12 xl:top-0 group"
            >
              <CloseXIcon />
            </button>
          )}

          <div className="w-screen px-4 py-8 lg:px-8 md:w-auto">
            <div className="max-w-sm mx-auto lg:max-w-none">
              <div className="mb-1 font-semibold text-left text-slate-800">
                {title}
              </div>
              <div className="text-sm italic text-left">{subtitle}</div>
              {error && (
                <div className="mt-4">
                  <AlertBox type="error" message={error} />
                </div>
              )}
              <div>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RightPanel;
