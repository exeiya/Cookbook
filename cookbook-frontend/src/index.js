import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import App from './App';
import recipeReducer from './reducers/recipeReducer';
import notificationReducer from './reducers/notificationReducer';
import loginModalReducer from './reducers/loginModalReducer';
import loginReducer from './reducers/loginReducer';
import userReducer from './reducers/userReducer';

const reducer = combineReducers({
  recipes: recipeReducer,
  notification: notificationReducer,
  loginModal: loginModalReducer,
  loggedUser: loginReducer,
  users: userReducer,
});

const store = createStore(reducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
