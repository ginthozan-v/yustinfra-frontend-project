import { USERS } from '@/constants/endpoints';

export default (axios, base) => ({
  createUser: async (body) => {
    const { data } = await axios.post(`${base}${USERS}`, body);
    return data;
  },
  getAllUser: async (search) => {
    const { data } = await axios.get(
      `${base}${USERS}?populate=*&filters[username][$contains]=${search ?? ''}`
    );
    return data;
  },
  getUser: async (id) => {
    const { data } = await axios.get(`${base}${USERS}/${id}?populate=*`);
    return data;
  },
  deleteUser: async (id) => {
    const { data } = await axios.delete(`${base}${USERS}/${id}`);
    return data;
  },
  updateUser: async (body, id) => {
    const { data } = await axios.put(`${base}${USERS}/${id}`, body);
    return data;
  },
  updateFile: async (body) => {
    const { data } = await axios.post(`${base}${USERS}/upload`, body);
    return data;
  },
});
