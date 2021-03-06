import axios from 'axios';

const baseUrl = '/api/users';
let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const res = await axios.get(baseUrl);
  return res.data;
};

const create = async (user) => {
  const res = await axios.post(baseUrl, user);
  return res.data;
};

const updateFavoriteRecipes = async (id, recipeId) => {
  const config = { headers: { Authorization: token } };
  const res = await axios.patch(`${baseUrl}/${id}`, { favorite: recipeId }, config);
  return res.data;
};

const removeId = async(userId) => {
  const config = { headers: { Authorization: token } };
  const res = await axios.delete(`${baseUrl}/${userId}`, config);
  return res.data;
};

export default { getAll, create, updateFavoriteRecipes, setToken, removeId };