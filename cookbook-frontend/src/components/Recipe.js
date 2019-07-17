import React from 'react';
import { connect } from 'react-redux';
import { Table, Grid, Image, Icon, Label, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import RecipeComments from '../components/RecipeComments';
import picture from '../assets/default_picture.jpg';
import { likeRecipe } from '../reducers/recipeReducer';
import { favoriteRecipe } from '../reducers/userReducer';
import { openLoginModal } from '../reducers/loginModalReducer';

const Recipe = (props) => {
  const { recipe, likeRecipe, favoriteRecipe,
    loggedUser, isFavorited, openLoginModal } = props;
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

  return (
    <Grid stackable padded>
      <Grid.Row>
        <Grid.Column>
          <h3>{recipe.title}</h3>
          {recipe.user
            ? <div>
              <Icon name="user" />
              <Link to={`/users/${recipe.user.id}`}>{recipe.user.username}</Link>
            </div>
            : null}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={3}>
        <Grid.Column width={5}>
          <Image src={recipe.imgUrl || picture} size="medium" rounded style={{ maxHeight: '240px' }}/>
        </Grid.Column>
        <Grid.Column verticalAlign="bottom">
          <Button as="div" labelPosition="left">
            <Label as="a" basic color="red" pointing="right">
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
  { likeRecipe, favoriteRecipe, openLoginModal }
)(Recipe);