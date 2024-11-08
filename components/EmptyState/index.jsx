function EmptyState({ title, btnTitle, onBtnClick }) {
  return (
    <div className="max-w-2xl m-auto mt-16">
      <div className="px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-t from-slate-200 to-slate-100">
          <svg className="w-5 h-6 fill-current" viewBox="0 0 20 24">
            <path
              className="text-slate-500"
              d="M10 10.562l9-5-8.514-4.73a1 1 0 00-.972 0L1 5.562l9 5z"
            />
            <path
              className="text-slate-300"
              d="M9 12.294l-9-5v10.412a1 1 0 00.514.874L9 23.294v-11z"
            />
            <path
              className="text-slate-400"
              d="M11 12.294v11l8.486-4.714a1 1 0 00.514-.874V7.295l-9 4.999z"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-slate-800">{title}</h2>
        <div className="mb-6">
        Sorry, no data available at the moment. Please check back later.
        </div>
        {btnTitle && (
          <button
            onClick={onBtnClick}
            className="text-white bg-indigo-500 btn hover:bg-indigo-600"
          >
            <svg
              className="w-4 h-4 opacity-50 fill-current shrink-0"
              viewBox="0 0 16 16"
            >
              <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
            </svg>
            <span className="ml-2">{btnTitle}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default EmptyState;
