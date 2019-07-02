const loginRouter = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const authenticationSuccess = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!authenticationSuccess) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign(
    { username: user.username, id: user._id },
    process.env.SECRET
  );

  return res.status(200).json({ token, username: user.username });
});

module.exports = loginRouter;