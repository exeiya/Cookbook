import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import Recipe from './components/Recipe';
import Notification from './components/Notification';
import Dashboard from './components/Dashboard';
import MenuBar from './components/MenuBar';
import LoginForm from './components/LoginForm';
import Users from './components/Users';
import { initializeRecipes } from './reducers/recipeReducer';
import { initializeUsers } from './reducers/userReducer';

function App(props) {
  const { initializeRecipes, initializeUsers } = props;

  useEffect(() => {
    initializeRecipes();
    initializeUsers();
  }, [initializeRecipes, initializeUsers]);

  const recipeById = (id) => {
    return props.recipes.find(recipe => recipe.id === id);
  };

  return (
    <Container>
      <Router>
        <h1>Cookbook</h1>
        <MenuBar />
        <LoginForm />
        <Notification />
        <Route exact path="/" render={() => <Dashboard />} />
        <Route exact path="/recipes" render={() => <RecipeList />} />
        <Route path="/createNewRecipe" render={() => <RecipeForm />} />
        <Route exact path="/recipes/:id" render={({ match }) => <Recipe recipe={recipeById(match.params.id)}/>} />
        <Route exact path="/users" render={() => <Users />} />
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
  { initializeRecipes, initializeUsers }
)(App);
