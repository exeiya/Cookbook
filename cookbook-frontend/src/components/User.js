import React from 'react';
import { connect } from 'react-redux';
import { Tab, Card, Image, Grid } from 'semantic-ui-react';
import picture from '../assets/default_picture.jpg';
import { Link } from 'react-router-dom';

const User = ({ loggedUser, user, selectedTab }) => {
  if (!user) return null;

  const loggedUserProfile = loggedUser && loggedUser.id === user.id;

  const recipeCard = (recipe) => {
    if (!recipe) return null;
    return (
      <Grid.Column key={recipe.id}>
        <Card as={Link} to={`/recipes/${recipe.id}`} color="teal">
          <Image src={picture} />
          <Card.Content>
            <Card.Header style={{ overflow: 'hidden' }}>{recipe.title}</Card.Header>
          </Card.Content>
        </Card>
      </Grid.Column>
    );
  };

  const recipeGrid = (recipes) => {
    return (
      <Grid padded columns={4}>
        {recipes.map(recipe => recipeCard(recipe))}
      </Grid>
    );
  };

  const paneStyle = {
    minHeight: '200px',
    marginBottom: '20px'
  };

  const recipePane = <Tab.Pane style={paneStyle}>
    {user.recipes.length === 0 ? 'Ei lisättyjä reseptejä' : recipeGrid(user.recipes)}
  </Tab.Pane>;

  const favoritesPane = <Tab.Pane style={paneStyle}>
    {user.favoriteRecipes.length === 0 ? 'Ei suosikkireseptejä' : recipeGrid(user.favoriteRecipes)}
  </Tab.Pane>;

  const panesToShow = loggedUserProfile
    ? [{ menuItem: { key: 'all', icon: 'book', content: 'Omat reseptit' }, render: () => recipePane },
      { menuItem: { key: 'favorites', icon: 'star', content: 'Suosikit' }, render: () => favoritesPane }]
    : [{ menuItem: { key: 'all', icon: 'book', content: 'Käyttäjän reseptit' }, render: () => recipePane }];

  return (
    <>
      <h2>{user.username}</h2>
      <Tab panes={panesToShow} defaultActiveIndex={selectedTab ? Number(selectedTab.tab) || 0 : 0} />
    </>
  );
};


export default connect(
  state => ({
    loggedUser: state.loggedUser,
  })
)(User);