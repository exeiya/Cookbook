const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

usersRouter.get('/', async (req, res) => {
  await User.find({}).then(users => {
    res.json(users);
  });
});

usersRouter.post('/', async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      passwordHash,
      recipes: []
    });

    const savedUser = newUser.save();
    res.json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

module.exports = usersRouter;