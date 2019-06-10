const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: String
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3
  },
  instructions: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['pääruoka', 'jälkiruoka', 'salaatti'],
    required: true
  },
  servings: Number,
  cookingTime: String,
  ingredients: {
    type: [ingredientSchema],
    required: true
  },
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