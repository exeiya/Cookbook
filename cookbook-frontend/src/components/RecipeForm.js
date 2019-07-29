import React, { useState } from 'react';
import shortid from 'shortid';
import { withRouter } from 'react-router-dom';
import { Form, Icon, Select, Input, Grid, Image, Segment, Button } from 'semantic-ui-react';
import IngredientInputTable from './IngredientInputTable';

const RecipeForm = (props) => {
  const [values, setValues] = useState(props.values
    ? { ...props.values,
      cookingTime: props.values.cookingTime ? props.values.cookingTime.split(' ')[0] : null,
      cookingTimeUnit: props.values.cookingTime ? props.values.cookingTime.split(' ')[1] : null }
    : { title: '', instructions: '' });
  const [ingredients, setIngredients] = useState(
    props.values ? props.values.ingredients.map(i => ({ ...i, id: shortid.generate() })) :
      [{
        id: shortid.generate(),
        name: '',
        amount: ''
      }]
  );
  const [ imgFile, setImgFile ] = useState();
  const [errors, setErrors] = useState({ ingredientIds: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const recipe = {
      ...values,
      ingredients: ingredients
        .map(ingredient => {
          return ({ name: ingredient.name, amount: ingredient.amount });
        }),
    };

    if(values.cookingTime) {
      recipe.cookingTime = `${values.cookingTime} ${values.cookingTimeUnit || cookingTimeOptions[0].value}`;
    }

    if (validateFields()) {
      setIsSubmitting(true);
      let recipeData;
      if (imgFile) {
        recipeData = new FormData();
        recipeData.append('image', imgFile.file);
        recipeData.append('recipe', JSON.stringify(recipe));
      } else {
        recipeData = recipe;
      }
      let submitted;

      // If the recipe already exists, we must include the id to update it
      if (props.values) {
        submitted = await props.onSubmit(recipeData, props.values.id);
      } else {
        submitted = await props.onSubmit(recipeData);
      }

      if (submitted) {
        props.history.push('/');
      } else {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (target) => {
    setValues({ ...values, [target.name]: target.value });
    setErrors({ ...errors, [target.name]: null });
  };

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

  const showError = (field) => {
    if (errors[field]) {
      return (
        <div style={{ padding: '5px' }}>
          <Icon color="yellow" name="exclamation triangle" />
          {errors[field]}
        </div>
      );
    }
    return null;
  };

  const removeImage = () => {
    setImgFile(null);
    if (values.img) setValues({ ...values, img: null });
  };

  const imageField = () => {
    let imgSrc = null;
    if (!imgFile && values.img) {
      imgSrc = values.img.url;
    } else if (imgFile) {
      imgSrc = imgFile.preview;
    }

    return (
      <Form.Field error={errors.image && true}>
        <label>Kuva {errors.image && showError('image')}</label>
        <label htmlFor="image" style={{ maxWidth: '200px', cursor: 'pointer' }}>
          {imgSrc
            ? <Image bordered rounded src={imgSrc} size="medium" style={{ maxWidth: '200px', maxHeight: '200px' }}/>
            : <Segment><Icon name="upload" /> Lataa kuva</Segment>}
        </label>
        <input
          style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
          id="image"
          type="file"
          name="image"
          accept="image/*"
          onChange={({ target }) => handleImageChange(target) } />
        { !imgSrc ? null : <Button color="red" content="Poista kuva" icon="trash alternate" type="button"
          style={{ marginTop: '5px', marginLeft: '10%' }} onClick={removeImage}/>}
      </Form.Field>
    );
  };

  return (
    <Grid.Row columns={1} centered>
      <Grid.Column width={12}>
        <Form onSubmit={handleSubmit} noValidate>
          <Grid stackable>
            <Grid.Row columns={2}>
              <Grid.Column width={10}>
                <Form.Field  width={8} error={errors.title && true}>
                  <label>Reseptin nimi</label>
                  {errors.title && showError('title')}
                  <input
                    onChange={({ target }) => handleChange(target)}
                    name="title"
                    value={values.title}
                    placeholder="Reseptin nimi"
                    required />
                </Form.Field>
                <IngredientInputTable ingredients={ingredients} setIngredients={setIngredients} errors={errors} setErrors={setErrors} />
              </Grid.Column>

              <Grid.Column width={6}>
                {imageField()}
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
                value={values.servings || ''}
              />
            </Form.Field>
            <Form.Field width={4} error={errors.cookingTime && true}>
              <label>Valmistusaika</label>
              <Input
                onChange={({ target }) => handleChange(target)}
                name="cookingTime"
                type="number"
                min="0"
                value={values.cookingTime || ''}
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
              defaultValue={values.category}
              options={categoryOptions}
            />
          </Form.Group>
          {errors.servings && showError('servings')}
          {errors.cookingTime && showError('cookingTime')}
          {errors.category && showError('category')}

          <Form.Field error={errors.instructions && true} >
            <label>Ohjeet</label>
            {errors.instructions && showError('instructions')}
            <textarea
              onChange={({ target }) => handleChange(target)}
              name="instructions" value={values.instructions}
              placeholder="Kirjoita reseptin ohje tähän"
              required
            />
          </Form.Field>
          <div style={{ textAlign: 'center' }}>
            {props.submitButton}
            <Button
              positive
              disabled={isSubmitting}
              loading={isSubmitting}
              content={props.submitButtonText} />
          </div>
        </Form>
      </Grid.Column>
    </Grid.Row>
  );
};

export default withRouter(RecipeForm);