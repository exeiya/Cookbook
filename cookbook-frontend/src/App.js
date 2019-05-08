import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import shortid from 'shortid';
import Recipe from './components/Recipe';
import RecipeForm from './components/RecipeForm';
import { initializeRecipes, addRecipe } from './reducers/recipeReducer';

function App(props) {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState('');

  const { initializeRecipes } = props;

  useEffect(() => {
    initializeRecipes();
  }, [initializeRecipes]);

  const addRecipe = (event) => {
    event.preventDefault();
    const newRecipe = {
      title,
      ingredients: ingredients.map(ingredient =>
        ({ name: ingredient.name, amount: ingredient.amount })),
      instructions
    };

    if (title && instructions && ingredients.length > 0) {
      props.addRecipe(newRecipe);
      setTitle('');
      setIngredients([]);
      setInstructions('');
    }
  };

  const addIngredient = (event) => {
    event.preventDefault();
    setIngredients(ingredients.concat({
      id: shortid.generate(),
      name: '',
      amount: ''
    })
    );
  };

  const handleIngredientChange = (field) => ({ target }) => {
    setIngredients(
      ingredients.map((ingredient) => ingredient.id === target.name
        ? { ...ingredient, [field]: target.value }
        : ingredient
      )
    );
  };

  const recipeItems = () => props.state.map(recipe =>
    <Recipe key={recipe.id} recipe={recipe} />
  );

  const removeIngredient = (id) => () => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
  };

  return (
    <div>
      <h1>Cookbook</h1>
      <RecipeForm
        title={title}
        ingredients={ingredients}
        instructions={instructions}
        addRecipe={addRecipe}
        addIngredient={addIngredient}
        handleTitleChange={({ target }) => setTitle(target.value)}
        handleInstructionsChange={({ target }) => setInstructions(target.value)}
        handleIngredientChange={handleIngredientChange}
        removeIngredient={removeIngredient}
      />
      {recipeItems()}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    state
  };
};

export default connect(
  mapStateToProps,
  { initializeRecipes, addRecipe }
)(App);
