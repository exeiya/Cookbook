const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Recipe = require('../models/recipe');
const helper = require('./api_test_helper');

describe('when there are recipes saved initially', () => {
  beforeEach(async () => {
    await Recipe.deleteMany({});

    const recipeObjects = helper.initialRecipes.map(recipe => new Recipe(recipe));
    const promiseArray = recipeObjects.map(recipe => recipe.save());
    await Promise.all(promiseArray);
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
});

afterAll(() => {
  mongoose.connection.close();
});