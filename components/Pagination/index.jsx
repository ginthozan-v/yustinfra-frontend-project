import React from 'react';

const Pagination = ({ page, max, total, handleChangePage }) => {
  const startIndex = page * max;
  const endIndex = startIndex + max;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <nav
        className="mb-4 sm:mb-0 sm:order-1"
        role="navigation"
        aria-label="Navigation"
      >
        <ul className="flex justify-center">
          <li className="ml-3 first:ml-0">
            <button
              onClick={() => handleChangePage(page - 1)}
              className="text-indigo-500 bg-white btn border-slate-200 hover:border-slate-300 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:border-slate-200"
              disabled={page <= 0}
            >
              &lt;- Previous
            </button>
          </li>
          <li className="ml-3 first:ml-0">
            <button
              onClick={() => handleChangePage(page + 1)}
              className="text-indigo-500 bg-white btn border-slate-200 hover:border-slate-300 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:border-slate-200"
              disabled={endIndex >= total}
            >
              Next -&gt;
            </button>
          </li>
        </ul>
      </nav>
      <div className="text-sm text-center text-slate-500 sm:text-left">
        Page{' '}
        <span className="font-medium text-slate-600">
          {page + 1} of{' '}
          {Math.ceil(total / max) === 0 ? 1 : Math.ceil(total / max)}
        </span>
        {/* Showing <span className="font-medium text-slate-600">{page * max}</span>{' '}
        to <span className="font-medium text-slate-600">{max}</span> of{' '}
        <span className="font-medium text-slate-600">{total}</span> results */}
      </div>
    </div>
  );
};

export default Pagination;
