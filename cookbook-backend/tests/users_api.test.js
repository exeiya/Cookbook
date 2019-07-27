const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');
const helper = require('./api_test_helper');

describe('when there are some initial users saved', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const userObjects = helper.initialUsers.map(user => new User(user));
    const promiseArray = userObjects.map(user => user.save());
    await Promise.all(promiseArray);
  });

  test('all users are returned', async () => {
    const res = await api.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(res.body.length).toBe(helper.initialUsers.length);
  });

  test('a specific user is returned with all users', async () => {
    const res = await api.get('/api/users');
    const usernames = res.body.map(user => user.username);
    expect(usernames).toContain('Kokkikolmonen');
  });

  describe('fetching and viewing a specific user', () => {
    test('succeeds with a valid user id', async () => {
      const usersAtStart = await helper.usersInDb();
      const userToView = usersAtStart[0];
      const res = await api
        .get(`/api/users/${userToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      expect(res.body).toEqual(userToView);
    });

    test('fails with statuscode 400 if user id is invalid', async () => {
      const invalidUserId = 'invalidID1234';
      await api.get(`/api/users/${invalidUserId}`)
        .expect(400);
    });

    test('fails with statuscode 404 if user does not exist', async () => {
      const nonexistentUserId = await helper.nonexistentUserId();
      await api.get(`/api/users/${nonexistentUserId}`)
        .expect(404);
    });
  });

  describe('user creation', () => {
    test('succeeds with a new username', async () => {
      const usersAtStart = await helper.usersInDb();
      const newUser = {
        username: 'Uusikokki',
        password: 'Salasana_123'
      };

      await api.post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd.length).toBe(usersAtStart.length + 1);
      const usernames = usersAtEnd.map(user => user.username);
      expect(usernames).toContain(newUser.username);
    });

    test('fails with statuscode 400 and error message when username is duplicate', async () => {
      const usersAtStart = await helper.usersInDb();
      const newUser = {
        username: 'Kokkikolmonen',
        password: 'Salasana_123'
      };

      const res = await api.post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(res.body.error.message).toContain('expected `username` to be unique');

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd.length).toBe(usersAtStart.length);
    });

    test('fails with status 400 when password is not given', async () => {
      const usersAtStart = await helper.usersInDb();
      const newUser = {
        username: 'Uusikokki'
      };

      await api.post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd.length).toBe(usersAtStart.length);
    });

    test('fails with status 400 when username is not given', async () => {
      const usersAtStart = await helper.usersInDb();
      const newUser = {
        password: 'Salasana_123'
      };

      await api.post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd.length).toBe(usersAtStart.length);
    });

    test('fails with status 400 when password does not have numeric characters', async () => {
      const usersAtStart = await helper.usersInDb();
      const newUser = {
        username: 'Uusikokki',
        password: 'Salainen_salasana'
      };

      const res = await api.post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd.length).toBe(usersAtStart.length);
      expect(res.body.error).toContain('Password is not strong enough');
    });

    test('fails with status 400 when username has forbidden characters', async () => {
      const usersAtStart = await helper.usersInDb();
      const newUser = {
        username: 'Uusikokki@%/',
        password: 'Salasana_123'
      };

      await api.post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd.length).toBe(usersAtStart.length);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});