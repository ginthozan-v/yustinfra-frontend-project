import FormWrapper from '@/components/Form';
import Button from '@/components/UI/Button';
import ColorPicker from '@/components/UI/ColorPicker';
import Switch from '@/components/UI/Switch';
import TextArea from '@/components/UI/TextArea';
import Container from '@/components/partials/Container';
import PageHeader from '@/components/partials/PageHeader';
import { FORM_ROUTE, FORM_SETTINGS_ROUTE } from '@/constants/routes';
import { useFormSettings } from '@/context/FormSettingsContext';
import { Form } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import FilePicker from '@/components/UI/FilePicker/DropZone';
import { FieldsRender } from './FieldsRender';
import { getAuthUser } from '@/utils/auth';

const EmailTemplatePage = () => {
  const { settings, templateSettingsData, isLoading } = useFormSettings();

  const user = getAuthUser();
  const router = useRouter();
  const { query } = router;

  return (
    <>
      <div className="h-[calc(100vh-8rem)]">
        <PageHeader
          title="Header & Footer settings of the forms"
          isBack={true}
        />
        <Container>
          <div className="max-w-sm pb-20">
            <FormWrapper initialValues={templateSettingsData}>
              {({ setFieldValue }) => (
                <Form className="space-y-4 ">
                  {settings
                    .slice(8, 13)
                    .map((props) =>
                      FieldsRender(
                        { ...props },
                        user.id,
                        query.formId,
                        setFieldValue
                      )
                    )}
                </Form>
              )}
            </FormWrapper>
          </div>
        </Container>
      </div>
      <div className="fixed bottom-0 z-50 w-full bg-white border-t lg:relative">
        <div className="flex flex-wrap items-center justify-center gap-2 px-8 py-3 md:justify-end">
          <Link
            href={`${FORM_SETTINGS_ROUTE}/delivery?form_type=${query.form_type}&formId=${router.query.formId}`}
          >
            <Button variant="outlined">Back</Button>
          </Link>
          <Link href={`${FORM_ROUTE}`}>
            <Button isLoading={isLoading} variant="filled">
              Save & Close
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default EmailTemplatePage;
