import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import { Container, Menu } from 'semantic-ui-react';

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
      <Router>
        <h1>Cookbook</h1>
        <Menu>
          <Menu.Item as={Link} to="/" name="Etusivu" />
          <Menu.Item as={Link} to="/createNewRecipe" name="Uusi resepti" />
        </Menu>
        <Route exact path="/" render={() => <RecipeList />} />
        <Route path="/createNewRecipe" render={() => <RecipeForm />} />
      </Router>
    </Container>
  );
}

export default connect(
  null,
  { initializeRecipes }
)(App);
