import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup } from '@testing-library/react';
import RecipeCard from './RecipeCard';
import { MemoryRouter } from 'react-router-dom';

afterEach(cleanup);

test('renders recipe title', () => {
  const recipe = {
    id: '5cfe5f83c09628207ce693c7',
    title: 'Munakas',
    instructions: 'Riko munat pannuun ja paista',
    category: 'pääruoka',
    ingredients: [
      { name: 'kananmunia', amount: '2 kpl' }
    ],
  };

  const component = render(
    <MemoryRouter>
      <RecipeCard recipe={recipe} />
    </MemoryRouter>
  );

  expect(component.container).toHaveTextContent('Munakas');
});