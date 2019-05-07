import React from 'react';

const RecipeForm = ({
  title,
  ingredients,
  instructions,
  addRecipe,
  handleTitleChange,
  handleInstructionsChange,
  handleIngredientChange,
  addIngredient,
  removeIngredient
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
        <td>
          <input type="button" value="Poista" onClick={removeIngredient(ingredient.id)} />
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
      <input type="button" onClick={addIngredient} value="Lisää uusi ainesosa" /><br/>
      Ohjeet:
      <textarea onChange={handleInstructionsChange} value={instructions}/> <br/>
      <input type="submit" value="Lisää resepti" />
    </form>
  );
};

export default RecipeForm;