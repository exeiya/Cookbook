import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Modal, Form, Button, Divider, Message } from 'semantic-ui-react';
import { closeLoginModal } from '../reducers/loginModalReducer';
import { login } from '../reducers/loginReducer';
import { notify } from '../reducers/notificationReducer';

const LoginForm = (props) => {
  const [ username, setUsername] = useState();
  const [ password, setPassword ] = useState();
  const [ error, setError] = useState('');

  const validateFields = () => {
    let errorMsg = '';
    if (!username || !password) {
      errorMsg = 'Kirjoita käyttäjätunnus ja salasana kirjautuaksesi';
    }

    setError(errorMsg);
    return errorMsg.length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateFields()) {
      try {
        await props.login({ username, password });
        setUsername('');
        setPassword('');
        props.closeLoginModal();
        props.history.push('/');
        props.notify(`Tervetuloa ${username}!`, 'success');
      } catch (error) {
        console.log(error);
        setError('Väärä käyttäjätunnus tai salasana');
      }
    }
  };

  const onSignupClick = () => () => {
    props.closeLoginModal();
    setError('');
    props.history.push('/signup');
  };

  return(
    <Modal size="tiny" open={props.loginModal}  onClose={() => {
      props.closeLoginModal();
      setError(''); }
    }>
      <div style={{ padding: '40px' }} data-cy="login-form" >
        <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
          <h2>Kirjaudu sisään</h2>
        </div>
        { error.length === 0 ? null : <Message negative>{error}</Message> }
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <label>Käyttäjätunnus</label>
            <Form.Input
              placeholder="Kirjoita käyttäjätunnus"
              type="text"
              icon="user"
              iconPosition="left"
              onChange={({ target }) => setUsername(target.value)}
              data-cy="login-username" />
          </Form.Field>
          <Form.Field >
            <label>Salasana</label>
            <Form.Input
              placeholder="Kirjoita salasana"
              type="password"
              icon="lock"
              iconPosition="left"
              onChange={({ target }) => setPassword(target.value)}
              data-cy="login-password" />
          </Form.Field>
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <Button positive data-cy="login-submit">Kirjaudu sisään</Button>
          </div>
        </Form>
        <Divider />
        <div style={{ textAlign: 'center' }}>
          <p>Ei käyttäjätunnusta?</p>
          <Button icon="signup" content="Luo uusi käyttäjätunnus" onClick={onSignupClick()}/>
        </div>
      </div>
    </Modal>
  );
};

export default connect(
  state => ({
    loginModal: state.loginModal
  }),
  { closeLoginModal, login, notify }
)(withRouter(LoginForm));