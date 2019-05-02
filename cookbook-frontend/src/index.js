import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const recipes = [
  {
    id: 1,
    title: 'Mustikkapiirakka',
    ingredients: ['mustikka', 'piirakka'],
    instructions: 'Tässä ohjeet mustikkapiirakan tekemiseen'
  },
  {
    id: 2,
    title: 'Makaroonilaatikko',
    ingredients: ['makarooni', 'jauheliha'],
    instructions: 'Ohjeet makaroonilaatikon tekemiseen'
  },
  {
    id: 3,
    title: 'Jauhelihakastike',
    ingredients: ['jauheliha', 'kastike'],
    instructions: 'Ohjeet jauhelihakastikkeen tekemiseen'
  }
]

ReactDOM.render(<App recipes={recipes} />, document.getElementById('root'));
