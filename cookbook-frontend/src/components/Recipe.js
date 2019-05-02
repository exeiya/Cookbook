import React from 'react';

const Recipe = ({recipe}) => {
  return (
    <>
      <h3>{recipe.title}</h3>
      <ul>
        {recipe.ingredients.map(ingredient => <li key={ingredient}>{ingredient}</li>)}
      </ul>
      <p>{recipe.instructions}</p>
    </>
  )
}

export default Recipe;