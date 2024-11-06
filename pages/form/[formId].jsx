import { useState, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/partials/PageHeader';

import Report from '@/components/Pages/Form/Report';
import Container from '@/components/partials/Container';
import Media from '@/components/Pages/Form/Media';
import FormLocation from '@/components/Pages/Form/Location';
import FormMetaData from '@/components/Pages/Form/MetaData';
import Tab from '@/components/Tab';
import useCheckMobileScreen from '@/hooks/useCheckMobileScreen';
import { useEffect } from 'react';
import api from '@/api';
import { useRouter } from 'next/router';
import Card from '@/components/Card';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { LOCATION, MULTIPLE_PHOTO_FIELD } from '@/constants/fieldType';
import { toast } from 'react-hot-toast';
import Toast from '@/components/Toast';
import EmptyState from '@/components/EmptyState';

const FormDetailPage = () => {
  const [activeTab, setActiveTab] = useState('report');
  const [answers, setAnswers] = useState([]);
  const isMobile = useCheckMobileScreen(768);
  const router = useRouter();
  const { formId, createdBy } = router.query;
  const pdfAreaRef = useRef(null);

  const buttonGroup = [
    { name: 'download', label: 'Send as email', variant: 'filled' },
    { name: 'close', label: 'Close', variant: 'outlined' },
  ];

  const tabs = [
    { id: 'report', name: 'Report' },
    { id: 'media', name: 'Media' },
    { id: 'location', name: 'Location' },
  ];

  const sendMail = async () => {
    try {
      await api.email.sendMail(createdBy, formId);
      toast.custom((t) => (
        <Toast
          t={t}
          title="Success"
          message="Email sent successfully"
          toast={toast}
        />
      ));
    } catch (error) {
      toast.custom((t) => (
        <Toast
          t={t}
          title="Error"
          message={error.response.data.message}
          toast={toast}
        />
      ));
      console.log(error);
    }
  };

  const handleBtnClick = (value) => {
    if (value === 'close') {
      router.push('/dashboard');
    }

    if (value === 'download') {
      sendMail();
    }
  };

  const fetchAnswers = async () => {
    try {
      const response = await api.form.getAnswers(createdBy, formId);
      setAnswers(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (formId && createdBy) {
      fetchAnswers();
    }
  }, [formId, createdBy]);

  return (
    <div ref={pdfAreaRef}>
      <PageHeader
        title={answers?.[0]?.form.form_name}
        buttonGroup={answers.length > 0 && buttonGroup}
        onBtnClick={handleBtnClick}
        isBack={true}
      />

      <Container>
        {answers.length === 0 ? (
          <EmptyState
            title="Nothing to show here"
            // btnTitle="New Project"
            // onBtnClick={() => onClick()}
          />
        ) : (
          <>
            <div className="lg:hidden">
              <Tab
                tabs={tabs}
                activeTab={activeTab}
                handleTabClick={setActiveTab}
              />
            </div>
            <div className="flex flex-col lg:flex-row lg:space-x-4 xl:space-x-8">
              <div
                className={`w-full ${
                  isMobile && activeTab !== 'report' ? 'hidden' : 'block'
                }`}
              >
                {answers.length > 0 && <Report answers={answers} />}
              </div>

              {/* Sidebar */}
              <div className="shrink-0 grow-0 basis-3/12">
                <div
                  className={`w-full ${
                    isMobile && activeTab !== 'media' ? 'hidden' : 'block'
                  }`}
                >
                  {answers?.find(
                    (x) => x.field_details.fieldType === MULTIPLE_PHOTO_FIELD
                  ) && (
                    <div className="mb-4">
                      <Media
                        medias={answers?.find(
                          (x) =>
                            x.field_details.fieldType === MULTIPLE_PHOTO_FIELD
                        )}
                      />
                    </div>
                  )}
                </div>

                <div
                  className={`w-full ${
                    isMobile && activeTab !== 'location' ? 'hidden' : 'block'
                  }`}
                >
                  <div className="space-y-4 shrink-0">
                    {answers?.find(
                      (x) => x.field_details.fieldType === LOCATION
                    ) && (
                      <Card>
                        <div>
                          <div className="p-5">
                            <div className="text-sm font-semibold text-[#111827]">
                              Form Location Data
                            </div>
                          </div>
                          <FormLocation
                            location={answers?.find(
                              (x) => x.field_details.fieldType === LOCATION
                            )}
                          />
                        </div>
                      </Card>
                    )}
                    <FormMetaData props={answers?.[0]} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

FormDetailPage.auth = true;
FormDetailPage.Layout = DashboardLayout;
export default FormDetailPage;
