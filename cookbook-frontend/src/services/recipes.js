import axios from 'axios';

const baseUrl = 'http://localhost:3001/recipes';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (recipe) => {
  const response = await axios.post(baseUrl, recipe);
  return response.data;
};

export default { getAll, create };