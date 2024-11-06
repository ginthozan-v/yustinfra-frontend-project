import { useForms } from '@/context/FormContext';
import React from 'react';
import { InputField } from './InputField';
import { Item } from './Item';

const SectionCreator = ({ showField }) => {
  const {
    sections,
    currentSection,
    currentPage,
    createSections,
    setCurrentSection,
    setOpenRightPanel,
    setFieldType,
  } = useForms();
  return (
    <>
      {showField && (
        <InputField
          placeholder="Section Name"
          onBtnClick={(e) => createSections(e)}
        />
      )}
      <div className="h-full px-2 pt-4 space-y-2 overflow-y-auto border lg:border-none no-scrollbar scroll-smooth">
        {sections
          ?.filter((x) => x.pageId === currentPage)
          ?.map((page) => (
            <Item
              key={page.id}
              id={page.id}
              name={page.name}
              currentPage={currentSection}
              onClick={() => {
                setCurrentSection(page.id);
                setOpenRightPanel(true);
                setFieldType('section');
              }}
            />
          ))}
      </div>
    </>
  );
};

export default SectionCreator;
