import React from 'react';
import { connect } from 'react-redux';
import Recipe from './Recipe';

const RecipeList = ({ recipes }) => {

  const recipeList = recipes.map(recipe =>
    <Recipe key={recipe.id} recipe={recipe} />
  );

  return (
    <>
    {recipeList}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    recipes: state
  };
};

export default connect(
  mapStateToProps
)(RecipeList);