export default (axios, base) => ({
  file: async (body) => {
    const { data } = await axios.post(`${base}/form/upload`, body);
    return data;
  },
});
