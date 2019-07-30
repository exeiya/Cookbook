import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Tab, Grid, Button, Modal } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { removeUser } from '../reducers/userReducer';
import { notify } from '../reducers/notificationReducer';

const User = ({ loggedUser, user, selectedTab, removeUser, history, notify }) => {
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  if (!user) return null;

  const loggedUserProfile = loggedUser && loggedUser.id === user.id;

  const recipeGrid = (recipes) => {
    return (
      <Grid padded stackable columns={4}>
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

  const handleRemove = async () => {
    setShowRemoveModal(false);
    try {
      await removeUser(user.id);
      history.push('/');
      notify('Käyttäjätili poistettu!', 'success');
    } catch (error) {
      notify('Käyttäjätilin poistaminen ei onnistunut', 'error');
    }
  };

  const removeUserModal = () => (
    <Modal size="tiny" open={showRemoveModal} onClose={() => setShowRemoveModal(false)}>
      <Modal.Header>Poistetaanko käyttäjätili?</Modal.Header>
      <Modal.Content>
        <p>Haluatko varmasti poistaa käyttäjätilisi?
          Jos poistat käyttäjän, et voi enää kirjautua sisään, luoda reseptejä, muokata aiemmin luomiasi reseptejä jne.
        </p>
        <p>
          Käyttäjän poistaminen on peruuttamatonta, eikä poistettua käyttäjää voida enää palauttaa.
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setShowRemoveModal(false)}>Peruuta</Button>
        <Button
          color="red"
          icon="user delete"
          labelPosition="left"
          content="Poista käyttäjä"
          onClick={handleRemove} />
      </Modal.Actions>
    </Modal>
  );

  const showRemoveButton = () => {
    if (user && loggedUser && loggedUser.id === user.id) {
      return (
        <Button
          icon="user delete"
          color="red"
          labelPosition="left"
          content="Poista käyttäjätili"
          style={{ marginBottom: '-100px', float: 'right' }} 
          onClick={() => setShowRemoveModal(true)}/>
      );
    }
  };

  return (
    <>
      {removeUserModal()}
      <h2>{user.username}</h2>
      {showRemoveButton()}
      <Tab panes={panesToShow} defaultActiveIndex={selectedTab ? Number(selectedTab.tab) || 0 : 0} />
    </>
  );
};

export default connect(
  state => ({
    loggedUser: state.loggedUser
  }),
  { removeUser, notify }
)(withRouter(User));