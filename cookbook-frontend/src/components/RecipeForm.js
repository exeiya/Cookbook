import React from 'react';

const RecipeForm = ({
    title,
    ingredients,
    newIngredient,
    instructions, 
    addRecipe, 
    handleTitleChange, 
    handleInstructionsChange,
    handleIngredientChange,
    addIngredient
  }) => {

  const addedIngredients = ingredients.map(ingredient => 
    <li key={ingredient}>{ingredient}</li>
  )

  return (
    <form onSubmit={addRecipe}>
      Reseptin nimi: 
      <input onChange={handleTitleChange} value={title}/> <br/>
      Ainekset:
      <ul>
        {addedIngredients}
        <li> 
          <input onChange={handleIngredientChange} value={newIngredient}/>
          <button type="button" onClick={addIngredient}>Lisää uusi ainesosa</button>
        </li>
      </ul>
      Ohjeet:
      <input onChange={handleInstructionsChange} value={instructions}/> <br/>
      <input type="submit" value="Lisää resepti" />
    </form>
  )
}

export default RecipeForm;