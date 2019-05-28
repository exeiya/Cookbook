import React, { useState } from 'react';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { withRouter } from 'react-router-dom';
import { Form, Button, Icon } from 'semantic-ui-react';
import { addRecipe } from '../reducers/recipeReducer';
import { notify } from '../reducers/notificationReducer';

const RecipeForm = (props) => {
  const [values, setValues] = useState({ title: '', instructions: '' });
  const [ingredients, setIngredients] = useState([]);
  const [errors, setErrors] = useState({});

  const validationErrorStyle = {
    color: '#9f2a28',
    float: 'right'
  };

  const validateFields = () => {
    let fieldErrors = { ...errors };
    if (values.title.length < 3) {
      fieldErrors = ({ ...fieldErrors,  title: 'Reseptin nimen tulee olla vähintään 3 merkin pituinen' });
    } else if (fieldErrors.title || fieldErrors.title === null) {
      delete fieldErrors.title;
    }

    if (values.instructions.length === 0) {
      fieldErrors = ({ ...fieldErrors,  instructions: 'Reseptillä täytyy olla ohje' });
    } else if (fieldErrors.instructions || fieldErrors.instructions === null) {
      delete fieldErrors.instructions;
    }

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const addRecipe = async (event) => {
    event.preventDefault();
    const newRecipe = {
      title: values.title,
      ingredients: ingredients.map(ingredient =>
        ({ name: ingredient.name, amount: ingredient.amount })),
      instructions: values.instructions
    };

    if (validateFields()) {
      try {
        await props.addRecipe(newRecipe);
        setValues({ title: '', instructions: '' });
        setIngredients([]);
        props.notify(`Uusi resepti '${newRecipe.title}' lisätty!`, 'success');
        props.history.push('/');
      } catch (e) {
        console.log(e);
        props.notify('Virhe reseptin luonnissa! Uutta reseptiä ei luotu.', 'error');
      }
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

  const validationErrorMsg = (msg) => (
    <span style={validationErrorStyle}>
      <Icon name="exclamation triangle" />
      {msg}
    </span>
  );

  const handleChange = (target) => {
    setValues({ ...values, [target.name]: target.value });
    setErrors({ ...errors, [target.name]: null });
  };

  return (
    <Form onSubmit={addRecipe} noValidate>
      <Form.Field width={8} error={errors.title && true}>
        <div>
          <label style={{ fontWeight: 'bold' }}>Reseptin nimi</label>
          {errors.title && validationErrorMsg(errors.title)}
        </div>
        <input onChange={({ target }) => handleChange(target)} name="title" value={values.title} required />
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
      <Form.Field error={errors.instructions && true}>
        <div>
          <label style={{ fontWeight: 'bold' }}>Ohjeet</label>
          {errors.instructions && validationErrorMsg(errors.instructions)}
        </div>
        <textarea onChange={({ target }) => handleChange(target)} name="instructions" value={values.instructions} required />
      </Form.Field>
      <Button positive>Lisää resepti</Button>
    </Form>
  );
};

export default connect(
  null,
  { addRecipe, notify }
)(withRouter(RecipeForm));