const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const recipesRouter = require('./controllers/recipes');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
require('dotenv').config();
const mongoose = require('mongoose');
const morgan = require('morgan');
const middleware = require('./utils/middleware');

morgan.token('data', (req) => JSON.stringify(req.body));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((error) => {
    console.log(`Connecting to DB failed: ${error.message}`);
  });

app.use(cors());
app.use(bodyParser.json());
app.use(morgan(':method :url :status :res[content-length] :data - :response-time ms'));
app.use(middleware.tokenExtractor);

app.use('/api/recipes', recipesRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use(middleware.errorHandler);

module.exports = app;