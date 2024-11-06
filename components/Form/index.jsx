import { Formik } from 'formik';

const FormWrapper = ({
  children,
  initialValues,
  validationSchema,
  handleSubmit,
}) => {
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnChange={false}
      onSubmit={(values, actions) => {
        handleSubmit(values).then(() => {
          actions.setSubmitting(false);
          actions.resetForm();
        });
      }}
    >
      {children}
    </Formik>
  );
};

export default FormWrapper;
