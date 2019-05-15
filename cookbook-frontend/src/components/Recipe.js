import React from 'react';
import { Table, Grid, Image } from 'semantic-ui-react';
import picture from '../assets/default_picture.jpg';

const Recipe = ({ recipe }) => {
  if (!recipe) return null;

  return (
    <Grid centered stackable>
      <Grid.Row>
        <Grid.Column width={12}>
          <h3>{recipe.title}</h3>
          <Image src={picture} size="medium" rounded/>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={4}>
          <Table unstackable>
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
        </Grid.Column>
        <Grid.Column width={8}>
          <h4>Ohjeet</h4>
          <p>{recipe.instructions}</p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Recipe;