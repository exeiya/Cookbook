import React from 'react';

const RecipeForm = ({
  title,
  ingredients,
  instructions,
  addRecipe,
  handleTitleChange,
  handleInstructionsChange,
  handleIngredientChange,
  addIngredient
}) => {

  const addedIngredients = ingredients.map((ingredient) => {
    console.log(ingredient);
    return (
      <li key={ingredient.id}>
        <input value={ingredient.name} name={ingredient.id} onChange={handleIngredientChange} />
      </li>
    );
  });

  return (
    <form onSubmit={addRecipe}>
      Reseptin nimi:
      <input onChange={handleTitleChange} value={title}/> <br/>
      Ainekset:
      <ul>
        {addedIngredients}
        <button type="button" onClick={addIngredient}>Lisää uusi ainesosa</button>
      </ul>
      Ohjeet:
      <input onChange={handleInstructionsChange} value={instructions}/> <br/>
      <input type="submit" value="Lisää resepti" />
    </form>
  );
};

export default RecipeForm;