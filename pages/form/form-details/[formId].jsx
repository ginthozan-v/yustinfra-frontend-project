import Card from '@/components/Card';
import LineChart from '@/components/Charts/LineChart';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Container from '@/components/partials/Container';
import PageHeader from '@/components/partials/PageHeader';
import Tab from '@/components/Tab';
import React, { useState } from 'react';
import { tailwindConfig, hexToRGB } from '@/utils/Utils';
import { PencilIcon } from '@heroicons/react/24/outline';
import ChatIcon from '@/components/UI/icons/ChatIcon';
import { useRouter } from 'next/router';
import { MAIN_FORM_TYPE } from '@/constants/fieldType';
import { CREATE_FORM_TEMPLATE_ROUTE } from '@/constants/routes';
import { FormProvider } from '@/context/FormContext';
import FormDetails from '@/components/Pages/Form/Details';

const FormDetailsPage = () => {
  return (
    <FormProvider>
      <FormDetails />
    </FormProvider>
  );
};

FormDetailsPage.Title = 'Form';
FormDetailsPage.auth = true;
FormDetailsPage.Layout = DashboardLayout;
export default FormDetailsPage;
