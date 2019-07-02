import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Card, Grid, Input, Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import picture from '../assets/default_picture.jpg';

const RecipeList = ({ recipes, loggedUser }) => {
  const [ filter, setfilter ] = useState('');

  const recipesToShow = filter
    ? recipes.filter(recipe => recipe.title.toLowerCase().includes(filter.toLowerCase()))
    : recipes;

  const recipeList = recipesToShow.map(recipe =>
    <Grid.Column key={recipe.id}>
      <Card as={Link} to={`/recipes/${recipe.id}`} color="teal" image={picture} header={recipe.title}/>
    </Grid.Column>
  );

  const loggedUserOptions = (
    <Grid.Row centered columns={1} stretched>
      <Grid.Column width={3}>
        <Button color="teal"><Icon name="book"/>Omat reseptit</Button>
      </Grid.Column>
      <Grid.Column width={3}>
        <Button color="orange"><Icon name="star"/>Suosikit</Button>
      </Grid.Column>
      <Grid.Column width={3}>
        <Button as={Link} to="/createNewRecipe" color="green"><Icon name="plus"/>Luo uusi resepti</Button>
      </Grid.Column>
    </Grid.Row>
  );

  return (
    <Grid >
      {loggedUser === null ? null : loggedUserOptions}
      <Grid.Row centered columns={1}>
        <Grid.Column textAlign="center" width={14}>
          <h3>Hae reseptejä</h3>
          <Input icon="search" onChange={({ target }) => setfilter(target.value)} value={filter} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row centered columns={3}>
        <Grid.Column />
        <Grid.Column width={14}>
          <Grid stackable doubling columns={3}>{recipeList}</Grid>
        </Grid.Column>
        <Grid.Column />
      </Grid.Row>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    recipes: state.recipes,
    loggedUser: state.loggedUser
  };
};

export default connect(
  mapStateToProps
)(RecipeList);