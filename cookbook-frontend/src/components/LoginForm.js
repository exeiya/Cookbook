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
        props.notify(`Tervetuloa ${username}!`, 'success');
      } catch (error) {
        console.log(error);
        setError('Wrong username or password');
      }
    }
  };

  const onSignupClick = () => () => {
    props.closeLoginModal();
    props.history.push('/signup');
  };

  return(
    <Modal size="tiny" open={props.loginModal}  onClose={() => {
      props.closeLoginModal();
      setError(''); }
    }>
      <div style={{ padding: '40px' }}>
        <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
          <h2>Kirjaudu sisään</h2>
        </div>
        { error.length === 0 ? null : <Message negative>{error}</Message> }
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <label>Käyttäjätunnus</label>
            <Form.Input
              placeholder="Kirjoita käyttäjätunnus"
              icon="user"
              iconPosition="left"
              onChange={({ target }) => setUsername(target.value)}/>
          </Form.Field>
          <Form.Field >
            <label>Salasana</label>
            <Form.Input
              placeholder="Kirjoita salasana"
              type="password"
              icon="lock"
              iconPosition="left"
              onChange={({ target }) => setPassword(target.value)} />
          </Form.Field>
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <Button positive>Kirjaudu sisään</Button>
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