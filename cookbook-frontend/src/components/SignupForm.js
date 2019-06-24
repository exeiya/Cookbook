import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Grid, Form, Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { createUser } from '../reducers/userReducer';
import { notify } from '../reducers/notificationReducer';

const SignupForm = (props) => {
  const [values, setValues] = useState({
    username: '',
    password: '',
    passwordConfirm: ''
  });
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const fieldErrors = {};

    if (!values.username) {
      fieldErrors.username = 'Valitse käyttäjätunnus';
    } else if (values.username.length < 3) {
      fieldErrors.username = 'Käyttäjätunnuksen tulee olla vähintään 3 merkin pituinen';
    }

    if (!values.password) {
      fieldErrors.password = 'Valitse salasana';
      fieldErrors.passwordConfirm = 'Valitse salasana';
    }

    if (values.passwordConfirm !== values.password) {
      fieldErrors.passwordConfirm = 'Salasanat eivät ole samat';
    }

    let isValid = true;
    setErrors(fieldErrors);
    Object.values(fieldErrors).forEach(error => {
      if (error) return isValid = false;
    });
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateFields()) {
      try {
        await props.createUser({
          username: values.username,
          password: values.password
        });
        setValues({ username: '', password: '', passwordConfirm: '' });
        props.history.push('/');
        props.notify('Rekisteröityminen onnistui! Voit nyt kirjautua sisään käyttäjätunnuksellasi.', 'success');
      } catch (e) {
        console.log(e);
        props.notify('Virhe käyttäjän luonnissa! Uutta käyttäjätunnusta ei luotu.', 'error');
      }
    }
  };

  const handleChange = ({ target }) => {
    setValues({ ...values, [target.name]: target.value });
    setErrors({ ...errors, [target.name]: null });
  };

  const showError = (field) => {
    if (errors[field]) {
      return (
        <div style={{ float: 'right' }}>
          <Icon color="yellow" name="exclamation triangle" />
          {errors[field]}
        </div>
      );
    }
    return null;
  };

  return (
    <Grid padded>
      <Grid.Row centered columns={1}>
        <h2>Rekisteröidy</h2>
        <Grid.Column width={8}>
          <Form onSubmit={handleSubmit}>
            <Form.Field error={errors.username && true}>
              <label>Käyttäjätunnus {showError('username')}</label>
              <input
                placeholder="Kirjoita käyttäjätunnus"
                name="username"
                value={values.username}
                onChange={handleChange} />
            </Form.Field>
            <Form.Field error={errors.password && true}>
              <label>Salasana {showError('password')}</label>
              <input
                placeholder="Kirjoita salasana"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange} />
            </Form.Field>
            <Form.Field error={errors.passwordConfirm && true}>
              <label>Vahvista salasana {showError('passwordConfirm')}</label>
              <input
                placeholder="Kirjoita salasana uudelleen"
                type="password"
                name="passwordConfirm"
                value={values.passwordConfirm}
                onChange={handleChange} />
            </Form.Field>
            <div style={{ textAlign: 'center', paddingTop: '20px' }}>
              <Button positive>Luo käyttäjätunnus</Button>
            </div>
          </Form>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default connect(
  null,
  { createUser, notify }
)(withRouter(SignupForm));