const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: String,
  amount: String
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  title: String,
  instructions: String,
  category: String,
  servings: Number,
  cookingTime: String,
  ingredients: [ingredientSchema],
  date: Date
});

recipeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);