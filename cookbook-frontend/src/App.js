import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import { initializeRecipes } from './reducers/recipeReducer';

function App(props) {
  const { initializeRecipes } = props;

  useEffect(() => {
    initializeRecipes();
  }, [initializeRecipes]);

  return (
    <div>
      <h1>Cookbook</h1>
      <RecipeForm />
      <RecipeList />
    </div>
  );
}

export default connect(
  null,
  { initializeRecipes }
)(App);
