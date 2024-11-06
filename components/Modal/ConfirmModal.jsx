import React from 'react';
import Modal from '.';

const ConfirmModal = ({ title, isOpen, setIsOpen, yesText, noText, onYes }) => {
  return (
    <Modal id="delete-confirm" modalOpen={isOpen} setModalOpen={setIsOpen}>
      <div className="flex p-5 space-x-4 text-left">
        {/* Icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 bg-rose-100">
          <svg
            className="w-4 h-4 fill-current shrink-0 text-rose-500"
            viewBox="0 0 16 16"
          >
            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
          </svg>
        </div>
        {/* Content */}
        <div>
          {/* Modal header */}
          <div className="mb-2">
            <div className="text-lg font-semibold text-slate-800">{title}</div>
          </div>
          {/* Modal content */}
          <div className="mb-10 text-sm">
            <div className="space-y-2">
              <p>
                Semper eget duis at tellus at urna condimentum mattis
                pellentesque lacus suspendisse faucibus interdum.
              </p>
            </div>
          </div>
          {/* Modal footer */}
          <div className="flex flex-wrap justify-end space-x-2">
            <button
              className="btn-sm border-slate-200 hover:border-slate-300 text-slate-600"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              {noText ?? 'No, Go back'}
            </button>
            <button
              onClick={() => onYes()}
              className="text-white btn-sm bg-rose-500 hover:bg-rose-600"
            >
              {yesText ?? 'Yes, Delete it'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
