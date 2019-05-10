import React, { useState } from 'react';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { withRouter } from 'react-router-dom';
import { Form, Button } from 'semantic-ui-react';
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
      props.history.push('/');
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
          <Button type="button" onClick={removeIngredient(ingredient.id)}>Poista</Button>
        </td>
      </tr>
    );
  });

  return (
    <Form onSubmit={addRecipe}>
      <Form.Field width={8}>
        <label>Reseptin nimi</label>
        <input onChange={({ target }) => setTitle(target.value)} value={title} />
      </Form.Field>
      <Form.Group grouped>
        <table>
          <tbody>
            {addedIngredients.length > 0 ? <tr><th>Ainesosa</th><th>Määrä</th></tr> : null}
            {addedIngredients}
          </tbody>
        </table>
        <Button type="button" onClick={addIngredient}>Lisää uusi ainesosa</Button>
      </Form.Group>
      <Form.Field>
        <label>Ohjeet</label>
        <textarea onChange={({ target }) => setInstructions(target.value)} value={instructions}/>
      </Form.Field>
      <Button positive>Lisää resepti</Button>
    </Form>
  );
};

export default connect(
  null,
  { addRecipe }
)(withRouter(RecipeForm));