import React, { useState } from 'react';
import shortid from 'shortid';
import Recipe from './components/Recipe';
import RecipeForm from './components/RecipeForm';

function App(props) {
  const [recipes, setRecipes] = useState(props.recipes);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState('');

  const addRecipe = (event) => {
    event.preventDefault();
    const newRecipe = {
      id: shortid.generate(),
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

  const recipeItems = () => recipes.map(recipe =>
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

export default App;
