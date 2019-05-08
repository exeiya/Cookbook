import React from 'react';
import { Table } from 'semantic-ui-react';

const Recipe = ({ recipe }) => {
  return (
    <div style={{ border: 'solid 1px', padding: 5, margin: 5 }}>
      <h3>{recipe.title}</h3>
      <Table collapsing>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="2">Ainekset</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {recipe.ingredients.map(ingredient =>
            <Table.Row key={ingredient.name} >
              <Table.Cell>{ingredient.amount ? ingredient.amount : null}</Table.Cell>
              <Table.Cell>{ingredient.name}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      <h4>Ohjeet</h4>
      <p>{recipe.instructions}</p>
    </div>
  );
};

export default Recipe;