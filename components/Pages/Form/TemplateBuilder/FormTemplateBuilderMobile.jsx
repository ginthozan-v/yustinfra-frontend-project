import React, { useEffect, useState } from 'react';
import { classNames } from '@/utils/lib';
import PagesCreator from './PagesCreator';
import SectionCreator from './SectionCreator';
import { FieldSelector } from './Fields';
import { TemplateFields } from './TemplateFields';
import FormFieldEditor from './FormFieldEditor';
import Bottom from './Bottom';
import { useRouter } from 'next/router';
import { getAuthUser } from '@/utils/auth';
import { useForms } from '@/context/FormContext';
import Tab from '@/components/Tab';
import api from '@/api';
import ReactSelect from '@/components/UI/Select/ReactSelect';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

const FormTemplateBuilderMobile = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [templates, setTemplates] = useState([]);
  const { selectTemplate } = useForms();

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
    {
      name: 'Editor',
      content: <TemplateFields />,
      current: false,
    },
  ]);

  const router = useRouter();
  const { query } = router;
  const user = getAuthUser();

  const handleTabClick = ({ value }) => {
    setActiveTab(value);
    selectTemplate(value);
  };

  const fetchTemplate = async () => {
    try {
      const response = await api.form.getAllFormTemplates(user.id);
      const forms = response?.data?.map((form) => ({
        value: form.id,
        label: form.template_name,
      }));
      setTemplates(forms);
    } catch (error) {
      console.log('>>', error);
    }
  };

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

  useEffect(() => {
    if (query.form_type === 'main_form') {
      fetchTemplate();
    }
  }, [query]);

  return (
    <>
      <FormFieldEditor />
      <div className="h-[calc(100vh-3rem)] px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 transition-transform ease-linear rounded hover:scale-105 bg-indigo-50"
          >
            <ChevronLeftIcon className="w-4 h-4 text-indigo-700" />
          </button>
          {templates && (
            <div className="flex-1 h-full max-w-sm my-2 ">
              <ReactSelect
                field={{ name: 'sub-form' }}
                placeholder="Select template"
                options={templates}
                onSelectChange={(e) => {
                  handleTabClick(e);
                }}
              />
            </div>
          )}
        </div>

        <div>
          <nav
            className="flex border divide-x divide-gray-200 rounded-t-lg isolate"
            aria-label="Tabs"
          >
            {tabs.map((tab, tabIdx) => (
              <button
                onClick={() => handleTabChange(tab.name)}
                key={tab.name}
                className={classNames(
                  tab.current
                    ? 'text-gray-900 !bg-white'
                    : 'text-gray-500 hover:text-gray-700',
                  tabIdx === 0 ? 'rounded-tl-lg' : '',
                  tabIdx === tabs.length - 1 ? 'rounded-tr-lg' : '',
                  'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-100 '
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
        <div className="h-full overflow-hidden">
          {tabs.find((x) => x.current).content}
        </div>
      </div>
      <Bottom fetchTemplate={() => fetchTemplate()} />
    </>
  );
};

export default FormTemplateBuilderMobile;

const Tabs = (tabs, activeTab, handleTabClick) => {
  return (
    <div className="max-w-xs mb-4 overflow-x-auto xl:max-w-2xl sm:mb-0">
      <Tab tabs={tabs} activeTab={activeTab} handleTabClick={handleTabClick} />
    </div>
  );
};
