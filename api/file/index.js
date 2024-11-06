export default (axios, base) => ({
  uploadFile: async (body) => {
    const { data } = await axios.post(`${base}/upload`, body);
    return data;
  },
});
