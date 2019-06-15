import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Button, Divider } from 'semantic-ui-react';
import { closeLoginModal } from '../reducers/loginModalReducer';

const LoginForm = (props) => {
  const [ values, setValues ] = useState({});

  const handleSubmit = () => {
    console.log(values);
  };

  return(
    <Modal size="tiny" open={props.loginModal}  onClose={() => props.closeLoginModal()}>
      <div style={{ padding: '40px' }}>
        <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
          <h2>Kirjaudu sisään</h2>
        </div>
        <Form>
          <Form.Field>
            <label>Käyttäjätunnus</label>
            <Form.Input
              placeholder="Kirjoita käyttäjätunnus"
              icon="user"
              iconPosition="left"
              onChange={({ target }) => setValues({ ...values, username: target.value })}/>
          </Form.Field>
          <Form.Field >
            <label>Salasana</label>
            <Form.Input
              placeholder="Kirjoita salasana"
              type="password"
              icon="lock"
              iconPosition="left"
              onChange={({ target }) => setValues({ ...values, password: target.value })} />
          </Form.Field>
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <Button positive onClick={() => handleSubmit()}>Kirjaudu sisään</Button>
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
  { closeLoginModal }
)(LoginForm);