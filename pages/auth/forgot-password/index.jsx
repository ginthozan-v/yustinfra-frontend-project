import { useState } from 'react';
import { Form } from 'formik';
import * as Yup from 'yup';
import api from '@/api';

import AuthLayout from '@/components/layout/AuthLayout';
import FormWrapper from '@/components/Form';
import TextInput from '@/components/UI/TextInput';
import Button from '@/components/UI/Button';
import Logo from '@/components/Logo';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { LOGIN_ROUTE } from '@/constants/routes';

const schema = {
  identifier: Yup.string()
    .email('Email address must be a valid email')
    .required('This field cannot be empty'),
};
const validationSchema = Yup.object().shape(schema);

const ForgotPassword = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const initialValues = {
    identifier: '',
  };

  const formSubmit = async (values) => {
    try {
      await api.auth.forgotPassword(values);
      setSuccess(
        'A password reset link has been sent to your email successfully!'
      );
    } catch (error) {
      console.log('🚀 error at login page >> line: 23', error);
      setError('Email is not registered');
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm px-4 py-8 mx-auto">
        <div className="mb-6">
          <Logo />
        </div>
        <p className="mb-6 text-slate-800">Reset your Password</p>
        {/* Form */}
        <FormWrapper
          initialValues={initialValues}
          validationSchema={validationSchema}
          handleSubmit={formSubmit}
        >
          {({ errors, isSubmitting }) => (
            <Form className="space-y-4">
              <TextInput
                label="Email Address"
                name="identifier"
                type="email"
                error={errors}
              />

              <div className="flex flex-col justify-between gap-3 mt-6">
                <Button
                  type="submit"
                  disable={isSubmitting}
                  isLoading={isSubmitting}
                >
                  Send Reset Link
                </Button>
                <div>
                  <Link
                    className="flex items-center gap-1 text-sm text-indigo-500 underline hover:no-underline"
                    href={LOGIN_ROUTE}
                  >
                    <ArrowLeftIcon className="w-4 h-4" /> Go back to login
                  </Link>
                </div>
              </div>
            </Form>
          )}
        </FormWrapper>

        {/* Footer */}
        {(error || success) && (
          <div
            className={`pt-5 mt-6 border-t ${
              error ? 'border-red-200' : 'border-green-200'
            }`}
          >
            <div className="mt-5">
              <div
                className={`px-3 py-2 ${
                  error ? 'text-red-600' : 'text-green-600'
                } ${error ? 'bg-red-100' : 'bg-green-100'} rounded`}
              >
                <svg
                  className="inline w-3 h-3 mr-2 fill-current shrink-0"
                  viewBox="0 0 12 12"
                >
                  <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                </svg>
                <span className="text-sm">{error || success}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
