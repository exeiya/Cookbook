const usersRouter = require('express').Router();
const User = require('../models/user');
const Recipe = require('../models/recipe');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
    .sort({ joinedAt: -1 })
    .populate('recipes', {
      title: 1, category: 1, date: 1, img: 1
    })
    .populate('favoriteRecipes', {
      title: 1, category: 1, date: 1, img: 1
    });
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
      recipes: [],
      favoriteRecipes: [],
      joinedAt: new Date()
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

usersRouter.patch('/:id', async (req, res, next) => {
  try {
    const userToken = jwt.verify(req.token, process.env.SECRET);
    const user = await User.findById(userToken.id);

    if (!user || (userToken.id !== req.params.id)) {
      return res.status(403).end();
    }

    if(req.body.favorite) {
      if (user.favoriteRecipes.includes(req.body.favorite)) {
        user.favoriteRecipes = user.favoriteRecipes.filter(id =>
          id.toString() !== req.body.favorite
        );
      } else {
        const newFavorite = await Recipe.findById(req.body.favorite);
        if (!newFavorite) return res.status(404).json({ error: 'Recipe could not be found' });
        user.favoriteRecipes = user.favoriteRecipes.concat(newFavorite._id);
      }
      const savedUser = await User.findByIdAndUpdate(user.id, { favoriteRecipes: user.favoriteRecipes }, { new: true })
        .populate('recipes', {
          title: 1, category: 1, date: 1, id: 1
        })
        .populate('favoriteRecipes', {
          title: 1, category: 1, date: 1, id: 1
        });
      return res.json(savedUser);
    } else {
      return res.status(400).json({ error: 'No valid fields' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;