import React, { useState } from 'react';
import Recipe from './components/Recipe';
import RecipeForm from './components/RecipeForm';

function App(props) {
  const [recipes, setRecipes] = useState(props.recipes);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [instructions, setInstructions] = useState('');

  const addRecipe = (event) => {
    event.preventDefault();
    const newRecipe = {
      id: (title.length + instructions.length),
      title,
      ingredients,
      instructions
    };

    if (title && instructions && ingredients.length > 0) {
      setRecipes(recipes.concat(newRecipe));
      setTitle('');
      setIngredients([]);
      setInstructions('');
    }
  };

  const addIngredient = (event) => {
    event.preventDefault();
    if (!ingredients.includes(newIngredient) && newIngredient.trim().length > 0) {
      setIngredients(ingredients.concat(newIngredient));
      setNewIngredient('');
    }
  };

  const recipeItems = () => recipes.map(recipe =>
    <Recipe key={recipe.id} recipe={recipe} />
  );

  return (
    <div>
      <h1>Cookbook</h1>
      <RecipeForm
        title={title}
        ingredients={ingredients}
        newIngredient={newIngredient}
        instructions={instructions}
        addRecipe={addRecipe}
        addIngredient={addIngredient}
        handleTitleChange={({ target }) => setTitle(target.value)}
        handleInstructionsChange={({ target }) => setInstructions(target.value)}
        handleIngredientChange={({ target }) => setNewIngredient(target.value)}
      />
      {recipeItems()}
    </div>
  );
}

export default App;
