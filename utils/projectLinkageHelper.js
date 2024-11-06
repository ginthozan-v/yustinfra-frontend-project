export const getUsers = (values) => {
  return [
    ...new Map(
      values?.up_user !== null &&
        values?.map((item) => [item?.up_user?.id, item?.up_user])
    ).values(),
  ];
};

export const getForms = (values) => {
  return [
    ...new Map(
      values?.form !== null &&
        values?.map((item) => [item?.form?.id, item?.form])
    ).values(),
  ];
};

export const linkUserForm = (values) => {
  const bulk = [];
  values?.form.map((form) => {
    values?.user.map((user) => {
      bulk.push({
        user_id: user.value,
        form_id: form.value,
        user_group_id: user.user_group_id,
      });
    });
  });
  return bulk;
};
