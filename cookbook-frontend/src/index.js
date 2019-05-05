import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const recipes = [
  {
    id: 1,
    title: 'Mustikkapiirakka',
    ingredients: [{ name: 'mustikka', amount: '1 kpl' }, { name: 'piirakka', amount: '1 kpl' }],
    instructions: 'Tässä ohjeet mustikkapiirakan tekemiseen'
  },
  {
    id: 2,
    title: 'Makaroonilaatikko',
    ingredients: [{ name: 'makarooni', amount: '1' }, { name: 'jauheliha', amount: '1' }],
    instructions: 'Ohjeet makaroonilaatikon tekemiseen'
  },
  {
    id: 3,
    title: 'Jauhelihakastike',
    ingredients: [{ name: 'jauheliha', amount: '1' }, { name: 'kastike', amount: '1' }],
    instructions: 'Ohjeet jauhelihakastikkeen tekemiseen'
  }
];

ReactDOM.render(<App recipes={recipes} />, document.getElementById('root'));
