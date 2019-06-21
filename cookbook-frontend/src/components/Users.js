import React from 'react';
import { connect } from 'react-redux';

const Users = (props) => {
  const usersList = props.users.map(user => <li key={user.id}>{user.username}</li>);

  return (
    <>
      <h2>Käyttäjät</h2>
      <ul>
        {usersList}
      </ul>
    </>
  );
};

export default connect(
  state => ({
    users: state.users
  })
)(Users);