import Tab from '@/components/Tab';
import Button from '@/components/UI/Button';
import DateRangePicker from '@/components/UI/DateRangePicker';
import DropdownFilter from '@/components/UI/DropdownFilter';
import SearchForm from '@/components/UI/SearchForm';
import { CREATE_FORM_TEMPLATE_ROUTE } from '@/constants/routes';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const PageHeader = ({
  title,
  tabs,
  activeTab,
  handleTabClick,
  formDetails,
  isFilter,
  isDatePicker,
  isSearch,
  buttonGroup,
  onBtnClick,
  activeState,
  onDateChange,
  search,
  isBack,
}) => {
  const router = useRouter();

  const query = router.query;

  return (
    <>
      <Head>
        <title>
          YustInfra
          {/* {title && `- ${title}`} */}
        </title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/assets/brand/KSC.png" /> */}
      </Head>
      <div className="sticky top-0 z-40 bg-white shadow">
        <div className="flex flex-wrap items-center justify-between w-full px-5 mx-auto -mb-px md:px-8">
          {isBack && (
            <button
              onClick={() =>
                router.push(
                  `${CREATE_FORM_TEMPLATE_ROUTE}/?form_type=${query.form_type}&formId=${query.formId}`
                )
              }
              className="flex items-center justify-center w-6 h-6 my-3 mr-8 transition-transform ease-linear rounded hover:scale-105 bg-indigo-50"
            >
              <ChevronLeftIcon className="w-4 h-4 text-indigo-700" />
            </button>
          )}

          {formDetails && FormDetails(formDetails)}
          <div className="flex-1 pr-5 mt-auto">
            {tabs && Tabs(tabs, activeTab, handleTabClick)}{' '}
          </div>
          {!tabs && <div className="py-4" />}
          {/* Right: Actions */}
          <div className="grid justify-start grid-flow-col gap-2 py-1 sm:auto-cols-max sm:justify-end">
            {isFilter && <DropdownFilter align="left" />}
            {isDatePicker && (
              <DateRangePicker align="right" onDateChange={onDateChange} />
            )}
            {isSearch && (
              <SearchForm placeholder="Search ..." onSearch={search} />
            )}

            {/* Add view button */}
            {buttonGroup &&
              buttonGroup?.map((btn) => (
                <Button
                  key={btn.name}
                  onBtnClick={() => onBtnClick(btn.name)}
                  variant={btn.variant}
                >
                  {btn.icon && renderBtnIcon(btn.icon)}
                  <span className={`${btn.icon && 'ml-2 hidden xs:block'}`}>
                    {btn.label}
                  </span>
                </Button>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PageHeader;

const renderBtnIcon = (icon) => {
  switch (icon) {
    case 'ADD':
      return (
        <svg
          className="w-4 h-4 opacity-50 fill-current shrink-0"
          viewBox="0 0 16 16"
        >
          <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
        </svg>
      );
    default:
      break;
  }
};

const FormDetails = (values) => {
  return (
    <div className="mb-4 sm:mb-0">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="flex items-center text-sm font-semibold h-11 md:text-base text-slate-800">
          {values.name}
        </h1>

        <div className="px-4 text-xs rounded-full shrink-0 sm:text-sm bg-slate-100 text-slate-500">
          Form ID: {values.formId}
        </div>

        <div className="px-4 text-sm rounded-full shrink-0 bg-slate-100 text-slate-500">
          Version: {values.version}
        </div>
      </div>
    </div>
  );
};

const Tabs = (tabs, activeTab, handleTabClick) => {
  return (
    <div className="py-4 mt-auto md:py-0">
      <Tab tabs={tabs} activeTab={activeTab} handleTabClick={handleTabClick} />
    </div>
  );
};
