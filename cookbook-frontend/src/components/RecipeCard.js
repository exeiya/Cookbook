import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Card, Image } from 'semantic-ui-react';
import picture from '../assets/default_picture.jpg';

const RecipeCard = ({ recipe }) => {
  if (!recipe) return null;
  return (
    <Grid.Column key={recipe.id}>
      <Card as={Link} to={`/recipes/${recipe.id}`} color="teal" style={{ minHeight: '210px' }}>
        <Image src={(recipe.img && recipe.img.url) ? recipe.img.url : picture} style={{ maxHeight: '170px' }}/>
        <Card.Content>
          <Card.Header style={{ overflow: 'hidden' }}>{recipe.title}</Card.Header>
        </Card.Content>
      </Card>
    </Grid.Column>
  );
};

export default RecipeCard;