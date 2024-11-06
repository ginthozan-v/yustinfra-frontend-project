import { SEND_MAIL } from '@/constants/endpoints';

export default (axios, base) => ({
  sendMail: async (createdById, formId) => {
    const { data } = await axios.get(
      `${base}${SEND_MAIL}/${createdById}/${formId}`
    );
    return data;
  },
});
