import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Table, Grid, Image, Icon, Label, Button, Modal } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import RecipeComments from '../components/RecipeComments';
import picture from '../assets/default_picture.jpg';
import { likeRecipe, removeRecipe } from '../reducers/recipeReducer';
import { favoriteRecipe } from '../reducers/userReducer';
import { openLoginModal } from '../reducers/loginModalReducer';
import { notify } from '../reducers/notificationReducer';

const Recipe = (props) => {
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const { recipe, likeRecipe, favoriteRecipe,
    loggedUser, isFavorited, openLoginModal, removeRecipe } = props;
  if (!recipe) return null;

  const handleClick = () => ({ target }) => {
    if (!loggedUser) {
      openLoginModal();
    } else if (target.name === 'like') {
      likeRecipe(recipe);
    } else if (target.name === 'favorite') {
      favoriteRecipe(loggedUser.id, recipe.id);
    }
  };

  const removeRecipeModal = () => (
    <Modal size="tiny" open={showRemoveModal} onClose={() => setShowRemoveModal(false)}>
      <Modal.Header>Poistetaanko resepti?</Modal.Header>
      <Modal.Content>
        <p>Haluatko varmasti poistaa reseptin
          <span style={{ fontWeight: 'bold' }}> {recipe.title}</span>?</p>
        <p>Reseptiä ei voi palauttaa enää poistamisen jälkeen.</p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setShowRemoveModal(false)}>Peruuta</Button>
        <Button
          color="red"
          icon="trash alternate"
          labelPosition="left"
          content="Poista resepti"
          onClick={handleRemove} />
      </Modal.Actions>
    </Modal>
  );

  const handleRemove = async () => {
    try {
      await removeRecipe(recipe);
      props.history.push('/recipes');
      props.notify(`Resepti "${recipe.title}" poistettu`, 'success');
    } catch (e) {
      console.log(e);
    }
  };

  const showRecipeOwnerOptions = () => {
    if (recipe.user && loggedUser && loggedUser.id === recipe.user.id) {
      return (
        <>
        <Button
          icon="edit"
          color="blue"
          labelPosition="left"
          content="Muokkaa reseptiä"
          onClick={() => props.history.push(`/recipes/${recipe.id}/update`)}
        />
          <div style={{ paddingTop: '5px' }}>
            <Button
              icon="trash alternate"
              color="red"
              labelPosition="left"
              content="Poista resepti"
              onClick={() => setShowRemoveModal(true)}
            />
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <Grid stackable padded>
      {removeRecipeModal()}
      <Grid.Row columns={2}>
        <Grid.Column width={12}>
          <h3>{recipe.title}</h3>
          {recipe.user
            ? <div>
              <Icon name="user" />
              <Link to={`/users/${recipe.user.id}`}>{recipe.user.username}</Link>
            </div>
            : null}
        </Grid.Column>
        <Grid.Column width={4}>
          {showRecipeOwnerOptions()}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={3}>
        <Grid.Column width={5}>
          <Image src={(recipe.img && recipe.img.url) ? recipe.img.url : picture} size="medium" rounded style={{ maxHeight: '240px' }}/>
        </Grid.Column>
        <Grid.Column verticalAlign="bottom">
          <Button as="div" labelPosition="left">
            <Label as="a" basic color="red" pointing="right" data-cy="recipe-likes">
              <Icon name="heart" /> {recipe.likes || 0}
            </Label>
            <Button color="red" name="like" onClick={handleClick()}>Tykkää</Button>
          </Button>
          <div style={{ marginTop: '10px' }}>
            <Button basic={isFavorited || false} color="orange" name="favorite" onClick={handleClick()}>
              <Icon name="star" /> { isFavorited ? 'Poista suosikeista' : 'Lisää suosikkeihin' }
            </Button>
          </div>
          <table style={{ paddingTop: '20px', paddingBottom: '20px' }}>
            <tbody>
              <tr>
                <td style={{ paddingRight: '10px' }}><Icon name="clock outline" /> Valmistusaika</td>
                <td> {recipe.cookingTime || '--'}</td>
              </tr>
              <tr>
                <td><Icon name="utensils" /> Annosmäärä</td>
                <td>{recipe.servings || '--' }</td>
              </tr>
            </tbody>
          </table>
          <Label color={'teal'}>{recipe.category}</Label>
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={4}>
          <Table unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan="2">Ainekset</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {recipe.ingredients.map(ingredient =>
                <Table.Row key={ingredient.name} >
                  {ingredient.amount ? <Table.Cell>{ingredient.amount}</Table.Cell> : null }
                  <Table.Cell>{ingredient.name}</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Grid.Column>
        <Grid.Column width={8}>
          <h4>Ohjeet</h4>
          <p style={{ whiteSpace: 'pre-line' }}>
            {recipe.instructions}
          </p>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={1}>
        <Grid.Column width={16} style={{ marginTop: '20px' }}>
          <RecipeComments recipe={recipe}/>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

const isFavorited = (loggedUser, users, recipe) => {
  let isFavorited = null;
  if (loggedUser && users && recipe) {
    const user = users.find(user => user.id === loggedUser.id);
    const userfavorites = user ? user.favoriteRecipes.map(r => r.id) : null;
    isFavorited = userfavorites ? userfavorites.includes(recipe.id) : null;
  }
  return isFavorited;
};

export default connect(
  (state, ownProps) => ({
    loggedUser: state.loggedUser,
    isFavorited: isFavorited(state.loggedUser, state.users, ownProps.recipe)
  }),
  { likeRecipe, favoriteRecipe, openLoginModal, removeRecipe, notify }
)(withRouter(Recipe));