import { PlusIcon } from '@heroicons/react/24/outline';

export const PanelHeader = ({ isOpen, title, onBtnClick }) => {
  return (
    <div
      className={`flex items-center h-16 border-slate-200 cursor-pointer ${
        isOpen ? 'border-b px-5' : ''
      }`}
    >
      {isOpen ? (
        <div className={`flex items-center justify-between w-full`}>
          {/* Profile image */}
          <div className="relative">
            <div className={`flex items-center grow`}>
              <img
                className="w-8 h-8 mr-2 rounded-full"
                src={'/images/channel-03.png'}
                width="32"
                height="32"
                alt="Group 01"
              />
              <p className={`font-semibold text-slate-800`}>{title}</p>
            </div>
          </div>

          {/* Add button */}
          {onBtnClick && isOpen && (
            <button
              onClick={onBtnClick}
              className="p-1.5 shrink-0 rounded border border-slate-200 hover:border-slate-300 shadow-sm ml-2"
            >
              <PlusIcon className="w-5 h-5 text-slate-400" />
            </button>
          )}
        </div>
      ) : (
        <span
          className={`font-semibold text-slate-800 w-full rotate-90 mt-8 overflow-hidden`}
        >
          {title}
        </span>
      )}
    </div>
  );
};
