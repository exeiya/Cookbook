const recipesRouter = require('express').Router();
const Recipe = require('../models/recipe');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Datauri = require('datauri');
const config = require('../utils/config');

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('image');

cloudinary.config({
  cloud_name: 'cookiescloud',
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET
});

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

recipesRouter.post('/', multerUploads, async (req, res, next) => {
  const contentType = req.headers['content-type'];
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    const user = await User.findById(decodedToken.id);
    let newRecipe;
    if (contentType.startsWith('multipart/form-data')) {
      const dataUri = new Datauri();
      const recipe = JSON.parse(req.body.recipe);
      const {
        title,
        instructions,
        category,
        ingredients,
        servings,
        cookingTime
      } = recipe;

      const imgFile = req.file ? dataUri.format(req.file.originalname, req.file.buffer).content : null;

      newRecipe = new Recipe({
        title,
        instructions,
        category,
        ingredients: ingredients ? ingredients.map(ingredient =>
          ({ name: ingredient.name, amount: ingredient.amount || '' })
        ) : null,
        servings: servings || null,
        cookingTime: cookingTime || null,
        date: new Date(),
        likes: 0,
        user: user._id,
        imgUrl: null
      });
      await newRecipe.validate();

      let imgUrl = null;
      if (imgFile) {
        const imgUploadRes = await cloudinary.uploader.upload(imgFile);
        imgUrl = imgUploadRes.url;
      }
      newRecipe.imgUrl = imgUrl;

    } else if (contentType === 'application/json'){
      const {
        title,
        instructions,
        category,
        ingredients,
        servings,
        cookingTime
      } = req.body;

      newRecipe = new Recipe({
        title,
        instructions,
        category,
        ingredients: ingredients ? ingredients.map(ingredient =>
          ({ name: ingredient.name, amount: ingredient.amount || '' })
        ) : null,
        servings: servings || null,
        cookingTime: cookingTime || null,
        date: new Date(),
        likes: 0,
        user: user._id,
        imgUrl: null
      });
    }

    const savedRecipe = await newRecipe.save();

    user.recipes = user.recipes.concat(savedRecipe._id);
    await user.save();

    return res.status(201).json(savedRecipe.toJSON());
  } catch (error) {
    next(error);
  }
});

recipesRouter.patch('/:id', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    await User.findById(decodedToken.id);

    const likes = req.body.likes;
    const id = req.params.id;
    if (!likes) {
      return res.status(400).json({ error: 'Missing valid fields' });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, { likes }, { new: true })
      .populate('user', { username: 1 });
    return res.json(updatedRecipe);
  } catch (error) {
    next(error);
  }
});

module.exports = recipesRouter;