import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, cleanup, fireEvent } from '@testing-library/react';
import IngredientInputTable from './IngredientInputTable';

afterEach(cleanup);

const Wrapper = (props) => {
  const errorChange = () => {};
  const setIngredients = (ingredients) => {
    props.state.ingredients = ingredients;
  };

  return (
    <IngredientInputTable
      ingredients={props.state.ingredients}
      setIngredients={setIngredients}
      errors={props.state.errors}
      setErrors={errorChange} />
  );
};

test('Ingredient table shows ingredients', () => {
  const state = {
    ingredients: [
      { id: '1', name: 'vehnäjauho', amount: '1 dl' }
    ],
    errors: { ingredientIds: [] }
  };

  const component = render(
    <Wrapper state={state} />
  );

  const inputs = component.container.querySelectorAll('input');
  expect(inputs[0].value).toBe('vehnäjauho');
  expect(inputs[1].value).toBe('1 dl');
});

test('Shows delete buttons when at least two ingredients exist', () => {
  const state = {
    ingredients: [
      { id: '1', name: 'vehnäjauho', amount: '1 dl' },
      { id: '2', name: 'kananmuna', amount: '2 kpl' }
    ],
    errors: { ingredientIds: [] }
  };

  const component = render(
    <Wrapper state={state} />
  );

  const buttons = component.getAllByText('Poista');
  expect(buttons.length).toBe(2);
});

test('Does not show a delete button when only one ingredient exists', () => {
  const state = {
    ingredients: [
      { id: '1', name: 'vehnäjauho', amount: '1 dl' }
    ],
    errors: { ingredientIds: [] }
  };

  const component = render(
    <Wrapper state={state} />
  );

  const nonexistentButton = component.queryByText('Poista');
  expect(nonexistentButton).toBeNull();
});

test('Clicking add ingredient button adds empty ingredient to parent state', () => {
  const state = {
    ingredients: [
      { id: '1', name: 'vehnäjauho', amount: '1 dl' }
    ],
    errors: { ingredientIds: [] }
  };

  const component = render(
    <Wrapper state={state} />
  );

  const button = component.getByText('Lisää uusi ainesosa');
  fireEvent.click(button);

  expect(state.ingredients.length).toBe(2);
  expect(state.ingredients[1].id).toBeDefined();
  expect(state.ingredients[1].name).toBe('');
  expect(state.ingredients[1].amount).toBe('');
});

test('When at least two ingredients exist, ingredient can be deleted', () => {
  const state = {
    ingredients: [
      { id: '1', name: 'vehnäjauho', amount: '1 dl' },
      { id: '2', name: 'kananmuna', amount: '2 kpl' }
    ],
    errors: { ingredientIds: [] }
  };

  const component = render(
    <Wrapper state={state} />
  );

  const buttons = component.getAllByText('Poista');
  fireEvent.click(buttons[0]);

  const ingredientsNames = state.ingredients.map(i => i.name);
  expect(ingredientsNames).not.toContain('vehnäjauho');
  expect(state.ingredients.length).toBe(1);
});

test('Modifying ingredient updates parent state', () => {
  const state = {
    ingredients: [
      { id: '1', name: 'vehnäjauho', amount: '1 dl' }
    ],
    errors: { ingredientIds: [] }
  };

  const component = render(
    <Wrapper state={state} />
  );

  const inputs = component.container.querySelectorAll('input');

  fireEvent.change(inputs[0], { target: { value: 'leivinjauhe' } });
  expect(state.ingredients[0].name).toBe('leivinjauhe');
  fireEvent.change(inputs[1], { target: { value: '2 tl' } });
  expect(state.ingredients[0].amount).toBe('2 tl');
});
