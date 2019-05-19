const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return {
        msg: action.msg,
        notifType: action.notifType
      };
    case 'REMOVE_NOTIFICATION':
      return null;
    default:
      return state;
  }
};

export const setNotification = (msg, notifType)  => {
  return {
    type: 'SET_NOTIFICATION',
    msg,
    notifType
  };
};

export const removeNotification = () => {
  return {
    type: 'REMOVE_NOTIFICATION'
  };
};

export const notify = (msg, notifType) => dispatch => {
  dispatch(setNotification(msg, notifType));
  setTimeout(() => dispatch(removeNotification()), 5000);
};

export default notificationReducer;