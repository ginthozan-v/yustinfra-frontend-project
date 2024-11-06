import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/utils/lib';

const CheckboxDropdown = ({ label, options }) => {
  const [selected, setSelected] = useState([]);

  return (
    <Listbox value={selected} onChange={setSelected} multiple>
      {({ open }) => (
        <div className="flex flex-col items-start w-full">
          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
            {label}
          </Listbox.Label>
          <div className="relative w-full mt-2">
            <Listbox.Button className="w-full form-input border-[#E2E8F0] rounded-md placeholder:text-[#94A3B8] relative cursor-default bg-white text-left text-gray-900  focus:outline-none sm:text-sm sm:leading-6">
              <span className="block truncate">
                {selected.length > 0
                  ? selected.map((option) => option.label).join(', ')
                  : 'Select...'}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronUpDownIcon
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base text-left bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                  >
                    {({ selected, active }) => (
                      <span className="flex items-center gap-2">
                        <input
                          checked={selected}
                          type="checkbox"
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
                        />
                        {option.label}
                      </span>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      )}
    </Listbox>

    // <Listbox value={selected} onChange={setSelected} multiple>
    //   {({ open }) => (
    //     <div className="flex flex-col items-start w-full">
    //       <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
    //         {label}
    //       </Listbox.Label>
    //       <div className="relative w-full mt-2">
    //         <Listbox.Button
    //           className="w-full form-input border-[#E2E8F0] rounded-md placeholder:text-[#94A3B8]
    //         relative cursor-default bg-white text-left text-gray-900  focus:outline-none sm:text-sm sm:leading-6"
    //         >
    //           <span className="block truncate">
    //             {selected?.map((option) => option.label).join(', ') ??
    //               'Select...'}
    //           </span>
    //           <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
    //             <ChevronUpDownIcon
    //               className="w-5 h-5 text-gray-400"
    //               aria-hidden="true"
    //             />
    //           </span>
    //         </Listbox.Button>

    //         <Transition
    //           show={open}
    //           as={Fragment}
    //           leave="transition ease-in duration-100"
    //           leaveFrom="opacity-100"
    //           leaveTo="opacity-0"
    //         >
    //           <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base text-left bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
    //             {options?.map((option) => (
    //               <Listbox.Option
    //                 key={option.value}
    //                 className={({ active }) =>
    //                   classNames(
    //                     active ? 'bg-indigo-600 text-white' : 'text-gray-900',
    //                     'relative cursor-default select-none py-2 pl-3 pr-9'
    //                   )
    //                 }
    //                 value={option}
    //               >
    //                 {({ selected, active }) => (
    //                   <>
    //                     <span className="flex items-center gap-2">
    //                       <input type="checkbox" className="form-checkbox" />
    //                       <span
    //                         className={classNames(
    //                           selected ? 'font-semibold' : 'font-normal',
    //                           'block truncate'
    //                         )}
    //                       >
    //                         {option.label}
    //                       </span>
    //                     </span>
    //                   </>
    //                 )}
    //               </Listbox.Option>
    //             ))}
    //           </Listbox.Options>
    //         </Transition>
    //       </div>
    //     </div>
    //   )}
    // </Listbox>
  );
};

export default CheckboxDropdown;
