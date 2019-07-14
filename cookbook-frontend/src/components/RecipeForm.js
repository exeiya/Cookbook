import React, { useState } from 'react';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { withRouter } from 'react-router-dom';
import { Form, Button, Icon, Select, Input, Grid, Image, Segment } from 'semantic-ui-react';
import { addRecipe } from '../reducers/recipeReducer';
import { notify } from '../reducers/notificationReducer';

const RecipeForm = (props) => {
  const [values, setValues] = useState({
    title: '',
    instructions: ''
  });
  const [ingredients, setIngredients] = useState([{
    id: shortid.generate(),
    name: '',
    amount: ''
  }]);
  const [ imgFile, setImgFile ] = useState();
  const [errors, setErrors] = useState({ ingredientIds: [] });

  const validationErrorStyle = {
    color: '#9f2a28'
  };

  const categoryOptions = [
    { key: 'dinner', value: 'pääruoka', text: 'Pääruoka' },
    { key: 'dessert', value: 'jälkiruoka', text: 'Jälkiruoka' },
    { key: 'salad', value: 'salaatti', text: 'Salaatti' }
  ];

  const cookingTimeOptions = [
    { key: 'minute', value: 'minuuttia', text: 'minuuttia' },
    { key: 'hour', value: 'tuntia', text: 'tuntia' }
  ];

  const validateFields = () => {
    let fieldErrors = { ...errors };
    if (values.title.length < 3) {
      fieldErrors.title = 'Reseptin nimen tulee olla vähintään 3 merkin pituinen';
    }

    if (values.instructions.length === 0) {
      fieldErrors.instructions = 'Reseptillä täytyy olla ohje';
    }

    if (!values.category) {
      fieldErrors.category = 'Valitse reseptille kategoria';
    }

    if (imgFile && (imgFile.file.size > 1000000)) {
      fieldErrors.image = 'Kuvan koko voi olla enintään 1 MB';
    } else if (imgFile && !['image/jpg', 'image/png', 'image/gif', 'image/jpeg'].includes(imgFile.file.type)) {
      fieldErrors.image = 'Vain tietyt kuvatiedostot ovat tuettuja (jpg, jpeg, png, gif)';
    }

    ingredients.forEach(ingredient => {
      const errorExists = fieldErrors.ingredientIds.includes(ingredient.id);
      if (ingredient.name.length === 0) {
        if (!errorExists) fieldErrors.ingredientIds.push(ingredient.id);
        fieldErrors.ingredients = 'Ainesosilla täytyy olla nimi';
      } else if (ingredient.name.length > 0 && errorExists) {
        fieldErrors.ingredientIds = fieldErrors.ingredientIds.filter(value => value !== ingredient.id);
      }
    });

    setErrors(fieldErrors);
    let isValid = true;
    Object.entries(fieldErrors).forEach(([key, value]) => {
      if(key === 'ingredientIds') {
        if (value.length > 0) isValid = false;
        return;
      } else if (value) {
        isValid = false;
      }
    });

    return isValid;
  };

  const addRecipe = async (event) => {
    event.preventDefault();
    const newRecipe = {
      title: values.title,
      ingredients: ingredients
        .map(ingredient => {
          return ({ name: ingredient.name, amount: ingredient.amount });
        }),
      instructions: values.instructions,
      category: values.category,
      cookingTime: null,
      servings: values.servings || null
    };

    if(values.cookingTime) {
      newRecipe.cookingTime = `${values.cookingTime} ${values.cookingTimeUnit || cookingTimeOptions[0].value}`;
    }

    if (validateFields()) {
      const recipeData = new FormData();
      if (imgFile) recipeData.append('image', imgFile.file);
      recipeData.append('recipe', JSON.stringify(newRecipe));
      try {
        await props.addRecipe(recipeData);
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

  const handleChange = (target) => {
    setValues({ ...values, [target.name]: target.value });
    setErrors({ ...errors, [target.name]: null });
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
            />
          </Form.Field>
        </td>
        <td>
          {ingredients.length > 1
            ? <Button color="orange" type="button" onClick={removeIngredient(ingredient.id)}>Poista</Button>
            : null}
        </td>
      </tr>
    );
  });

  const handleImageChange = (target) => {
    const file = target.files[0];
    setErrors({ ...errors, image: null });
    if(!file) return setImgFile(null);
    setImgFile({
      file,
      name: file.name,
      preview: URL.createObjectURL(file)
    });
  };

  const validationErrorMsg = (msg) => (
    <div style={validationErrorStyle}>
      <Icon color="yellow" name="exclamation triangle" />
      {msg}
    </div>
  );

  return (
    <Grid>
      <Grid.Row columns={1}>
        <Grid.Column>
          <div style={{ textAlign: 'center' }}>
            <h2>Luo uusi resepti</h2>
          </div>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={1} centered>
        <Grid.Column width={12}>
          <Form onSubmit={addRecipe} noValidate>
            <Grid stackable>
              <Grid.Row columns={2}>
                <Grid.Column width={10}>
                  <Form.Field  width={8} error={errors.title && true}>
                    <div>
                      <label style={{ fontWeight: 'bold' }}>Reseptin nimi</label>
                      {errors.title && validationErrorMsg(errors.title)}
                    </div>
                    <input
                      onChange={({ target }) => handleChange(target)}
                      name="title"
                      value={values.title}
                      placeholder="Reseptin nimi"
                      required />
                  </Form.Field>

                  <Form.Group grouped>
                    <table>
                      <tbody>
                        {addedIngredients.length > 0 ? <tr><th>Ainesosa</th><th>Määrä</th></tr> : null}
                        {addedIngredients}
                      </tbody>
                    </table>
                    {errors.ingredients && <div style={{ color: '#9f2a28', paddingBottom: '10px' }}>
                      <Icon color="yellow" name="exclamation triangle" /> {errors.ingredients}</div>}
                    <Button type="button" onClick={addIngredient} color="teal" style={{ marginBottom: '10px' }}>Lisää uusi ainesosa</Button>
                  </Form.Group>
                </Grid.Column>

                <Grid.Column width={6}>
                  <Form.Field error={errors.image && true}>
                    <label>Kuva {errors.image && validationErrorMsg(errors.image)}</label>
                    <label htmlFor="image" style={{ maxWidth: '200px' }}>
                      { imgFile
                        ? <Image bordered rounded src={imgFile.preview} size="medium" style={{ maxWidth: '200px', maxHeight: '200px' }}/>
                        : <Segment><Icon name="upload" /> Lataa kuva</Segment>
                      }
                    </label>
                    <input
                      style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
                      id="image"
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={({ target }) => handleImageChange(target) } />
                  </Form.Field>
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <Form.Group>
              <Form.Field width={4} error={errors.servings && true}>
                <label>Annosmäärä</label>
                <Input
                  onChange={({ target }) => handleChange(target)}
                  name="servings"
                  label={{ basic: true, content: 'annosta' }}
                  labelPosition="right"
                  type="number"
                  min="0"
                />
              </Form.Field>
              <Form.Field width={4} error={errors.cookingTime && true}>
                <label>Valmistusaika</label>
                <Input
                  onChange={({ target }) => handleChange(target)}
                  name="cookingTime"
                  type="number"
                  min="0"
                  action>
                  <input />
                  <Select
                    compact
                    options={cookingTimeOptions}
                    defaultValue={cookingTimeOptions[0].value}
                    name="cookingTimeUnit"
                    onChange={(e, target) => handleChange(target)}
                  />
                </Input>
              </Form.Field>
              <Form.Select
                onChange={(e, { value }) => setValues({ ...values, category: value })}
                onClick={() => setErrors({ ...errors, category: null })}
                error={errors.category && true}
                width={4}
                name="category"
                fluid
                label="Reseptin tyyppi"
                placeholder="Reseptin tyyppi"
                options={categoryOptions}
              />
            </Form.Group>
            {errors.servings && validationErrorMsg(errors.servings)}
            {errors.cookingTime && validationErrorMsg(errors.cookingTime)}
            {errors.category && validationErrorMsg(errors.category)}

            <Form.Field error={errors.instructions && true} >
              <div>
                <label style={{ fontWeight: 'bold' }}>Ohjeet</label>
                {errors.instructions && validationErrorMsg(errors.instructions)}
              </div>
              <textarea
                onChange={({ target }) => handleChange(target)}
                name="instructions" value={values.instructions}
                placeholder="Kirjoita reseptin ohje tähän"
                required
              />
            </Form.Field>
            <div style={{ textAlign: 'center' }}>
              <Button positive>Lisää resepti</Button>
            </div>
          </Form>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default connect(
  null,
  { addRecipe, notify }
)(withRouter(RecipeForm));