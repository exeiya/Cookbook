import React, { useState } from 'react';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { addRecipe } from '../reducers/recipeReducer';

const RecipeForm = (props) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState('');

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

  const removeIngredient = (id) => () => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
  };

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
      <input onChange={({ target }) => setTitle(target.value)} value={title}/> <br/>
      Ainekset:
      <table>
        <tbody>
          {addedIngredients.length > 0 ? <tr><th>Ainesosa</th><th>Määrä</th></tr> : null}
          {addedIngredients}
        </tbody>
      </table>
      <input type="button" onClick={addIngredient} value="Lisää uusi ainesosa" /><br/>
      Ohjeet:
      <textarea onChange={({ target }) => setInstructions(target.value)} value={instructions}/> <br/>
      <input type="submit" value="Lisää resepti" />
    </form>
  );
};

export default connect(
  null,
  { addRecipe }
)(RecipeForm);