import React from 'react';
import { connect } from 'react-redux';
import { Tab, Grid } from 'semantic-ui-react';
import RecipeCard from '../components/RecipeCard';

const User = ({ loggedUser, user, selectedTab }) => {
  if (!user) return null;

  const loggedUserProfile = loggedUser && loggedUser.id === user.id;

  const recipeGrid = (recipes) => {
    return (
      <Grid padded columns={4}>
        {recipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
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
    loggedUser: state.loggedUser
  })
)(User);