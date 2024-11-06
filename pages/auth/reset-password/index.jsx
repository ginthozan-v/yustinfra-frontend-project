import AuthLayout from '@/components/layout/AuthLayout';
import FormWrapper from '@/components/Form';
import * as Yup from 'yup';
import api from '@/api';
import { useState } from 'react';
import { Form } from 'formik';
import TextInput from '@/components/UI/TextInput';
import Button from '@/components/UI/Button';
import Logo from '@/components/Logo';
import { useRouter } from 'next/router';
import { LOGIN_ROUTE } from '@/constants/routes';

const schema = {
  password: Yup.string().required('This field cannot be empty'),
};
const validationSchema = Yup.object().shape(schema);

const ForgotPassword = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const { query } = useRouter();

  const initialValues = {
    password: '',
  };

  const formSubmit = async (values) => {
    try {
      const body = {
        id: query.userId,
        hash: query.hash,
        password: values.password,
      };
      await api.auth.resetPassword(body);
      await api.auth.confirmUser({
        confirmed : true,
        userId: query.userId,
      });
      router.push(LOGIN_ROUTE);
    } catch (error) {
      console.log('🚀 error at login page >> line: 23', error);
      setError('Something went wrong!');
    }
  };

  return (
    <AuthLayout>
      {' '}
      <div className="w-full max-w-sm px-4 py-8 mx-auto">
        <div className="mb-6">
          <Logo />
        </div>
        <p className="mb-6 text-slate-800">Set new password</p>
        {/* Form */}
        <FormWrapper
          initialValues={initialValues}
          validationSchema={validationSchema}
          handleSubmit={formSubmit}
        >
          {({ errors, isSubmitting }) => (
            <Form className="space-y-4">
              <TextInput
                label="Password"
                name="password"
                type="password"
                error={errors}
              />

              <div className="flex flex-col justify-between gap-6 mt-6">
                <Button
                  type="submit"
                  disable={isSubmitting}
                  isLoading={isSubmitting}
                >
                  Set password
                </Button>
              </div>
            </Form>
          )}
        </FormWrapper>

        {/* Footer */}
        {error && (
          <div className="pt-5 mt-6 border-t border-red-200">
            <div className="mt-5">
              <div className="px-3 py-2 text-red-600 bg-red-100 rounded">
                <svg
                  className="inline w-3 h-3 mr-2 fill-current shrink-0"
                  viewBox="0 0 12 12"
                >
                  <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
