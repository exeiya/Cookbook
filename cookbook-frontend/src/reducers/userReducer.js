import userService from '../services/users';

const userReducer = (state = [], action) => {
  switch (action.type) {
    case 'INITIALIZE_USERS':
      return action.data;
    case 'ADD_USER':
      return [...state, action.data];
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
  try {
    const newUser = await userService.create(user);
    dispatch({
      type: 'ADD_USER',
      data: newUser
    });
  } catch (e) {
    console.log(e);
  }
};

export default userReducer;