import {
  DASHBOARD,
  DASHBOARD_CARDS,
  PROJECTS_CARDS,
} from "@/constants/endpoints";

export default (axios, base) => ({
  getTotalFormSubmissions: async (query) => {
    const { data } = await axios.get(
      `${base}${DASHBOARD}/total_form_submission${query ? query : ""}`
    );
    return data;
  },
  getRecentFormSubmissions: async (query) => {
    const { data } = await axios.get(
      `${base}/forms-fields-values/created_by${query ? query : ""}`
    );
    return data;
  },
  // getAllCards: async (created_by, query) => {
  //   const { data } = await axios.get(
  //     `${base}${DASHBOARD_CARDS}/created_by/${created_by}`
  //   );
  //   return data;
  // },
  getAllCards: async (created_by, query) => {
    const { data } = await axios.get(
      `${base}${PROJECTS_CARDS}/created_by/${created_by}/main`
    );
    return data;
  },
  createDashboardCard: async (body) => {
    const { data } = await axios.post(`${base}${DASHBOARD_CARDS}`, body);
    return data;
  },
});
