import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import Recipe from './components/Recipe';
import Notification from './components/Notification';
import Dashboard from './components/Dashboard';
import MenuBar from './components/MenuBar';
import LoginForm from './components/LoginForm';
import Users from './components/Users';
import SignupForm from './components/SignupForm';
import { initializeRecipes } from './reducers/recipeReducer';
import { initializeUsers } from './reducers/userReducer';
import { setInitialLoggedUser } from './reducers/loginReducer';
import { openLoginModal } from './reducers/loginModalReducer';

function App(props) {
  const { initializeRecipes,
    initializeUsers,
    setInitialLoggedUser,
    openLoginModal } = props;

  useEffect(() => {
    initializeRecipes();
    initializeUsers();
  }, [initializeRecipes, initializeUsers]);

  useEffect(() => {
    const storedLoggedUser = window.localStorage.getItem('loggedCookbookUser');
    if (storedLoggedUser) {
      const user = JSON.parse(storedLoggedUser);
      setInitialLoggedUser(user);
    }
  }, [setInitialLoggedUser]);

  const recipeById = (id) => {
    return props.recipes.find(recipe => recipe.id === id);
  };

  const showLoginModal = () => {
    openLoginModal();
    return <Redirect to="/" />;
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
        <Route path="/createNewRecipe" render={() => (
          props.loggedUser ? <RecipeForm /> : showLoginModal())}  />
        <Route exact path="/recipes/:id" render={({ match }) => <Recipe recipe={recipeById(match.params.id)}/>} />
        <Route exact path="/users" render={() => <Users />} />
        <Route exact path="/signup" render={() => (
          props.loggedUser ? <Redirect to="/" /> : <SignupForm /> )} />
      </Router>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    recipes: state.recipes,
    loggedUser: state.loggedUser
  };
};

export default connect(
  mapStateToProps,
  { initializeRecipes,
    initializeUsers,
    setInitialLoggedUser,
    openLoginModal }
)(App);
