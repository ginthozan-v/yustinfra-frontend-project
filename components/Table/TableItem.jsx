import React, { Fragment, useState } from 'react';
import Link from 'next/link';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { usePopper } from 'react-popper';
import Avatar from '../UI/Avatar/Index';

function TableItem(props) {
  const { header, row, handleRowAction } = props;
  return (
    <tr>
      {header?.map((header) => {
        const value = row[header.id];
        return (
          <td
            key={header.id}
            className="px-2 py-3 first:pl-5 last:pr-5 whitespace-nowrap z-60"
          >
            {renderCell(header, value, row, handleRowAction)}
          </td>
        );
      })}
    </tr>
  );
}

export default TableItem;

const renderCell = (header, value, row, handleRowAction) => {
  if (header.isPicture) {
    return (
      <div className="flex items-center">
        <div className="relative w-10 h-10 mr-2 shrink-0 sm:mr-3">
          <Avatar picture={row.image} size="medium" />
        </div>
        <div className="font-medium text-slate-800">{value}</div>
      </div>
    );
  }

  if (header.isAction) {
    return (
      <button className="text-right rounded-full text-slate-400 hover:text-slate-500">
        <span className="sr-only">Menu</span>
        <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="2" />
          <circle cx="10" cy="16" r="2" />
          <circle cx="22" cy="16" r="2" />
        </svg>
      </button>
    );
  }

  if (header.isDateTime) {
    return <p>{moment(value).format('DD/MM/YYYY HH:MM')}</p>;
  }

  if (header.isDate) {
    return <p>{moment(value).format('DD/MM/YYYY')}</p>;
  }

  if (header.isDropdown) {
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const [arrowElement, setArrowElement] = useState(null);
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
      placement: 'bottom-start',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 10], // adjust the offset as needed
          },
        },
        {
          name: 'arrow',
          options: {
            element: arrowElement,
          },
        },
      ],
    });

    function classNames(...classes) {
      return classes.filter(Boolean).join(' ');
    }

    return (
      <Listbox onChange={(e) => e.action(row.id)}>
        {({ open }) => (
          <>
            <div className="relative" ref={setReferenceElement}>
              <div className="inline-flex border divide-x divide-gray-200 rounded-md">
                <div className="inline-flex items-center gap-x-1.5 rounded-l-md w-24 bg-white py-2 px-3 text-gray-500">
                  <p className="text-sm font-semibold">Actions</p>
                </div>
                <Listbox.Button className="inline-flex items-center p-2 bg-white rounded-r-md hover:bg-gray-400 focus:outline-none">
                  <span className="sr-only">Change published status</span>
                  <ChevronDownIcon
                    className="w-5 h-5 text-gray-500"
                    aria-hidden="true"
                  />
                </Listbox.Button>
              </div>
              {/* <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  className="absolute left-0 p-5 mt-1 overflow-hidden origin-top-right bg-white rounded-md shadow-lg z-60"
                  ref={setPopperElement}
                  style={styles.popper}
                  {...attributes.popper}
                >
                  {header?.options?.map((option) => (
                    <Listbox.Option
                      key={option.title}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-gray-300 ' : 'text-gray-900',
                          'cursor-pointer select-none w-72 p-2 rounded text-sm list-none'
                        )
                      }
                      value={option}
                    >
                      {({ selected, active }) => (
                        <div className="flex flex-col">
                          <div className="flex justify-between">
                            <p
                              className={
                                selected ? 'font-semibold' : 'font-normal'
                              }
                            >
                              {option.title}
                            </p>
                            {selected ? (
                              <span
                                className={
                                  active ? 'text-white' : 'text-indigo-600'
                                }
                              >
                                <CheckIcon
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </div>
              </Transition> */}
              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}
              >
                <Listbox.Options className="absolute left-0 z-10 p-5 mt-1 overflow-hidden origin-top-right bg-white rounded-md shadow-lg">
                  {header?.options?.map((option) => (
                    <Listbox.Option
                      key={option.title}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-gray-300 ' : 'text-gray-900',
                          'cursor-pointer select-none w-72 p-2 rounded text-sm'
                        )
                      }
                      value={option}
                    >
                      {({ selected, active }) => (
                        <div className="flex flex-col">
                          <div className="flex justify-between">
                            <p
                              className={
                                selected ? 'font-semibold' : 'font-normal'
                              }
                            >
                              {option.title}
                            </p>
                            {selected ? (
                              <span
                                className={
                                  active ? 'text-white' : 'text-indigo-600'
                                }
                              >
                                <CheckIcon
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    );
  }

  if (header.actions) {
    return (
      <div className="space-x-5 text-right">
        {header.actions.map(({ id, name, link, Icon, handleAction }) => (
          <button
            key={id}
            className="rounded-full text-slate-400 hover:text-slate-500"
          >
            <span className="sr-only">{name}</span>
            {Icon ? (
              <button onClick={() => handleAction(row.id)}>
                <Icon className="w-5 h-5" />
              </button>
            ) : (
              <Link href={row.link} className="text-indigo-600">
                {name} {'->'}
              </Link>
            )}
          </button>
        ))}
      </div>
    );
  }

  if (header.isStatus) {
    return StatusLabel(value);
  }

  return <span>{value}</span>;
};

const StatusLabel = (value) => {
  const statusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-600';
      case 'Refunded':
        return 'bg-amber-100 text-amber-600';
      default:
        return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div
      className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${statusColor(
        value
      )}`}
    >
      {value}
    </div>
  );
};
