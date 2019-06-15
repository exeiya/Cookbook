const loginModalReducer = (state = null, action) => {
  switch (action.type) {
    case 'OPEN_LOGIN_MODAL':
      return true;
    case 'CLOSE_LOGIN_MODAL':
      return false;
    default:
      return state;
  }
};

export const openLoginModal = () => {
  return dispatch => {
    dispatch({
      type: 'OPEN_LOGIN_MODAL'
    });
  };
};

export const closeLoginModal = () => {
  return dispatch => {
    dispatch({
      type: 'CLOSE_LOGIN_MODAL'
    });
  };
};

export default loginModalReducer;