import api from '@/api';
import AlertBox from '@/components/AlertBox';
import FormWrapper from '@/components/Form';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Modal from '@/components/Modal';
import SettingsWrapper from '@/components/Pages/Account/SettingsWrapper';
import Container from '@/components/partials/Container';
import PageHeader from '@/components/partials/PageHeader';
import Toast from '@/components/Toast';
import Avatar from '@/components/UI/Avatar/Index';
import Button from '@/components/UI/Button';
import TextInput from '@/components/UI/TextInput';
import { getAuthUser, setAuth } from '@/utils/auth';
import { Form } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';

const MyCompany = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadPicture, setUploadPicture] = useState(null);

  const [initialValues, setInitialValues] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    business_name: '',
    location: '',
    email: '',
  });
  const user = getAuthUser();

  const fetchUserDetails = async () => {
    try {
      const response = await api.user.getUser(user.id);
      setInitialValues({
        first_name: response.first_name,
        last_name: response.last_name,
        phone_number: response.phone_number,
        business_name: response.business_name,
        location: response.location,
        email: response.email,
      });
      setProfilePicture(
        response.profile_picture.formats
          ? process.env.NEXT_PUBLIC_STRAPI_API_URL +
              response.profile_picture.formats.small.url
          : process.env.NEXT_PUBLIC_STRAPI_API_URL +
              response.profile_picture.url
      );
    } catch (error) {
      console.log(error);
    }
  };

  const formSubmit = async (values) => {
    try {
      Object.keys(values).forEach((key) => {
        if (values[key] === '') {
          delete values[key];
        }
      });

      if (uploadPicture) {
        const formData = new FormData();
        formData.append('files', uploadPicture);

        const res = await api.file.uploadFile(formData);
        values['profile_picture'] = res[0].id;
      }

      await api.user.updateUser(values, user.id);
      toast.custom((t) => (
        <Toast
          t={t}
          title="Success"
          message={`Details updated successfully!`}
          toast={toast}
        />
      ));
      await fetchUserDetails();
    } catch (error) {
      toast.custom((t) => (
        <Toast
          t={t}
          title="Error"
          message={`Something went wrong, please try again later!`}
          toast={toast}
        />
      ));
      console.log(error);
    }
  };

  const changeProfilePicture = (e) => {
    const files = e.target.files;
    const img = URL.createObjectURL(files[0]);
    setProfilePicture(img);
    setUploadPicture(files[0]);
  };

  useEffect(() => {
    if (user) {
      fetchUserDetails();
    }
  }, []);

  return (
    <>
      <PageHeader title="Settings" />
      <ChangePasswordModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <Container>
        <SettingsWrapper>
          <FormWrapper initialValues={initialValues} handleSubmit={formSubmit}>
            {({ errors, isSubmitting }) => (
              <Form className="grow h-fit">
                {/* Panel body */}
                <div className="p-6 space-y-6">
                  <h2 className="mb-5 text-2xl font-bold text-slate-800">
                    My Profile
                  </h2>
                  {/* Picture */}
                  <section>
                    <div className="flex items-center">
                      <div className="mr-4">
                        <Avatar picture={profilePicture} size="large" />
                      </div>
                      <label
                        htmlFor="file-upload"
                        className="text-white bg-indigo-500 btn-sm hover:bg-indigo-600"
                      >
                        Change
                      </label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => changeProfilePicture(e)}
                      />
                    </div>
                  </section>
                  {/* Business Profile */}
                  <section>
                    <h2 className="mb-1 text-xl font-bold leading-snug text-slate-800">
                      Company Profile
                    </h2>
                    <div className="text-sm">
                      Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit.
                    </div>
                    <div className="mt-5 space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-4">
                      <div className="sm:w-1/3">
                        <TextInput
                          label="First Name"
                          name="first_name"
                          type="text"
                          error={errors}
                        />
                      </div>
                      <div className="sm:w-1/3">
                        <TextInput
                          label="Last Name"
                          name="last_name"
                          type="text"
                          error={errors}
                        />
                      </div>
                      <div className="sm:w-1/4">
                        <TextInput
                          label="Phone"
                          name="phone_number"
                          type="text"
                          error={errors}
                        />
                      </div>
                    </div>
                    <div className="mt-5 space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-4">
                      <div className="sm:w-1/3">
                        <TextInput
                          label="Business Name"
                          name="business_name"
                          type="text"
                          error={errors}
                        />
                      </div>
                      <div className="sm:w-1/3">
                        <TextInput
                          label="Location"
                          name="location"
                          type="text"
                          error={errors}
                        />
                      </div>
                    </div>
                    
                  </section>
                  {/* Email */}
                  <section>
                    <h2 className="mb-1 text-xl font-bold leading-snug text-slate-800">
                      Email
                    </h2>
                    <div className="text-sm">
                      Excepteur sint occaecat cupidatat non proident sunt in
                      culpa qui officia.
                    </div>
                    <div className="flex flex-wrap items-center mt-5">
                      <div className="mr-2">
                        <TextInput
                          // label="Email"
                          name="email"
                          type="email"
                          error={errors}
                        />
                      </div>
                      {/* <button className="text-indigo-500 shadow-sm btn border-slate-200 hover:border-slate-300">
                        Change
                      </button> */}
                    </div>
                  </section>
                  {/* Password */}
                  <section>
                    <h2 className="mb-1 text-xl font-bold leading-snug text-slate-800">
                      Password
                    </h2>
                    <div className="text-sm">
                      You can set a permanent password if you don't want to use
                      temporary login codes.
                    </div>
                    <div className="mt-5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsModalOpen(true);
                        }}
                        className="text-indigo-500 shadow-sm btn border-slate-200"
                      >
                        Set New Password
                      </button>
                    </div>
                  </section>
                </div>
                {/* Panel footer */}
                <footer>
                  <div className="flex flex-col px-6 py-5 border-t border-slate-200">
                    <div className="flex self-end gap-2">
                      <Button
                        variant="outlined"
                        onBtnClick={() => fetchUserDetails()}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disable={isSubmitting}
                        isLoading={isSubmitting}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </footer>
              </Form>
            )}
          </FormWrapper>
        </SettingsWrapper>
      </Container>
    </>
  );
};

