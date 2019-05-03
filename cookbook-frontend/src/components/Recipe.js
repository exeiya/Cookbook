import React from 'react';

const Recipe = ({ recipe }) => {
  return (
    <div style={{ border: 'solid 1px', padding: 5, margin: 5 }}>
      <h3>{recipe.title}</h3>
      Ainekset:
      <ul>
        {recipe.ingredients.map(ingredient => <li key={ingredient}>{ingredient}</li>)}
      </ul>
      Ohjeet:
      <p>{recipe.instructions}</p>
    </div>
  );
};

export default Recipe;