import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const recipes = [
  {
    id: 1,
    title: 'Mustikkapiirakka',
    ingredients: [{ name: 'mustikka' }, { name: 'piirakka' }],
    instructions: 'Tässä ohjeet mustikkapiirakan tekemiseen'
  },
  {
    id: 2,
    title: 'Makaroonilaatikko',
    ingredients: [{ name: 'makarooni' }, { name: 'jauheliha' }],
    instructions: 'Ohjeet makaroonilaatikon tekemiseen'
  },
  {
    id: 3,
    title: 'Jauhelihakastike',
    ingredients: [{ name: 'jauheliha' }, { name: 'kastike' }],
    instructions: 'Ohjeet jauhelihakastikkeen tekemiseen'
  }
];

ReactDOM.render(<App recipes={recipes} />, document.getElementById('root'));