MyCompany.Title = 'Settings';
MyCompany.auth = true;
MyCompany.Layout = DashboardLayout;
export default MyCompany;

const ChangePasswordModal = ({ isModalOpen, setIsModalOpen }) => {
  const [error, setError] = useState('');
  const initialValues = {
    currentPassword: '',
    password: '',
    passwordConfirmation: '',
  };
  const schema = {
    currentPassword: Yup.string().required('This field cannot be empty'),
    password: Yup.string()
      .min(8, 'Password must be 8 characters long')
      .matches(/[0-9]/, 'Password requires a number')
      .matches(/[a-z]/, 'Password requires a lowercase letter')
      .matches(/[A-Z]/, 'Password requires an uppercase letter')
      .matches(/[^\w]/, 'Password requires a symbol')
      .required('This field cannot be empty'),
    passwordConfirmation: Yup.string().oneOf(
      [Yup.ref('password'), null],
      'Must match "New Password" field value'
    ),
  };
  const validationSchema = Yup.object().shape(schema);

  const formSubmit = async (values) => {
    try {
      const res = await api.auth.changePassword(values);
      setAuth(res);
      setIsModalOpen(false);
    } catch (error) {
      console.log('>>', error.response.data.error.message);
      setError(error?.response?.data?.error?.message);
    }
  };

  return (
    <Modal
      id="change-password"
      modalOpen={isModalOpen}
      setModalOpen={setIsModalOpen}
      title="Change Password"
    >
      <FormWrapper
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleSubmit={formSubmit}
      >
        {({ errors, isSubmitting }) => (
          <Form>
            {/* Modal content */}
            <div className="px-5 pt-6 pb-1 space-y-4 text-left">
              <TextInput
                label="Current password"
                name="currentPassword"
                type="password"
                error={errors}
              />
              <TextInput
                label="New Password"
                name="password"
                type="password"
                error={errors}
              />
              <TextInput
                label="Confirm password"
                name="passwordConfirmation"
                type="password"
                error={errors}
              />
            </div>
            {/* Modal footer */}
            {error && (
              <div className="px-5 mt-5">
                <AlertBox type="error" message={error} />
              </div>
            )}
            <div className="px-5 py-4">
              <div className="flex flex-wrap justify-end space-x-2">
                <Button
                  variant="outlined"
                  onBtnClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(false);
                  }}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  disable={isSubmitting}
                  isLoading={isSubmitting}
                >
                  Submit
                </Button>
              </div>
            </div>
          </Form>
        )}
      </FormWrapper>
    </Modal>
  );
};
