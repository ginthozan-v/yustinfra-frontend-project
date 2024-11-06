const Tab = ({ tabs, activeTab, handleTabClick }) => {
  return (
    <div className="relative ">
      <div className="absolute bottom-0 w-full " aria-hidden="true"></div>
      <ul className="relative flex -mx-4 overflow-x-scroll text-sm font-medium flex-nowrap sm:-mx-6 lg:-mx-8 no-scrollbar">
        {tabs?.map((tab) => (
          <li
            key={tab.id}
            className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8"
          >
            <button
              className={`block pb-1.5 whitespace-nowrap outline-none ${
                activeTab === tab.id &&
                'text-indigo-500 border-b-2 border-indigo-500'
              }`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tab;
