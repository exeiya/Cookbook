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
    return (
      <tr key={ingredient.id}>
        <td>
          <input value={ingredient.name} name={ingredient.id} onChange={handleIngredientChange('name')} />
        </td>
        <td>
          <input value={ingredient.amount} name={ingredient.id} onChange={handleIngredientChange('amount')} />
        </td>
      </tr>
    );
  });

  return (
    <form onSubmit={addRecipe}>
      Reseptin nimi:
      <input onChange={handleTitleChange} value={title}/> <br/>
      Ainekset:
      <table>
        <tbody>
          {addedIngredients.length > 0 ? <tr><th>Ainesosa</th><th>Määrä</th></tr> : null}
          {addedIngredients}
        </tbody>
      </table>
      <button type="button" onClick={addIngredient}>Lisää uusi ainesosa</button><br/>
      Ohjeet:
      <input onChange={handleInstructionsChange} value={instructions}/> <br/>
      <input type="submit" value="Lisää resepti" />
    </form>
  );
};

export default RecipeForm;