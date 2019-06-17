import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'semantic-ui-react';
import { openLoginModal } from '../reducers/loginModalReducer';

const MenuBar = (props) => {
  return (
    <Menu>
      <Menu.Item as={Link} to="/" name="etusivu" />
      <Menu.Item as={Link} to="/recipes" name="reseptit" />
      <Menu.Item as={Link} to="/createNewRecipe" name="Uusi resepti" />
      <Menu.Menu position="right">
        <Menu.Item name="login" onClick={() => props.openLoginModal()}>
          <Icon name="user circle outline" />
          Kirjaudu sisään
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default connect(
  null,
  { openLoginModal }
)(MenuBar);