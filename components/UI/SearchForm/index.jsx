function SearchForm({ placeholder, value, onSearch }) {
  return (
    <form className="relative">
      <label htmlFor="action-search" className="sr-only">
        Search
      </label>
      <input
        id="action-search"
        className={`w-full form-input pl-9 border-[#E2E8F0] rounded-md placeholder:text-[#94A3B8]  outline-none`}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onSearch(e.target.value)}
      />
      <button
        className="absolute inset-0 right-auto outline-none group"
        type="submit"
        aria-label="Search"
      >
        <svg
          className="w-4 h-4 ml-3 mr-2 fill-current shrink-0 text-slate-400 group-hover:text-slate-500"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
          <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
        </svg>
      </button>
    </form>
  );
}

export default SearchForm;
