import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Card, Grid, Input } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import picture from '../assets/default_picture.jpg';

const RecipeList = ({ recipes }) => {
  const [ filter, setfilter ] = useState('');

  const recipesToShow = filter
    ? recipes.filter(recipe => recipe.title.toLowerCase().includes(filter.toLowerCase()))
    : recipes;

  const recipeList = recipesToShow.map(recipe =>
    <Grid.Column key={recipe.id}>
      <Card as={Link} to={`/recipes/${recipe.id}`} color="teal" image={picture} header={recipe.title}/>
    </Grid.Column>
  );

  return (
    <Grid >
      <Grid.Row centered columns={1}>
        <Grid.Column textAlign="center" width={4}>
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
    recipes: state.recipes
  };
};

export default connect(
  mapStateToProps
)(RecipeList);