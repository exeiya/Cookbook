const recipesRouter = require('express').Router();
const Recipe = require('../models/recipe');

recipesRouter.get('/', (req, res) => {
  Recipe.find({}).then(recipes => {
    res.json(recipes.map(recipe => recipe.toJSON()));
  });
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

recipesRouter.post('/', (req, res, next) => {
  const {
    title,
    instructions,
    category,
    ingredients,
    servings,
    cookingTime
  } = req.body;

  const newRecipe = new Recipe({
    title,
    instructions,
    category,
    ingredients: ingredients.map(ingredient =>
      ({ name: ingredient.name, amount: ingredient.amount || '' })
    ),
    servings: servings || null,
    cookingTime: cookingTime || null,
    date: new Date()
  });
  newRecipe.save()
    .then(savedRecipe => {
      res.status(201).send(savedRecipe.toJSON());
    })
    .catch(error => {
      next(error);
    });
});

module.exports = recipesRouter;