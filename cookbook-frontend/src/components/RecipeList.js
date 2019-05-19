import React from 'react';
import { connect } from 'react-redux';
import { Card, Grid, } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import picture from '../assets/default_picture.jpg';

const RecipeList = ({ recipes }) => {

  const recipeList = recipes.map(recipe =>
    <Grid.Column key={recipe.id}>
      <Card as={Link} to={`/recipes/${recipe.id}`} color="teal" image={picture} header={recipe.title}/>
    </Grid.Column>
  );

  return (
    <Grid centered columns={3}>
      <Grid.Column />
      <Grid.Column width={14}>
        <Grid stackable doubling columns={3}>{recipeList}</Grid>
      </Grid.Column>
      <Grid.Column />
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    recipes: state.recipes
  };
};

export default connect(
  mapStateToProps
)(RecipeList);