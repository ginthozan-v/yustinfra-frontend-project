import Card from '@/components/Card';
import ChatIcon from '@/components/UI/icons/ChatIcon';
import Container from '@/components/partials/Container';
import PageHeader from '@/components/partials/PageHeader';
import { CREATE_FORM_TEMPLATE_ROUTE } from '@/constants/routes';
import { useForms } from '@/context/FormContext';
import { PencilIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';

import React, { useEffect, useState } from 'react';
import TotalSubmissionCount from '../../Dashboard/TotalSubmissionCount';
import api from '@/api';
import Link from 'next/link';
import { FORM } from '@/constants/endpoints';
import { getAuthUser } from '@/utils/auth';
import { MAIN_FORM_TYPE, SUB_FORM_TYPE } from '@/constants/fieldType';
import moment from 'moment';

const FormDetails = () => {
  const { formTitle, formVersion, formFields } = useForms();
  const [submissionCountUsers, setSubmissionCountUsers] = useState([]);
  const [subForms, setSubForms] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);

  const user = getAuthUser();
  const router = useRouter();
  const { query } = router;

  const buttonGroup = [
    {
      name: 'edit',
      label: 'Edit Form',
      variant: 'filled',
    },
  ];

  const handleBtnClick = (value) => {
    if (value === 'edit') {
      router
        .push({
          pathname: CREATE_FORM_TEMPLATE_ROUTE,
          query: { form_type: query.form_type, formId: query.formId },
        })
        .catch((e) => console.log(e));
    }
  };

  const fetchSubmissionCountUser = async () => {
    try {
      const res = await api.form.getFormSubmissionCountByUser(query.formId);
      const users = res.detail?.slice(0, 5).map((user) => ({
        username: user.username,
        count: user.count,
      }));

      setSubmissionCountUsers(users);
    } catch (error) {
      console.log('error >>', error);
    }
  };

  const fetchFormSubmission = async () => {
    try {
      let response;

      if (query.form_type === MAIN_FORM_TYPE) {
        response = await api.form.getAllFilledFormsByFormId(
          user.id,
          query.formId
        );
      } else if (query.form_type === SUB_FORM_TYPE) {
        response = await api.form.getAllFilledFormsBySubFormId(
          user.id,
          query.formId
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRecentHistory = async () => {
    try {
      const response = await api.form.getRecentHistoryMainForm(query.formId);

      const latestDataMap = new Map();

      for (const item of response.detail) {
        if (
          !latestDataMap.has(item['up_user.id']) ||
          item.updated_at > latestDataMap.get(item['up_user.id']).updated_at
        ) {
          latestDataMap.set(item['up_user.id'], item);
        }
      }

      const sortedData = Array.from(latestDataMap.values()).sort(
        (a, b) => a.id - b.id
      );

      const data = sortedData.map((data) => ({
        id: data['up_user.id'],
        name: data['up_user.first_name'] + ' ' + data['up_user.last_name'],
        date: data['updated_at'],
        formVersion: data['form.version'],
      }));

      setRecentHistory(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSubmissionCountUser();
    fetchFormSubmission();
    fetchRecentHistory();
  }, [query]);

  useEffect(() => {
    const subForms = formFields.flatMap((item) =>
      item.fields.filter((field) => field.type === 'sub-form')
    );

    setSubForms(subForms);
  }, [formFields]);

  return (
    <div>
      <PageHeader
        formDetails={{
          name: formTitle,
          formId: query.formId,
          version: formVersion,
        }}
        buttonGroup={buttonGroup}
        onBtnClick={handleBtnClick}
        isBack={true}
      />
      <Container>
        <div className="grid grid-cols-1 gap-5 2xl:gap-10 md:grid-cols-2">
          <TotalSubmissionCount title="Submission Count" />
          <SubmissionCountByUser users={submissionCountUsers} />
          <RecentHistory
            title="Recent history (last 30 days)"
            forms={recentHistory}
          />
          <AttachedComponents data={subForms} />
        </div>
      </Container>
    </div>
  );
};

export default FormDetails;

const SubmissionCountByUser = ({ users }) => {
  return (
    <Card>
      <div>
        <header className="flex justify-between p-4 border-b border-slate-100">
          <h2 className="font-medium text-[#1E293B]">
            Submission Count by User (last 30 days)
          </h2>
        </header>
        <div className="p-5">
          <div>
            <header className="flex justify-between p-2 text-xs uppercase rounded-sm text-slate-400 bg-slate-50">
              <span>Username</span>
              <span>Amount</span>
            </header>
            <ul className="my-1">
              {users.map((data, i) => (
                <li key={i} className="flex px-2">
                  <div className="flex items-center py-2 text-sm border-b grow border-slate-100">
                    <div className="flex justify-between grow">
                      <div className="self-center">
                        <a
                          className="font-medium text-[#1E293B] hover:text-slate-900"
                          href="#0"
                        >
                          {data.username}
                        </a>
                      </div>
                      <div className="self-center">
                        <a
                          className="font-medium text-[#1E293B] hover:text-slate-900"
                          href="#0"
                        >
                          {data.count}
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

const RecentHistory = ({ title, forms }) => {
  return (
    <Card>
      <div>
        <header className="flex justify-between p-5 pb-0 border-b border-slate-100">
          <h2 className="font-medium text-[#1E293B]">{title}</h2>
        </header>
        <div className="p-5">
          {/* "Today" group */}
          <div>
            {/* <header className="p-2 text-xs font-semibold uppercase rounded-sm text-slate-400 bg-slate-50">
              Today
            </header> */}

            <ul className="my-1">
              {forms.map((data) => (
                <li key={data.id} className="flex px-2">
                  <div className="my-2 mr-3 bg-indigo-500 rounded-full w-9 h-9 shrink-0">
                    <ChatIcon />
                  </div>
                  <div className="flex items-center py-2 text-sm border-b grow border-slate-100">
                    <div className="flex justify-between grow">
                      <div className="self-center text-slate-600">
                        {moment(data.date).format('DD/MM/YYYY')} at{' '}
                        {moment(data.date).format('HH:MM')} - Version{' '}
                        {data.formVersion?.substring(1)} by{' '}
                        <span className="font-semibold text-slate-800 hover:text-slate-900">
                          {data.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* "Yesterday" group */}
          {/* <div>
            <header className="p-2 text-xs font-semibold uppercase rounded-sm text-slate-400 bg-slate-50">
              Yesterday
            </header>
            <ul className="my-1">
              <li className="flex px-2">
                <div className="my-2 mr-3 bg-indigo-500 rounded-full w-9 h-9 shrink-0">
                  <ChatIcon />
                </div>
                <div className="flex items-center py-2 text-sm border-b grow border-slate-100">
                  <div className="flex justify-between grow">
                    <div className="self-center text-slate-600">
                      08/01/2023 at 14:24 - Version 15 by{' '}
                      <span className="font-semibold text-slate-800 hover:text-slate-900">
                        Serdal Guzel
                      </span>
                    </div>
                  </div>
                </div>
              </li>
              <li className="flex px-2">
                <div className="my-2 mr-3 bg-indigo-500 rounded-full w-9 h-9 shrink-0">
                  <ChatIcon />
                </div>
                <div className="flex items-center py-2 text-sm border-b grow border-slate-100">
                  <div className="flex justify-between grow">
                    <div className="self-center text-slate-600">
                      08/01/2023 at 14:24 - Version 15 by{' '}
                      <span className="font-semibold text-slate-800 hover:text-slate-900">
                        Serdal Guzel
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
    </Card>
  );
};

const AttachedComponents = ({ data }) => {
  return (
    <Card>
      <div>
        <header className="flex justify-between p-5 pb-0 border-b border-slate-100">
          <h2 className="font-medium text-[#1E293B]">Attached components</h2>
        </header>
        <div className="p-5">
          <div>
            <ul className="my-1">
              {data.map((data) => (
                <li key={data.id} className="flex px-2">
                  <div className="flex items-center py-2 text-sm border-b grow border-slate-100">
                    <div className="flex justify-between grow">
                      <div className="self-center">
                        <a
                          className="font-medium text-[#1E293B] hover:text-slate-900"
                          href="#0"
                        >
                          {data.label}
                        </a>
                      </div>
                      <Link
                        href={`${FORM}/create-form-template?form_type=sub_form&formId=${data?.value}`}
                        className="self-center"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </li>
              ))}

              {data.length === 0 && <p className="px-2 py-2">No data found</p>}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};
