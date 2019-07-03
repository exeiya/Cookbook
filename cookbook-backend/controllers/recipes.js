const recipesRouter = require('express').Router();
const Recipe = require('../models/recipe');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

recipesRouter.get('/', async (req, res) => {
  const recipes = await Recipe.find({})
    .populate('user', { username: 1 });
  return res.json(recipes.map(recipe => recipe.toJSON()));
});

recipesRouter.get('/:id', (req, res, next) => {
  Recipe.findById(req.params.id)
    .then(recipe => {
      if (recipe) {
        res.json(recipe.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch(error => {
      next(error);
    });
});

recipesRouter.post('/', async (req, res, next) => {
  const {
    title,
    instructions,
    category,
    ingredients,
    servings,
    cookingTime
  } = req.body;

  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    const user = await User.findById(decodedToken.id);

    const newRecipe = new Recipe({
      title,
      instructions,
      category,
      ingredients: ingredients ? ingredients.map(ingredient =>
        ({ name: ingredient.name, amount: ingredient.amount || '' })
      ) : null,
      servings: servings || null,
      cookingTime: cookingTime || null,
      date: new Date(),
      user: user._id
    });
    const savedRecipe = await newRecipe.save();

    user.recipes = user.recipes.concat(savedRecipe._id);
    await user.save();

    return res.status(201).json(savedRecipe.toJSON());
  } catch (error) {
    next(error);
  }
});

module.exports = recipesRouter;