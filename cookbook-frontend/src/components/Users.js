import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, Icon, Card, Input, Button, Divider } from 'semantic-ui-react';

const UserCard = ({ user }) => {
  if (!user) return null;
  return (
    <Card
      color="teal"
      as={Link}
      to={`/users/${user.id}`}
      style={{ textAlign: 'center' }}>
      <Card.Content>
        <Card.Header>
          <Icon name="user outline" />
          {user.username}
        </Card.Header>
      </Card.Content>
    </Card>
  );
};

const Users = ({ users }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const searchUsers = () => {
    const matchingUsers = searchFilter.length > 0
      ? users.filter(user => user.username.toLowerCase().includes(searchFilter))
      : [];
    setSearchResult(matchingUsers);
  };

  const mostRecipes = () => {
    let sortedByRecipes = [...users];
    sortedByRecipes.sort((a, b) => {
      if (a.recipes.length < b.recipes.length) {
        return 1;
      } else if (a.recipes.length > b.recipes.length) {
        return -1;
      } else {
        return 0;
      }
    });
    return sortedByRecipes.slice(0,3);
  };

  return (
    <Grid padded>
      <Grid.Row>
        <Grid.Column>
          <h2>Käyttäjät</h2>
          <Divider />
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h3>Hae käyttäjiä</h3>
            <p>Hae käyttäjiä kirjoittamalla käyttäjätunnus tai sen osa ja klikkaa &quot;Hae&quot;.</p>
            <Input icon="search" iconPosition="left" placeholder="Kirjoita käyttäjätunnus"
              value={searchFilter}
              style={{ marginBottom: '20px'}}
              onChange={({ target }) => setSearchFilter(target.value)}
              action={<Button onClick={() => searchUsers()}>Hae</Button>}/>
            { searchResult.length === 0
              ? ''
              : <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  Käyttäjät hakusanalla &quot;{searchFilter}&quot;
              </p>}
            <Card.Group centered>{searchResult.map(user => <UserCard key={user.id} user={user} />)}</Card.Group>
          </div>
          <Divider />
          <h3>Uusimmat käyttäjät</h3>
          <Card.Group>
            {users.slice(0,3).map(user => <UserCard key={user.id} user={user} />)}
          </Card.Group>
          <h3>Eniten reseptejä lisänneet käyttäjät</h3>
          <Card.Group>
            {mostRecipes().map(user => <UserCard key={user.id} user={user} />)}
          </Card.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default connect(
  state => ({
    users: state.users
  })
)(Users);