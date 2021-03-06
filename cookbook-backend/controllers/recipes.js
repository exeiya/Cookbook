const recipesRouter = require('express').Router();
const Recipe = require('../models/recipe');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Datauri = require('datauri');
const config = require('../utils/config');
const { InvalidFileType } = require('../utils/errors');

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const acceptedTypes = /jpeg|jpg|png|gif/;
  const mime = acceptedTypes.test(file.mimetype);
  if (mime) return cb(null, true);
  return cb(new InvalidFileType('File type not supported, only images with extensions jpeg, jpg, png and gif are accepted.'));
};
const multerUploads = multer({ storage, fileFilter, limits: { fileSize: 1000000 } }).single('image');

cloudinary.config({
  cloud_name: 'cookiescloud',
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET
});

recipesRouter.get('/', async (req, res) => {
  const recipes = await Recipe.find({})
    .populate('user', { username: 1 })
    .populate('comments.user', { username: 1 });
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
    if (!user) return res.status(401).end();
    let newRecipe;
    if (contentType.startsWith('multipart/form-data')) {
      const dataUri = new Datauri();
      if (!req.body.recipe) {
        return res.status(400).json({ error: 'Missing recipe fields' });
      }
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
        img: null
      });
      await newRecipe.validate();

      let img = {
        url: null,
        id: null
      };
      if (imgFile) {
        const imgUploadRes = await cloudinary.uploader.upload(imgFile);
        img = {
          url: imgUploadRes.url,
          id: imgUploadRes.public_id
        };
      }
      newRecipe.img = img;

    } else if (contentType.startsWith('application/json')){
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
        img: null
      });
    }

    const savedRecipe = await newRecipe.save();

    user.recipes = user.recipes.concat(savedRecipe._id);
    await user.save();
    await savedRecipe.populate('user', { username: 1 }).execPopulate();
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
      .populate('user', { username: 1 })
      .populate('comments.user', { username: 1 });
    return res.json(updatedRecipe);
  } catch (error) {
    next(error);
  }
});

recipesRouter.post('/:id/comments', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    const user = await User.findById(decodedToken.id);

    const comment = req.body.comment;
    const id = req.params.id;
    if (!comment) {
      return res.status(400).json({ error: 'Missing required field comment' });
    }
    const newComment = {
      content: comment,
      user: user._id,
      date: new Date()
    };

    const commentedRecipe = await Recipe.findById(id);
    commentedRecipe.comments = commentedRecipe.comments.concat(newComment);
    await commentedRecipe.save();
    await commentedRecipe
      .populate('user', { username: 1 })
      .populate('comments.user', { username: 1 }).execPopulate();

    return res.json(commentedRecipe);
  } catch (error) {
    next(error);
  }
});

recipesRouter.delete('/:id', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    const recipe = await Recipe.findById(req.params.id);
    if (recipe.user && (decodedToken.id === recipe.user.toString())) {
      await Recipe.findByIdAndRemove(req.params.id);
      if (recipe.img && recipe.img.url) {
        await cloudinary.uploader.destroy(recipe.img.id);
      }
      return res.status(204).end();
    } else {
      return res.status(403).end();
    }
  } catch (error) {
    next(error);
  }
});

recipesRouter.put('/:id', multerUploads, async (req, res, next) => {
  const contentType = req.headers['content-type'];
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    const recipe = await Recipe.findById(req.params.id);
    if (recipe.user && (decodedToken.id === recipe.user.toString())) {
      let newRecipe;
      if (contentType.startsWith('multipart/form-data')) {
        const dataUri = new Datauri();
        if (!req.body.recipe) {
          return res.status(400).json({ error: 'Missing recipe fields' });
        }
        const { title, instructions, category, ingredients,
          servings, cookingTime, img } = JSON.parse(req.body.recipe);

        const imgFile = req.file
          ? dataUri.format(req.file.originalname, req.file.buffer).content
          : null;

        const recipeToValidate = new Recipe({
          title,
          instructions,
          category,
          ingredients: ingredients ? ingredients.map(ingredient =>
            ({ name: ingredient.name, amount: ingredient.amount || '' })
          ) : null,
          servings,
          cookingTime,
          user: recipe.user
        });
        await recipeToValidate.validate();

        let newImg = null;
        if (imgFile) {
          const imgUploadRes = await cloudinary.uploader.upload(imgFile);
          newImg = {
            url: imgUploadRes.url,
            id: imgUploadRes.public_id
          };
        } else if ((img === null) && recipe.img && recipe.img.id) {
          await cloudinary.uploader.destroy(recipe.img.id);
          newImg = { url: null, id: null };
        }
        newRecipe = { title, instructions, category, ingredients,
          servings, cookingTime, img: newImg ? newImg : recipe.img };
      } else if (contentType.startsWith('application/json')) {
        const { title, instructions, category, ingredients,
          servings, cookingTime } = req.body;
        newRecipe = { title, instructions, category, ingredients,
          servings, cookingTime };

        if (req.body.img === null && recipe.img && recipe.img.id) {
          await cloudinary.uploader.destroy(recipe.img.id);
          newRecipe.img = { url: null, id: null };
        } else {
          newRecipe.img = recipe.img;
        }
      }

      const updatedRecipe = await Recipe.findByIdAndUpdate(recipe._id,
        newRecipe, { runValidators: true, new: true });
      await updatedRecipe
        .populate('user', { username: 1 })
        .populate('comments.user', { username: 1 })
        .execPopulate();

      return res.json(updatedRecipe);
    }

    return res.status(403).end();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = recipesRouter;