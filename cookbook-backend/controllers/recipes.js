const recipesRouter = require('express').Router();

let recipes = [
  {
    id: 1,
    title: 'Mustikkapiirakka',
    ingredients: [
      {
        name: 'mustikka',
        amount: '1 kpl'
      },
      {
        name: 'piirakka',
        amount: '1 kpl'
      }
    ],
    instructions: 'Yhdistä mustikka ja piirakka.',
    servings: 8,
    cookingTime: '2 tuntia',
    category: 'jälkiruoka'
  },
  {
    id: 2,
    title: 'Makaroonilaatikko',
    ingredients: [
      {
        name: 'makarooni',
        amount: '1 kpl'
      },
      {
        name: 'laatikko',
        amount: '1 kpl'
      }
    ],
    instructions: 'Laita makaroonit laatikkoon',
    servings: 6,
    cookingTime: '2 tuntia',
    category: 'pääruoka'
  }
];

recipesRouter.get('/', (req, res) => {
  res.json(recipes);
});

recipesRouter.get('/:id', (req, res) => {
  const recipe = recipes
    .find(recipe => recipe.id === Number(req.params.id));

  if (recipe) res.json(recipe);
  res.status(404).end();
});

const validateFields = (recipe) => {
  const {
    title,
    instructions,
    category,
    ingredients
  } = recipe;

  if (!title || !instructions || !category || !ingredients) {
    return ({ error: 'Missing required fields' });
  } else if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return ({ error: 'Missing ingredients' });
  }

  let ingredientsError = null;
  ingredients.forEach(ingredient => {
    if (!ingredient.name) {
      ingredientsError = ({ error: 'Missing ingredient name' });
      return;
    }
  });

  return ingredientsError;
};

recipesRouter.post('/', (req, res) => {
  const {
    title,
    instructions,
    category,
    ingredients,
    servings,
    cookingTime
  } = req.body;

  const validationError = validateFields(req.body);

  if (!validationError) {
    const newRecipe = {
      id: recipes.length + 1,
      title,
      instructions,
      category,
      ingredients: ingredients.map(ingredient =>
        ({ name: ingredient.name, amount: ingredient.amount || '' })
      ),
      servings: servings || null,
      cookingTime: cookingTime || null
    };
    recipes.push(newRecipe);
    return res.status(201).send(newRecipe);
  }

  res.status(400).send(validationError);
});

module.exports = recipesRouter;