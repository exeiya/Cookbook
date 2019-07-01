const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

usersRouter.get('/', async (req, res) => {
  const users = await User.find({});
  res.json(users.map(user => user.toJSON()));
});

usersRouter.post('/', async (req, res, next) => {
  const { username, password } = req.body;

  if (!password) {
    return res.status(400).json({
      error: 'Password required'
    });
  } else if (password.length < 10 || !RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.,:;-_])').test(password)) {
    return res.status(400).json({
      error: 'Password is not strong enough'
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      passwordHash,
      recipes: []
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

module.exports = usersRouter;