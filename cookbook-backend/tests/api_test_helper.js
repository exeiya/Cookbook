const Recipe = require('../models/recipe');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const initialRecipes = [
  {
    title: 'Mustikkapiirakka',
    instructions: 'Vatkaa munat ja sokeri vaahdoksi. Sekoita keskenään jauhot, leivinjauhe ja vanilliinisokeri. Lisää jauhoseos, maito ja margariini vaahtoon. Kaada vuokaan ja ripottele mustikat pinnalle ja paista 200-asteisessa uunissa 30min.',
    category: 'jälkiruoka',
    ingredients: [
      { name: 'kananmunia', amount: '2 kpl' },
      { name: 'sokeria', amount: '1,5 dl' },
      { name: 'vanilliinisokeria', amount: '2 tl' },
      { name: 'leivinjauhetta', amount: '1,5 tl' },
      { name: 'vehnäjauhoa', amount: '3 dl' },
      { name: 'margariinia', amount: '100 g' },
      { name: 'maitoa', amount: '1 dl' },
      { name: 'mustikoita', amount: '200 g' }
    ],
    servings: 10,
    cookingTime: '60 minuuttia'
  },
  {
    title: 'Makaroonilaatikko',
    instructions: 'Ruskista jauheliha ja sipuli. Keitä makaroonit. Sekoita makaroonit ja jauheliha uunivuoassa ja lisää munamaitoseos. Paista 200-asteisessa uunissa noin tunnin verran.',
    category: 'pääruoka',
    ingredients: [
      { name: 'jauheliha', amount: '400 g' },
      { name: 'makaroonia', amount: '5 dl' },
      { name: 'maitoa', amount: '7 dl' },
      { name: 'kananmunia', amount: '3 kpl' },
      { name: 'sipuli', amount: '1 kpl' }
    ],
    servings: 6
  }
];

const initialUsers = [
  {
    username: 'Kokkikolmonen',
    password: 'Salasana_1234'
  },
  {
    username: 'Kokkaaja',
    password: 'Salainensalasana_1'
  }
];

const recipesInDb = async () => {
  const recipes = await Recipe.find({});
  return recipes.map(recipe => recipe.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

const nonexistentRecipeId = async () => {
  const recipe = new Recipe({
    title: 'Munakas',
    instructions: 'Riko munat pannuun ja paista',
    category: 'pääruoka',
    ingredients: [
      { name: 'kananmunia', amount: '2 kpl' }
    ],
  });
  await recipe.save();
  await recipe.remove();

  return recipe._id.toString();
};

const nonexistentUserId = async () => {
  const user = new User({
    username: 'SoonToBeNobody',
    password: 'Password_1234'
  });
  await user.save();
  await user.remove();

  return user._id.toString();
};

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const getLoggedUserToken = (user) => {
  const token = jwt.sign(
    { username: user.username, id: user.id },
    process.env.SECRET
  );
  return token;
};

module.exports = {
  initialRecipes,
  recipesInDb,
  nonexistentRecipeId,
  initialUsers,
  usersInDb,
  nonexistentUserId,
  hashPassword,
  getLoggedUserToken
};