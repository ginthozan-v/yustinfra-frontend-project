import DashboardLayout from '@/components/layout/DashboardLayout';
import FormTemplateBuilder from '@/components/Pages/Form/TemplateBuilder';
import FormTemplateBuilderMobile from '@/components/Pages/Form/TemplateBuilder/FormTemplateBuilderMobile';
import { FormProvider } from '@/context/FormContext';

const CreateFormTemplate = () => {
  return (
    <div className="h-full">
      {/* <FormProvider> */}
      <div className="hidden w-full h-full xl:inline-block">
        <FormTemplateBuilder />
      </div>
      <div className="h-full xl:hidden">
        <FormTemplateBuilderMobile />
      </div>
      {/* </FormProvider> */}
    </div>
  );
};

CreateFormTemplate.Title = 'Form';
CreateFormTemplate.auth = true;
CreateFormTemplate.Layout = DashboardLayout;
export default CreateFormTemplate;
