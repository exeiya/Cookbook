import React from 'react';
import { Table, Grid, Image, Icon, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import picture from '../assets/default_picture.jpg';

const Recipe = ({ recipe }) => {
  if (!recipe) return null;

  return (
    <Grid stackable padded>
      <Grid.Row>
        <Grid.Column>
          <h3>{recipe.title}</h3>
          {recipe.user
            ? <div>
              <Icon name="user" />
              <Link to={`/users/${recipe.user.id}`}>{recipe.user.username}</Link>
            </div>
            : null}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={3}>
        <Grid.Column width={5}>
          <Image src={picture} size="medium" rounded/>
        </Grid.Column>
        <Grid.Column verticalAlign="bottom">
          <table style={{ paddingTop: '20px', paddingBottom: '20px' }}>
            <tbody>
              <tr>
                <td style={{ paddingRight: '10px' }}><Icon name="clock outline" /> Valmistusaika</td>
                <td> {recipe.cookingTime ? recipe.cookingTime : '--'}</td>
              </tr>
              <tr>
                <td><Icon name="utensils" /> Annosmäärä</td>
                <td>{recipe.servings ? recipe.servings : '--' }</td>
              </tr>
            </tbody>
          </table>
          <Label color={'teal'}>{recipe.category}</Label>
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