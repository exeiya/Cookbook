const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const recipesRouter = require('./controllers/recipes');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const mongoose = require('mongoose');
const morgan = require('morgan');
const middleware = require('./utils/middleware');
const config = require('./utils/config');

morgan.token('data', (req) => {
  if (req.body.password) {
    let obj = { ...req.body };
    delete obj.password;
    return JSON.stringify(obj);
  } else {
    return JSON.stringify(req.body);
  }
});

mongoose.set('useCreateIndex', true);
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((error) => {
    console.log(`Connecting to DB failed: ${error.message}`);
  });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('build'));
app.use(morgan(':method :url :status :res[content-length] :data - :date[clf] - :response-time ms'));
app.use(middleware.tokenExtractor);

app.use('/api/recipes', recipesRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpointHandler);

module.exports = app;