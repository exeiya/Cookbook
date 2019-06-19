const loginReducer = (state = null, action) => {
  console.log(state, action);
  switch (action.type) {
    case 'LOGIN':
      return action.user;
    case 'LOGOUT':
      return null;
    default:
      return state;
  }
};

export const login = (user) => dispatch => {
  dispatch({
    type: 'LOGIN',
    user
  });
};

export const logout = () => dispatch => {
  dispatch({
    type: 'LOGOUT'
  });
};

export default loginReducer;