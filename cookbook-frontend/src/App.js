import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Container, Menu } from 'semantic-ui-react';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import Recipe from './components/Recipe';
import Notification from './components/Notification';
import Dashboard from './components/Dashboard';
import { initializeRecipes } from './reducers/recipeReducer';

function App(props) {
  const { initializeRecipes } = props;

  useEffect(() => {
    initializeRecipes();
  }, [initializeRecipes]);

  const recipeById = (id) => {
    return props.recipes.find(recipe => recipe.id === id);
  };

  return (
    <Container>
      <Router>
        <h1>Cookbook</h1>
        <Menu>
          <Menu.Item as={Link} to="/" name="Etusivu" />
          <Menu.Item as={Link} to="/recipes" name="Reseptit" />
          <Menu.Item as={Link} to="/createNewRecipe" name="Uusi resepti" />
        </Menu>
        <Notification />
        <Route exact path="/" render={() => <Dashboard />} />
        <Route exact path="/recipes" render={() => <RecipeList />} />
        <Route path="/createNewRecipe" render={() => <RecipeForm />} />
        <Route exact path="/recipes/:id" render={({ match }) => <Recipe recipe={recipeById(match.params.id)}/>} />
      </Router>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    recipes: state.recipes
  };
};

export default connect(
  mapStateToProps,
  { initializeRecipes }
)(App);
