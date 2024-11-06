import { useEffect, useState } from 'react';
import { useForms } from '@/context/FormContext';
import Header from './Header';
import Bottom from './Bottom';
import SidePanel from './SidePanel';

import FormFieldEditor from './FormFieldEditor';

import { useRouter } from 'next/router';
import { getAuthUser } from '@/utils/auth';
import api from '@/api';
import Preview from './Preview';

import { TemplateFields } from './TemplateFields';

const buttonGroup = [
  { name: 'add', label: 'Create Template', icon: 'ADD', variant: 'filled' },
];

const FormTemplateBuilder = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [templates, setTemplates] = useState([]);
  const { selectTemplate } = useForms();

  const { query } = useRouter();
  const user = getAuthUser();

  const handleTabClick = (value) => {
    setActiveTab(value);
    selectTemplate(value);
  };

  const fetchTemplate = async () => {
    try {
      const response = await api.form.getAllFormTemplates(user.id);
      const forms = response?.data?.map((form) => ({
        id: form.id,
        name: form.template_name,
      }));

      setTemplates(forms);
    } catch (error) {
      console.log('>>', error);
    }
  };

  useEffect(() => {
    if (query.form_type === 'main_form') {
      fetchTemplate();
    }
  }, [query]);

  return (
    <div>
      <Preview />
      <Header
        tabs={templates}
        activeTab={activeTab}
        handleTabClick={handleTabClick}
        buttonGroup={buttonGroup}
        isBack={true}
      />
      <div className="h-[calc(100vh-6rem)] grid grid-cols-12 items-start">
        <SidePanel />
        <TemplateFields />
        <FormFieldEditor />
      </div>

      <Bottom fetchTemplate={() => fetchTemplate()} />
    </div>
  );
};

export default FormTemplateBuilder;
