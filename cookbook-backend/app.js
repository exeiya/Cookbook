const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const recipesRouter = require('./controllers/recipes');

app.use(cors());
app.use(bodyParser.json());

app.use('/api/recipes', recipesRouter);

module.exports = app;