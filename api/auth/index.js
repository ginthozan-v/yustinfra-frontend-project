import {
  CHANGE_PASSWORD,
  FORGOT_PASSWORD,
  LOGIN,
  RESET_PASSWORD,
  USERS,
} from "@/constants/endpoints";

export default (axios, base) => ({
  login: async (body) => {
    const { data } = await axios.post(`${base}${LOGIN}`, body);
    return data;
  },
  forgotPassword: async (body) => {
    const { data } = await axios.post(`${base}${FORGOT_PASSWORD}`, body);
    return data;
  },
  resetPassword: async (body) => {
    const { data } = await axios.post(`${base}${RESET_PASSWORD}`, body);
    return data;
  },
  changePassword: async (body) => {
    const { data } = await axios.post(`${base}${CHANGE_PASSWORD}`, body);
    return data;
  },
  confirmUser: async (body) => {
    const {userId} = body;
    const { data } = await axios.put(
      `${base}${USERS}/${userId}`,
      body
    );
    return data;
  },
});
