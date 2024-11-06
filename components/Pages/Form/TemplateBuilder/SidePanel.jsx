import React, { useState } from 'react';
import PagesCreator from './PagesCreator';
import SectionCreator from './SectionCreator';
import { FieldSelector } from './Fields';
import { PanelHeader } from './PanelHeader';
import { classNames } from '@/utils/lib';

const SidePanel = () => {
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [isSectionsOpen, setIsSectionsOpen] = useState(false);
  const [isFieldsOpen, setIsFieldsOpen] = useState(true);

  const [tabs, setTabs] = useState([
    {
      name: 'Pages',
      content: <PagesCreator showField={true} />,
      current: true,
    },
    {
      name: 'Sections',
      content: <SectionCreator showField={true} />,
      current: false,
    },
    {
      name: 'Fields',
      content: <FieldSelector showField={true} />,
      current: false,
    },
  ]);

  const handleTabChange = (currentTab) => {
    if (currentTab !== tabs.find((x) => x.current === true).name) {
      const tabsCopy = [...tabs];
      tabsCopy.forEach((tab) => {
        if (tab.current) {
          tab.current = false;
        }
        if (tab.name === currentTab) {
          tab.current = true;
        }
      });
      setTabs(tabsCopy);
    }
  };

  const handlePanelClick = (value) => {
    switch (value) {
      case 'pages':
        setIsPagesOpen(true);
        setIsSectionsOpen(false);
        setIsFieldsOpen(false);
        break;

      case 'sections':
        setIsPagesOpen(false);
        setIsSectionsOpen(true);
        setIsFieldsOpen(false);
        break;

      case 'fields':
        setIsPagesOpen(false);
        setIsSectionsOpen(false);
        setIsFieldsOpen(true);
        break;

      default:
        break;
    }
  };

  return (
    <>
      <div className="h-full col-span-3 overflow-hidden bg-white">
        <div className="flex flex-col w-full">
          <nav
            className="flex border-b divide-x divide-gray-200 isolate"
            aria-label="Tabs"
          >
            {tabs.map((tab, tabIdx) => (
              <button
                onClick={() => handleTabChange(tab.name)}
                key={tab.name}
                className={classNames(
                  tab.current
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-700',
                  'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-1 xl:px-4 text-center text-xs xl:text-sm font-medium hover:bg-gray-50 focus:z-10 outline-none'
                )}
                aria-current={tab.current ? 'page' : undefined}
              >
                <span>{tab.name}</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    tab.current ? 'bg-indigo-500' : 'bg-transparent',
                    'absolute inset-x-0 bottom-0 h-0.5'
                  )}
                />
              </button>
            ))}
          </nav>
        </div>
        <div className="flex-1 h-full pb-40 ">
          {tabs.find((x) => x.current).content}
        </div>
      </div>
      {/* <Pages isOpen={isPagesOpen} handleClick={handlePanelClick} />
      <Sections isOpen={isSectionsOpen} handleClick={handlePanelClick} />
      <Fields isOpen={isFieldsOpen} handleClick={handlePanelClick} /> */}
    </>
  );
};

export default SidePanel;

const Pages = ({ isOpen, handleClick }) => {
  const [showField, setShowField] = useState(false);

  return (
    <div
      onClick={() => handleClick('pages')}
      className={`border-r border-slate-200 transition-width shrink-0 transition-slowest ease cursor-pointer h-[calc(100vh-180px)] lg:overflow-x-hidden lg:overflow-y-auto no-scrollbar pb-10 ${
        isOpen ? 'w-[250px]' : 'w-16 pt-5'
      }`}
    >
      <PanelHeader
        isOpen={isOpen}
        title="Pages"
        onBtnClick={() => setShowField(!showField)}
      />
      {isOpen && <PagesCreator showField={showField} />}
    </div>
  );
};

const Sections = ({ isOpen, handleClick }) => {
  const [showField, setShowField] = useState(false);

  return (
    <div
      onClick={() => handleClick('sections')}
      className={`border-r shrink-0 border-slate-200 transition-width transition-slowest ease cursor-pointer h-[calc(100vh-180px)] lg:overflow-x-hidden lg:overflow-y-auto no-scrollbar pb-10 ${
        isOpen ? 'w-[250px]' : 'w-16 pt-5'
      }`}
    >
      <PanelHeader
        isOpen={isOpen}
        title="Sections"
        onBtnClick={() => setShowField(!showField)}
      />
      {isOpen && <SectionCreator showField={showField} />}
    </div>
  );
};

const Fields = ({ isOpen, handleClick }) => {
  return (
    <div
      onClick={() => handleClick('fields')}
      className={`border-r shrink-0 border-slate-200 transition-width transition-slowest ease h-[calc(100vh-180px)] lg:overflow-x-hidden lg:overflow-y-auto no-scrollbar pb-10 ${
        isOpen ? 'w-[250px]' : 'w-20 py-5'
      }`}
    >
      <PanelHeader isOpen={isOpen} title="Fields" />
      {isOpen && <FieldSelector />}
    </div>
  );
};
