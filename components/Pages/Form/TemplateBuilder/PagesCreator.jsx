import React from 'react';
import { useForms } from '@/context/FormContext';
import { InputField } from './InputField';
import { Item } from './Item';
import * as Yup from 'yup';

const PagesCreator = ({ showField }) => {
  const {
    pages,
    currentPage,
    createPages,
    setCurrentPage,
    setOpenRightPanel,
    setFieldType,
    sections,
    setCurrentSection,
    setFieldSchema,
  } = useForms();

  return (
    <>
      {showField && (
        <InputField
          placeholder="Page Name"
          onBtnClick={(e) => createPages(e)}
        />
      )}
      <div className="h-full pb-[300px] px-2 pt-4 space-y-2 overflow-y-auto border lg:border-none no-scrollbar scroll-smooth">
        {pages?.map((page) => (
          <Item
            key={page.id}
            id={page.id}
            name={page.name}
            currentPage={currentPage}
            onClick={() => {
              setCurrentPage(page.id);
              setCurrentSection(sections.find((x) => x.pageId === page.id).id);
              setOpenRightPanel(true);
              setFieldType('page');
              setFieldSchema(
                Yup.object().shape({
                  name: Yup.string().required('Required'),
                })
              );
            }}
          />
        ))}
      </div>
    </>
  );
};

export default PagesCreator;
