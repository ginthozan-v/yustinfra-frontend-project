import { TrashIcon } from '@heroicons/react/24/outline';
import { FieldArray } from 'formik';
import React from 'react';
import Button from '../Button';
import TextInput from '../TextInput';

const ArrayFields = ({ values }) => {
  return (
    <FieldArray name="options">
      {({ push, remove }) => (
        <div>
          {/* Render your array list items */}
          {values?.options?.map((item, index) => (
            <div key={index} className="flex items-center mt-1">
              <div className="relative flex items-stretch flex-grow focus-within:z-10">
                <TextInput name={`options.${index}`} type="text" />
              </div>
              <button
                type="button"
                className="relative -ml-2 rounded-r-md text-sm border border-[#E2E8F0] bg-white hover:bg-gray-50  py-2.5 px-2"
                onClick={(e) => {
                  e.preventDefault();
                  remove(index);
                }}
              >
                <TrashIcon
                  className="-ml-0.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </button>
            </div>
          ))}

          {/* Button to add a new item */}
          <div className="mt-2">
            <Button fullWidth onBtnClick={() => push('')}>
              Add Item
            </Button>
          </div>
        </div>
      )}
    </FieldArray>
  );
};

export default ArrayFields;
