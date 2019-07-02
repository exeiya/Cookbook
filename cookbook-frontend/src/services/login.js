import axios from 'axios';

const login = async (credentials) => {
  const res = await axios.post('http://localhost:3001/api/login', credentials);
  return res.data;
};

export default { login };