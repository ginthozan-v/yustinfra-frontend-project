import { GROUP } from '@/constants/endpoints';

export default (axios, base) => ({
  getAllGroups: async (userId, search) => {
    const { data } = await axios.get(
      `${base}${GROUP}/${userId}?order_by=created_at&order_type=desc${
        search ? `&name=${search}` : ''
      }`
    );
    return data;
  },
  createGroup: async (body) => {
    const { data } = await axios.post(`${base}${GROUP}`, body);
    return data;
  },
  updateGroup: async (body, userId, id) => {
    const { data } = await axios.put(`${base}${GROUP}/${userId}/${id}`, body);
    return data;
  },
  deleteGroup: async (userId, id) => {
    const { data } = await axios.delete(`${base}${GROUP}/${userId}/${id}`);
    return data;
  },
});
