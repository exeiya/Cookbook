import loginService from '../services/login';
import recipeService from '../services/recipes';
import userService from '../services/users';

const loginReducer = (state = null, action) => {
  switch (action.type) {
    case 'INIT_LOGGED_USER':
      return { ...action.user };
    case 'LOGIN':
      return { ...action.user };
    case 'LOGOUT':
      return null;
    default:
      return state;
  }
};

export const setInitialLoggedUser = (user) => dispatch => {
  recipeService.setToken(user.token);
  userService.setToken(user.token);
  dispatch({
    type: 'INIT_LOGGED_USER',
    user: ({ id: user.id, username: user.username })
  });
};

export const login = (user) => async dispatch => {
  const loggedUser = await loginService.login(user);
  window.localStorage.setItem('loggedCookbookUser', JSON.stringify(loggedUser));
  recipeService.setToken(loggedUser.token);
  userService.setToken(loggedUser.token);
  dispatch({
    type: 'LOGIN',
    user: { id: loggedUser.id, username: loggedUser.username }
  });
};

export const logout = () => dispatch => {
  window.localStorage.clear();
  recipeService.setToken(null);
  userService.setToken(null);
  dispatch({
    type: 'LOGOUT'
  });
};

export default loginReducer;