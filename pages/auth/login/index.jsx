import { useState } from "react";
import Link from "next/link";
import { Form } from "formik";
import * as Yup from "yup";

import api from "@/api";
import { DASHBOARD_ROUTE, FORGOT_PASSWORD_ROUTE } from "@/constants/routes";

import AuthLayout from "@/components/layout/AuthLayout";
import FormWrapper from "@/components/Form";
import TextInput from "@/components/UI/TextInput";
import Button from "@/components/UI/Button";
import Logo from "@/components/Logo";
import { setAuth } from "@/utils/auth";
import { useRouter } from "next/router";

const schema = {
  email: Yup.string().email().required("This field cannot be empty"),
  password: Yup.string().required("This field cannot be empty"),
};
const validationSchema = Yup.object().shape(schema);

const initialValues = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  const formSubmit = async (values) => {
    try {
      const body = {
        identifier: values.email,
        password: values.password,
      };
      const response = await api.auth.login(body);
      const userRes = await api.user.getUser(response.user.id);

      response.user["profile_picture"] = userRes?.profile_picture
        ? userRes?.profile_picture?.formats
          ? process.env.NEXT_PUBLIC_STRAPI_API_URL +
            userRes?.profile_picture?.formats?.small?.url
          : process.env.NEXT_PUBLIC_STRAPI_API_URL +
            userRes?.profile_picture?.url
        : null;
      response.user["role"] = userRes?.user_role?.user_role_name;

      if (response.user["role"] == "Collector") {
        setError("You are not allowed to access this page");
        return;
      }

      setAuth(response);
      router.push(DASHBOARD_ROUTE);
    } catch (error) {
      console.log("🚀 error at login page >> line: 48", error);
      setError(error?.response?.data?.error?.message);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm px-4 py-8 mx-auto">
        <div className="mb-6">
          <Logo />
        </div>
        <p className="hidden mb-6 md:block text-slate-800">Login to continue</p>
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
                name="email"
                type="email"
                error={errors}
              />

              <TextInput
                label="Password"
                name="password"
                type="password"
                error={errors}
              />

              <div className="flex flex-col justify-between gap-6 mt-6">
                <div>
                  <Link
                    className="text-sm text-indigo-500 underline hover:no-underline"
                    href={FORGOT_PASSWORD_ROUTE}
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  disable={isSubmitting}
                  isLoading={isSubmitting}
                >
                  Continue
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

export default LoginPage;
