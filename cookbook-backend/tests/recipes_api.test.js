const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Recipe = require('../models/recipe');
const User = require('../models/user');
const helper = require('./api_test_helper');

describe('when there are recipes and an user saved initially', () => {
  beforeEach(async () => {
    await Recipe.deleteMany({});
    await User.deleteMany({});

    const recipeObjects = helper.initialRecipes.map(recipe => new Recipe(recipe));
    let promiseArray = recipeObjects.map(recipe => recipe.save());
    await Promise.all(promiseArray);

    const user = ({
      ...helper.initialUsers[0],
      passwordHash: await helper.hashPassword(helper.initialUsers[0].password)
    });
    const userObject = new User(user);
    await userObject.save();
  });

  test('recipes are returned as json', async () => {
    await api
      .get('/api/recipes')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all recipes are returned', async () => {
    const res = await api
      .get('/api/recipes')
      .expect(200);

    expect(res.body.length).toBe(helper.initialRecipes.length);
  });

  test('a specific recipe is returned with all recipes', async () => {
    const res = await api.get('/api/recipes');
    const titles = res.body.map(recipe => recipe.title);
    expect(titles).toContain('Makaroonilaatikko');
  });

  describe('fetching and viewing a specific recipe', () => {
    test('succeeds with a valid recipe id', async () => {
      const recipesAtStart = await helper.recipesInDb();
      const recipeToView = recipesAtStart[0];
      const res = await api
        .get(`/api/recipes/${recipeToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      expect(res.body).toEqual(recipeToView);
    });

    test('fails with statuscode 400 if recipe id is invalid', async () => {
      const invalidRecipeId = 'invalidID1234';
      await api.get(`/api/recipes/${invalidRecipeId}`)
        .expect(400);
    });

    test('fails with statuscode 404 if recipe does not exist', async () => {
      const nonexistentRecipeId = await helper.nonexistentRecipeId();
      await api.get(`/api/recipes/${nonexistentRecipeId}`)
        .expect(404);
    });
  });

  describe('adding a recipe', () => {
    test('succeeds with a valid user token', async () => {
      const users = await helper.usersInDb();
      const user = users[0];
      const validUserToken = helper.getLoggedUserToken(user);

      const recipesAtStart = await helper.recipesInDb();
      const res = await api.post('/api/recipes')
        .send({
          title: 'Munakas',
          instructions: 'Riko munat pannuun ja paista',
          category: 'pääruoka',
          ingredients: [
            { name: 'kananmunia', amount: '2 kpl' }
          ],
        })
        .set('Authorization', `Bearer ${validUserToken}`)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const recipesAtEnd = await helper.recipesInDb();
      expect(recipesAtEnd.length).toBe(recipesAtStart.length + 1);
      expect(res.body.title).toContain('Munakas');
      const titles = recipesAtEnd.map(recipe => recipe.title);
      expect(titles).toContain('Munakas');
    });

    test('adds user from token as the user for recipe when token is valid', async () => {
      const users = await helper.usersInDb();
      const user = users[0];
      const validUserToken = helper.getLoggedUserToken(user);

      const recipesAtStart = await helper.recipesInDb();
      const res = await api.post('/api/recipes')
        .send({
          title: 'Munakas',
          instructions: 'Riko munat pannuun ja paista',
          category: 'pääruoka',
          ingredients: [
            { name: 'kananmunia', amount: '2 kpl' }
          ],
        })
        .set('Authorization', `Bearer ${validUserToken}`)
        .expect(201);

      const recipesAtEnd = await helper.recipesInDb();
      expect(recipesAtEnd.length).toBe(recipesAtStart.length + 1);
      expect(res.body.user).toEqual({ username: user.username, id: user.id });
    });

    test('fails without bearer token set in authorization field', async () => {
      const recipesAtStart = await helper.recipesInDb();
      const res = await api.post('/api/recipes')
        .send({
          title: 'Munakas',
          instructions: 'Riko munat pannuun ja paista',
          category: 'pääruoka',
          ingredients: [
            { name: 'kananmunia', amount: '2 kpl' }
          ],
        })
        .expect(401)
        .expect('Content-Type', /application\/json/);

      const recipesAtEnd = await helper.recipesInDb();
      expect(recipesAtEnd.length).toBe(recipesAtStart.length);
      expect(res.body.error).toContain('Token missing or invalid');
    });

    test('fails when token is invalid', async () => {
      const recipesAtStart = await helper.recipesInDb();
      const invalidUserId = await helper.nonexistentUserId();
      const invalidUserToken = helper.getLoggedUserToken(
        { username: 'Nobody', id: invalidUserId }
      );
      await api.post('/api/recipes')
        .send({
          title: 'Munakas',
          instructions: 'Riko munat pannuun ja paista',
          category: 'pääruoka',
          ingredients: [
            { name: 'kananmunia', amount: '2 kpl' }
          ],
        })
        .set('Authorization', `Bearer ${invalidUserToken}`)
        .expect(401);

      const recipesAtEnd = await helper.recipesInDb();
      expect(recipesAtEnd.length).toBe(recipesAtStart.length);
    });

    test('fails if recipe title is not given', async () => {
      const users = await helper.usersInDb();
      const user = users[0];
      const validUserToken = helper.getLoggedUserToken(user);

      const recipesAtStart = await helper.recipesInDb();
      const res = await api.post('/api/recipes')
        .send({
          instructions: 'Riko munat pannuun ja paista',
          category: 'pääruoka',
          ingredients: [
            { name: 'kananmunia', amount: '2 kpl' }
          ],
        })
        .set('Authorization', `Bearer ${validUserToken}`)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const recipesAtEnd = await helper.recipesInDb();
      expect(recipesAtEnd.length).toBe(recipesAtStart.length);
      expect(res.body.error).toContain('`title` is required');
    });
  });

  describe('deleting a recipe', () => {
    test('succeeds with valid token if token owner created the recipe', async () => {
      const users = await helper.usersInDb();
      const user = users[0];
      const validUserToken = helper.getLoggedUserToken(user);

      const res = await api.post('/api/recipes')
        .send({
          title: 'Munakas',
          instructions: 'Riko munat pannuun ja paista',
          category: 'pääruoka',
          ingredients: [
            { name: 'kananmunia', amount: '2 kpl' }
          ],
        })
        .set('Authorization', `Bearer ${validUserToken}`)
      const recipeId = res.body.id;
      const recipesAtStart = await helper.recipesInDb();

      await api.delete(`/api/recipes/${recipeId}`)
        .set('Authorization', `Bearer ${validUserToken}`)
        .expect(204);

      const recipesAtEnd = await helper.recipesInDb();
      expect(recipesAtEnd.length).toBe(recipesAtStart.length - 1);
      const titles = recipesAtEnd.map(recipe => recipe.title);
      expect(titles).not.toContain('Munakas');
    });

    test('fails if token owner did not create the recipe', async () => {
      const users = await helper.usersInDb();
      const user = users[0];
      const validUserToken = helper.getLoggedUserToken(user);
      const recipesAtStart = await helper.recipesInDb();
      const recipe = recipesAtStart[0];

      await api.delete(`/api/recipes/${recipe.id}`)
        .set('Authorization', `Bearer ${validUserToken}`)
        .expect(403);

      const recipesAtEnd = await helper.recipesInDb();
      expect(recipesAtEnd.length).toBe(recipesAtStart.length);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});