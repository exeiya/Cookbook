import axios from 'axios';

const baseUrl = '/api/recipes';

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (recipe) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.post(baseUrl, recipe, config);
  return response.data;
};

const likeRecipe = async (recipe) => {
  const config = { headers: { Authorization: token } };
  const res = await axios.patch(`${baseUrl}/${recipe.id}`,
    { likes: (recipe.likes || 0) + 1 }, config);
  return res.data;
};

const addComment = async (recipe, comment) => {
  const config = { headers: { Authorization: token } };
  const res = await axios.post(`${baseUrl}/${recipe.id}/comments`,
    { comment }, config);
  return res.data;
};

const removeRecipe = async (recipeId) => {
  const config = { headers: { Authorization: token } };
  const res = await axios.delete(`${baseUrl}/${recipeId}`, config);
  return res.data;
};

const update = async (recipe, recipeId) => {
  const config = { headers: { Authorization: token } };
  const res = await axios.put(`${baseUrl}/${recipeId}`, recipe, config);
  return res.data;
};

export default {
  getAll,
  create,
  likeRecipe,
  setToken,
  addComment,
  removeRecipe,
  update
};