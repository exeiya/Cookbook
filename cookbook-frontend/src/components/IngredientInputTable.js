import React from 'react';
import shortid from 'shortid';
import { Form, Button, Icon } from 'semantic-ui-react';

const IngredientInputTable = ({ ingredients, setIngredients, errors, setErrors }) => {
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
    setErrors({ ...errors,
      ingredientIds: errors.ingredientIds.filter(val => val !== target.name),
      ingredients: null });
  };

  const removeIngredient = (id) => () => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
    setErrors({ ...errors,
      ingredientIds: errors.ingredientIds.filter(val => val !== id),
      ingredients: null });
  };

  const addedIngredients = ingredients.map((ingredient) => {
    const error = errors.ingredientIds.includes(ingredient.id) && true;
    return (
      <tr key={ingredient.id}>
        <td>
          <Form.Field error={error}>
            <input
              value={ingredient.name}
              name={ingredient.id}
              onChange={handleIngredientChange('name')}
              placeholder="Ainesosan nimi"
              data-cy="ingredient-name-field"
            />
          </Form.Field>
        </td>
        <td>
          <Form.Field error={error}>
            <input
              value={ingredient.amount}
              name={ingredient.id}
              onChange={handleIngredientChange('amount')}
              placeholder="Ainesosan määrä"
              data-cy="ingredient-amount-field"
            />
          </Form.Field>
        </td>
        <td>
          {ingredients.length > 1
            ? <Button basic color="orange" type="button" onClick={removeIngredient(ingredient.id)}>
              <span style={{ fontWeight: 'bold' }}>Poista</span></Button>
            : null}
        </td>
      </tr>
    );
  });

  return (
    <Form.Group grouped>
      <table>
        <tbody>
          {addedIngredients.length > 0 ? <tr><th>Ainesosa</th><th>Määrä</th></tr> : null}
          {addedIngredients}
        </tbody>
      </table>
      {errors.ingredients && <div style={{ paddingBottom: '10px' }}>
        <Icon color="yellow" name="exclamation triangle" /> {errors.ingredients}</div>}
      <Button type="button" onClick={addIngredient} color="teal" style={{ marginBottom: '10px' }}
        data-cy="ingredient-add-button">Lisää uusi ainesosa</Button>
    </Form.Group>
  );
};

export default IngredientInputTable;