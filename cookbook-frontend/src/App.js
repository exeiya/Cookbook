import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { Container } from 'semantic-ui-react';

import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import { initializeRecipes } from './reducers/recipeReducer';

function App(props) {
  const { initializeRecipes } = props;

  useEffect(() => {
    initializeRecipes();
  }, [initializeRecipes]);

  return (
    <Container>
      <h1>Cookbook</h1>
      <RecipeForm />
      <RecipeList />
    </Container>
  );
}

export default connect(
  null,
  { initializeRecipes }
)(App);
