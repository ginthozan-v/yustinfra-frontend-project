import React from 'react';
import { useRouter } from 'next/router';

import DeliveryPage from '@/components/Pages/Form/Settings/DeliveryPage';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EmailTemplatePage from '@/components/Pages/Form/Settings/EmailTemplatePage';
import { FormSettingsProvider } from '@/context/FormSettingsContext';

const FormSettings = () => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <FormSettingsProvider>
      <div>
        {slug === 'delivery' ? <DeliveryPage /> : <EmailTemplatePage />}
      </div>
    </FormSettingsProvider>
  );
};

FormSettings.Title = 'Form Settings';
FormSettings.auth = true;
FormSettings.Layout = DashboardLayout;
export default FormSettings;
