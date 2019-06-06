const express = require('express');
const app = express();

const recipes = [
  {
    id: 1,
    title: 'Mustikkapiirakka',
    ingredients: [
      {
        name: 'mustikka',
        amount: '1 kpl'
      },
      {
        name: 'piirakka',
        amount: '1 kpl'
      }
    ],
    instructions: 'Yhdistä mustikka ja piirakka.',
    servings: 8,
    cookingTime: '2 tuntia',
    category: 'jälkiruoka'
  },
  {
    id: 2,
    title: 'Makaroonilaatikko',
    ingredients: [
      {
        name: 'makarooni',
        amount: '1 kpl'
      },
      {
        name: 'laatikko',
        amount: '1 kpl'
      }
    ],
    instructions: 'Laita makaroonit laatikkoon',
    servings: 6,
    cookingTime: '2 tuntia',
    category: 'pääruoka'
  }
];

app.get('/api/recipes', (req, res) => {
  res.json(recipes);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server up and running`);
});
