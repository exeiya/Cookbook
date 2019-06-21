import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import { openLoginModal } from '../reducers/loginModalReducer';
import { logout } from '../reducers/loginReducer';

const MenuBar = (props) => {
  const loginDropdownTrigger = (
    <span>
      <Icon name="user circle" /> {props.loggedUser}
    </span>
  );

  const loginItem = () => {
    if (props.loggedUser) {
      return (
        <Dropdown item trigger={loginDropdownTrigger}>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => props.logout()}>
              Kirjaudu ulos
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    }

    return (
      <Menu.Item name="login" onClick={() => props.openLoginModal()}>
        <Icon name="user circle outline" />
        Kirjaudu sisään
      </Menu.Item>
    );
  };

  return (
    <Menu>
      <Menu.Item as={Link} to="/" name="etusivu" />
      <Menu.Item as={Link} to="/recipes" name="reseptit" />
      <Menu.Item as={Link} to="/createNewRecipe" name="Uusi resepti" />
      <Menu.Item as={Link} to="/users" name="kayttajat">Käyttäjät</Menu.Item>
      <Menu.Menu position="right">
        {loginItem()}
      </Menu.Menu>
    </Menu>
  );
};

export default connect(
  state => ({
    loggedUser: state.loggedUser
  }),
  { openLoginModal, logout }
)(MenuBar);