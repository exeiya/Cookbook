const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: String
}, { _id: false });

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: Date
});

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
  date: Date,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  imgUrl: String,
  comments: [commentSchema]
});

recipeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);