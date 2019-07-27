const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');
const bcrypt = require('bcrypt');

describe.only('when there is initially saved user', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const user = { username: 'Kokkikolmonen', password: 'Salasana_1234' };
    const passwordHash = await bcrypt.hash(user.password, 10);
    const newUser = new User({ ...user, passwordHash });
    await newUser.save();
  });

  test('login succeeds with correct username and password', async () => {
    await api.post('/api/login')
      .send({ username: 'Kokkikolmonen', password: 'Salasana_1234' })
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('successful login returns an authentication token', async () => {
    const res = await api.post('/api/login')
      .send({ username: 'Kokkikolmonen', password: 'Salasana_1234' })
      .expect(200);

    expect(res.body.token).toBeDefined();
  });

  test('login fails with incorrect username/password combination', async () => {
    const res = await api.post('/api/login')
      .send({ username: 'Kokkikolmonen', password: 'wrongpassword' })
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(res.body.error).toContain('Invalid username or password');
  });

  test('login fails with nonexistent username', async () => {
    const res = await api.post('/api/login')
      .send({ username: 'Nobody', password: 'wrongpassword' })
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(res.body.error).toContain('Invalid username or password');
  });
});

afterAll(() => {
  mongoose.connection.close();
});