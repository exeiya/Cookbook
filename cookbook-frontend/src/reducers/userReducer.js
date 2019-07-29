import userService from '../services/users';

const userReducer = (state = [], action) => {
  switch (action.type) {
    case 'INITIALIZE_USERS':
      return action.data;
    case 'ADD_USER':
      return [...state, action.data];
    case 'UPDATE_USER':
      return state.map(u => u.id !== action.data.id ? u : action.data);
    case 'ADD_RECIPE': {
      const user = state.find(u => u.id === action.data.user.id);
      if (!user) return state;
      const { id, title, category, date, img } = action.data;
      const recipes = user.recipes.concat({ id, title, category, date, img });
      return state.map(u => u.id !== user.id ? u : { ...user, recipes });
    }
    case 'UPDATE_RECIPE': {
      const user = state.find(u => u.id === action.data.user.id);
      if (!user) return state;
      const { id, title, category, date, img } = action.data;
      const recipes = user.recipes.map(r => r.id !== id ? r : { id, title, category, date, img });
      return state.map(u => u.id !== user.id ? u : { ...user, recipes });
    }
    default:
      return state;
  }
};

export const initializeUsers = () => async (dispatch) => {
  const users = await userService.getAll();
  dispatch({
    type: 'INITIALIZE_USERS',
    data: users
  });
};

export const createUser = (user) => async (dispatch) => {
  const newUser = await userService.create(user);
  dispatch({
    type: 'ADD_USER',
    data: newUser
  });
};

export const favoriteRecipe = (id, recipe) => async (dispatch) => {
  const updatedUser = await userService.updateFavoriteRecipes(id, recipe);
  dispatch({
    type: 'UPDATE_USER',
    data: updatedUser
  });
};

export default userReducer;