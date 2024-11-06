import { PROJECTS, FORM, PROJECTS_CARDS } from "@/constants/endpoints";

export default (axios, base) => ({
  getAllProjects: async () => {
    const { data } = await axios.get(`${base}${PROJECTS}`);
    return data;
  },

  getAllUserProjects: async (userId, keyword) => {
    const { data } = await axios.get(
      `${base}${PROJECTS}/created_by/${userId}?name=${
        keyword ?? ""
      }&order_by=created_at&order_type=DESC`
    );
    return data;
  },
  getAssignedProjects: async (assignee) => {
    const { data } = await axios.get(`${base}${PROJECTS}/${assignee}`);
    return data;
  },

  getProject: async (userId, projectId) => {
    const { data } = await axios.get(
      `${base}${PROJECTS}/${userId}/${projectId}`
    );
    return data.data;
  },

  createProject: async (body) => {
    const { data } = await axios.post(`${base}${PROJECTS}`, body);
    return data;
  },

  updateProject: async (body, userId, id) => {
    const { data } = await axios.put(
      `${base}${PROJECTS}/${userId}/${id}`,
      body
    );
    return data;
  },
  deleteProject: async (userId, id) => {
    const { data } = await axios.delete(`${base}${PROJECTS}/${userId}/${id}`);
    return data;
  },

  getFormDetails: async (id) => {
    const { data } = await axios.get(`${base}${FORM}/${id}`);
    return data;
  },

  createProjectCard: async (body) => {
    const { data } = await axios.post(`${base}${PROJECTS_CARDS}`, body);
    return data;
  },

  getTotalFormSubmissions: async (projectId, formId, query) => {
    const { data } = await axios.get(
      `${base}${PROJECTS_CARDS}/form_submission_count/${projectId}/project_id
      ${query ? query : ""}
      `
    );
    return data;
  },

  getAllCards: async (projectId, query) => {
    const { data } = await axios.get(
      `${base}${PROJECTS_CARDS}/${projectId}?${query}
      `
    );
    return data;
  },

  deleteCard: async (userId, cardId) => {
    const { data } = await axios.delete(
      `${base}${PROJECTS_CARDS}/${userId}/${cardId}`
    );
    return data;
  },

  getMetricsValue: async (projectId, fieldName) => {
    const { data } = await axios.get(
      `${base}${PROJECTS_CARDS}/project_id/${projectId}/form_id?field_name=${fieldName}
      `
    );
    return data;
  },
  getVerticalValue: async (projectId, fieldName1, fieldName2) => {
    const { data } = await axios.get(
      `${base}${PROJECTS_CARDS}/vertical_chart_and_donut/project_id/${projectId}/form_id?field_name[0]=${fieldName1}&field_name[1]=${fieldName2}
      `
    );
    return data;
  },
  getDoughnutValue: async (projectId, fieldName1, fieldName2) => {
    const { data } = await axios.get(
      `${base}${PROJECTS_CARDS}/vertical_chart_and_donut/project_id/${projectId}/form_id?field_name[0]=${fieldName1}&field_name[1]=${fieldName2}
      `
    );
    return data;
  },
  getRecentFormSubmissions: async (projectId, query) => {
    const { data } = await axios.get(
      `${base}/forms-fields-values/by-project-id/${projectId}${query ?? ""}`
    );
    return data;
  },
});
