import FormWrapper from '@/components/Form';
import RightPanel from '@/components/RightPanel';
import Button from '@/components/UI/Button';

import Container from '@/components/partials/Container';
import PageHeader from '@/components/partials/PageHeader';
import { FORM_ROUTE, FORM_SETTINGS_ROUTE } from '@/constants/routes';
import { useFormSettings } from '@/context/FormSettingsContext';
import { getAuthUser } from '@/utils/auth';

import { Form } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';

import React from 'react';
import { FieldsRender } from './FieldsRender';

const DeliveryPage = () => {
  const { settings, deliverySettingsData, settingsValidation } =
    useFormSettings();
  const user = getAuthUser();
  const router = useRouter();
  const { query } = router;

  return (
    <>
      <div className="h-[calc(100vh-7.1rem)]">
        <PageHeader title="Delivery" isBack={true} />
        <Container>
          <div className="h-full max-w-sm">
            <FormWrapper initialValues={deliverySettingsData}>
              {({ values, setFieldValue }) => (
                <Form className="flex flex-col justify-between h-full ">
                  <div className="space-y-4">
                    {settings
                      .slice(0, 3)
                      .map((props) =>
                        FieldsRender(
                          { ...props },
                          user.id,
                          query.formId,
                          setFieldValue
                        )
                      )}
                  </div>

                  {settingsValidation && (
                    <div className="p-2 mb-2 border border-red-500">
                      <p className="text-red-500">{settingsValidation}</p>
                    </div>
                  )}

                  <RightPanel rightPanelOpen={true}>
                    <div className="z-10 pb-10 mt-10">
                      <div className="space-y-4">
                        <h2 className="mb-6 text-2xl font-bold text-slate-800">
                          Email Submitter
                        </h2>

                        {settings
                          .slice(3, 8)
                          .map((props) =>
                            FieldsRender(
                              { ...props },
                              user.id,
                              query.formId,
                              setFieldValue,
                              values
                            )
                          )}
                      </div>
                    </div>
                  </RightPanel>
                </Form>
              )}
            </FormWrapper>
          </div>
        </Container>
      </div>

      <div className="fixed bottom-0 z-50 w-full bg-white border-t lg:relative">
        <div className="flex flex-wrap items-center justify-center gap-2 px-8 py-3 md:justify-end">
          <Link href={`${FORM_ROUTE}`}>
            <Button variant="outlined">Cancel</Button>
          </Link>
          <Link
            href={`${FORM_SETTINGS_ROUTE}/email-template?form_type=${query.form_type}&formId=${router.query.formId}`}
          >
            <Button variant="filled" disable={settingsValidation}>
              Next
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default DeliveryPage;
