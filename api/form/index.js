import {
  FILL_FORM,
  FORM,
  FORM_SETTINGS,
  FORM_TEMPLATE,
  LINK_SUBFORM,
  SUB_FORM,
} from '@/constants/endpoints';

export default (axios, base) => ({
  //// FORMS
  getAllForms: async (userId, query) => {
    const { data } = await axios.get(
      `${base}${FORM}/created_by/${userId}?${query}`
    );
    return data;
  },
  getAllFormsByProjectId: async (projectId, query) => {
    const { data } = await axios.get(
      `${base}${FORM}/created_by/project_id/${projectId}/form_id?${query}`
    );
    return data;
  },
  getForm: async (userId, formId) => {
    const { data } = await axios.get(
      `${base}${FORM}/created_by/${userId}/${formId}`
    );
    return data;
  },
  createForm: async (body) => {
    const { data } = await axios.post(`${base}${FORM}`, body);
    return data;
  },
  updateForm: async (body, userId, formId) => {
    const { data } = await axios.put(
      `${base}${FORM}/${userId}/${formId}`,
      body
    );
    return data;
  },
  deleteForm: async (userId, formId) => {
    const { data } = await axios.delete(`${base}${FORM}/${userId}/${formId}`);
    return data;
  },

  //// SUB FORMS
  getAllSubForms: async (userId) => {
    const { data } = await axios.get(`${base}${SUB_FORM}/created_by/${userId}`);
    return data;
  },
  getSubForm: async (userId, formId) => {
    const { data } = await axios.get(`${base}${SUB_FORM}/${formId}`);
    return data;
  },
  createSubForm: async (body) => {
    const { data } = await axios.post(`${base}${SUB_FORM}`, body);
    return data;
  },
  updateSubForm: async (body, userId, formId) => {
    const { data } = await axios.put(
      `${base}${SUB_FORM}/${userId}/${formId}`,
      body
    );
    return data;
  },
  deleteSubForm: async (userId, formId) => {
    const { data } = await axios.delete(
      `${base}${SUB_FORM}/${userId}/${formId}`
    );
    return data;
  },

  //// TEMPLATES
  getAllFormTemplates: async (userId) => {
    const { data } = await axios.get(`${base}${FORM_TEMPLATE}/${userId}`);
    return data;
  },
  getTemplate: async (userId, formId) => {
    const { data } = await axios.get(
      `${base}${FORM_TEMPLATE}/${userId}/${formId}`
    );
    return data;
  },
  createFormTemplate: async (body) => {
    const { data } = await axios.post(`${base}${FORM_TEMPLATE}`, body);
    return data;
  },
  updateFormTemplate: async (body, userId, formId) => {
    const { data } = await axios.put(
      `${base}${FORM_TEMPLATE}/${userId}/${formId}`,
      body
    );
    return data;
  },
  deleteFormTemplate: async (userId, formId) => {
    const { data } = await axios.delete(
      `${base}${FORM_TEMPLATE}/${userId}/${formId}`
    );
    return data;
  },

  // LINK SUB FORM WITH MAIN FORM
  createLink: async (body) => {
    const { data } = await axios.post(`${base}${LINK_SUBFORM}`, body);
    return data;
  },

  // SETTINGS
  saveSettings: async (body) => {
    const { data } = await axios.post(`${base}${FORM_SETTINGS}`, body);
    return data;
  },
  updateSettings: async (userId, fieldId, body) => {
    const { data } = await axios.put(
      `${base}${FORM_SETTINGS}/${userId}/${fieldId}`,
      body
    );
    return data;
  },
  getSettings: async (userId, formId) => {
    const { data } = await axios.get(
      `${base}${FORM_SETTINGS}/${userId}/${formId}`
    );
    return data.data;
  },
  getAnswers: async (userId, formId) => {
    const { data } = await axios.get(
      `${base}/forms-fields-values/created_by/${userId}/${formId}`
    );
    return data.data;
  },

  getFormSubmissions: async (formId) => {
    const { data } = await axios.get(
      `${base}${FORM}/form_submission_count/${formId}`
    );
    return data;
  },

  getFormSubmissionCountByUser: async (formId) => {
    const { data } = await axios.get(`${base}${FORM}/user_list/${formId}`);
    return data;
  },

  getAllFilledFormsByFormId: async (userId, formId) => {
    const { data } = await axios.get(
      `${base}${FILL_FORM}/created_by/${formId}`
    );
    return data;
  },

  getAllFilledFormsBySubFormId: async (projectId, subFormId) => {
    const { data } = await axios.get(
      `${base}${FILL_FORM}/by-suform-id/${projectId}/${subFormId}`
    );
    return data;
  },
  getRecentHistoryMainForm: async (formId) => {
    const { data } = await axios.get(
      `${base}${FILL_FORM}/by-form-id/${formId}`
    );
    return data;
  },
});
