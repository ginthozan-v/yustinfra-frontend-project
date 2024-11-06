import { useState } from 'react';

const { PaperAirplaneIcon } = require('@heroicons/react/24/outline');

export const InputField = ({ placeholder, onBtnClick }) => {
  const [inputText, setInputText] = useState('');

  return (
    <div className="flex items-center gap-1 px-2 py-4 bg-white border-b border-x lg:border-x-0 border-slate-200">
      <input
        className="w-full form-input border-[#E2E8F0] rounded-md placeholder:text-[#94A3B8]"
        placeholder={placeholder}
        onChange={(e) => setInputText(e.target.value)}
        value={inputText}
      />
      <button
        disabled={!inputText}
        onClick={() => {
          onBtnClick(inputText);
          setInputText('');
        }}
        className="flex items-center justify-center w-10 h-10 border rounded shrink-0 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <PaperAirplaneIcon className="w-5 h-5 text-slate-400" />
      </button>
    </div>
  );
};
