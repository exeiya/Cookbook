import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const Users = (props) => {
  const usersList = props.users.map(user =>
    <li key={user.id}>
      <Link to={`/users/${user.id}`}>{user.username}</Link>
    </li>
  );

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