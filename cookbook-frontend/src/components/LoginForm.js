import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Button, Divider } from 'semantic-ui-react';
import { closeLoginModal } from '../reducers/loginModalReducer';
import { login } from '../reducers/loginReducer';
import { notify } from '../reducers/notificationReducer';

const LoginForm = (props) => {
  const [ username, setUsername] = useState();
  const [ password, setPassword ] = useState();

  const handleSubmit = (event) => {
    event.preventDefault();
    props.login(username);
    props.closeLoginModal();
    props.notify(`Tervetuloa ${username}!`, 'success');
  };

  return(
    <Modal size="tiny" open={props.loginModal}  onClose={() => props.closeLoginModal()}>
      <div style={{ padding: '40px' }}>
        <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
          <h2>Kirjaudu sisään</h2>
        </div>
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
          <Button icon="signup" content="Luo uusi käyttäjätunnus" />
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
)(LoginForm);