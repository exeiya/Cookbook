import React, { useState } from 'react';
import Recipe from './components/Recipe';

function App(props) {
  const [recipes, setRecipes] = useState(props.recipes);

  const recipeItems = () => recipes.map(recipe =>
      <Recipe key={recipe.id} recipe={recipe} />
    );

  return (
    <div>
      <h1>Cookbook</h1>
      {recipeItems()}
    </div>
  );
}

export default App;
