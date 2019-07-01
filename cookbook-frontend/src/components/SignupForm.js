import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Grid, Form, Button, Icon, Accordion, List } from 'semantic-ui-react';
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
  const [showAccordion, setShowAccordion] = useState(false);

  const validateFields = () => {
    const fieldErrors = {};

    if (!values.username) {
      fieldErrors.username = 'Valitse käyttäjätunnus';
    } else if (values.username.length < 3 || values.username.length > 20) {
      fieldErrors.username = 'Käyttäjätunnuksen tulee olla 3-20 merkkiä pitkä';
    } else if (!RegExp('^[a-zA-Z0-9_]*$').test(values.username)) {
      fieldErrors.username = 'Kaikki käyttäjätunnuksen merkit eivät ole sallittuja';
    }

    if (!values.password) {
      fieldErrors.password = 'Valitse salasana';
      fieldErrors.passwordConfirm = 'Valitse salasana';
    } else if (values.password.length < 10) {
      fieldErrors.password = 'Salasanan tulee olla vähintään 10 merkkiä pitkä';
    } else if (!RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.,:;-_])').test(values.password)) {
      fieldErrors.password = 'Salasanassa ei ole kaikkia vaadittuja merkkejä';
    }

    if (values.passwordConfirm !== values.password) {
      fieldErrors.passwordConfirm = 'Salasanat eivät ole samat';
    }

    let isValid = true;
    setErrors(fieldErrors);
    Object.values(fieldErrors).forEach(error => {
      if (error) {
        setShowAccordion(true);
        return isValid = false;
      }
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
      } catch (error) {
        if (error.response && error.response.data.error.type === 'USERNAME_DUPLICATE') {
          setErrors({ usernameDuplicate: 'Käyttäjätunnus on jo varattu' });
        } else {
          props.notify('Virhe käyttäjän luonnissa! Uutta käyttäjätunnusta ei luotu.', 'error');
        }
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
            <Form.Field error={(errors.username || errors.usernameDuplicate) && true}>
              <label>Käyttäjätunnus {showError('username')}{showError('usernameDuplicate')}</label>
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
            <div style={{ textAlign: 'center', paddingTop: '20px', paddingBottom: '20px' }}>
              <Button positive>Luo käyttäjätunnus</Button>
            </div>
          </Form>
          <Accordion>
            <Accordion.Title active={showAccordion} onClick={() => setShowAccordion(!showAccordion)}>
              <Icon name="question circle" />Miten täytän lomakkeen? <Icon name="dropdown" />
            </Accordion.Title>
            <Accordion.Content active={showAccordion}>
              <List>
                <List.Item>
                  <List.Header>Käyttäjätunnus</List.Header>
                  Käyttäjätunnuksen tulee olla 3-20 merkkiä pitkä ja se voi koostua kirjaimista, numeroista ja alaviivasta ( _ ).
                  Lisäksi sen tulee olla uniikki, joten et voi valita käyttäjätunnusta, joka on jo käytössä.
                </List.Item>
                <List.Item>
                  <List.Header>Salasana</List.Header>
                  Salasanan tulee olla vähintään 10 merkkiä pitkä.
                  Siinä tulee olla vähintään yksi merkki jokaisesta seuraavasta joukosta:
                  <ul>
                    <li>pieni kirjain (a-z)</li>
                    <li>iso kirjain (A-Z)</li>
                    <li>numero (0-9)</li>
                    <li>erikoismerkki (, . - _ : ;)</li>
                  </ul>
                </List.Item>
              </List>
            </Accordion.Content>
          </Accordion>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default connect(
  null,
  { createUser, notify }
)(withRouter(SignupForm));