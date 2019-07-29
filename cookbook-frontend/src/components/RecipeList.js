import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Card, Grid, Input, Button, Icon, Image, Label, Dropdown } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import picture from '../assets/default_picture.jpg';

const RecipeList = ({ history, recipes, loggedUser }) => {
  const [ filter, setFilter ] = useState('');
  const [ sortBy, setSortBy ] = useState(null);

  const recipesToShow = filter
    ? recipes.filter(recipe => recipe.title.toLowerCase().includes(filter.toLowerCase()))
    : recipes;

  const sortRecipes = (recipes) => {
    if (sortBy === 'title') {
      recipes.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        if (aTitle > bTitle) {
          return 1;
        } else if (aTitle < bTitle) {
          return -1;
        }
        return 0;
      });
    } else if (sortBy === 'likes') {
      recipes.sort((a, b) => {
        return b.likes - a.likes;
      });
    } else if (sortBy === 'newest') {
      recipes.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
    }

    return recipes;
  };

  const recipeCardStyle = {
    position: 'absolute',
    zIndex: 1,
    width: '92%',
    textAlign: 'right',
    margin: '10px',
    color: 'black'
  };

  const recipeList = sortRecipes(recipesToShow).map(recipe =>
    <Grid.Column key={recipe.id}>
      <Card as={Link} to={`/recipes/${recipe.id}`} color="teal" style={{ minHeight: '230px' }}>
        <div style={recipeCardStyle}>
          <Label size="large" style={{ backgroundColor: 'rgba(232, 232, 232, 0.8)' }}>
            <Icon name="heart" color="red"/>
            {recipe.likes || 0}
          </Label>
        </div>
        <Image src={(recipe.img && recipe.img.url) ? recipe.img.url : picture} style={{ maxHeight: '200px' }} />
        <Card.Content>
          <Card.Header>
            {recipe.title}
          </Card.Header>
        </Card.Content>
      </Card>
    </Grid.Column>
  );

  const loggedUserOptions = (
    <Grid.Row centered columns={1} stretched>
      <Grid.Column width={3}>
        <Button color="teal" onClick={() => history.push({
          pathname: `/users/${loggedUser.id}`, state: { tab: 0 } })}>
          <Icon name="book"/> Omat reseptit
        </Button>
      </Grid.Column>
      <Grid.Column width={3}>
        <Button color="orange" onClick={() => history.push({
          pathname: `/users/${loggedUser.id}`, state: { tab: 1 } })}>
          <Icon name="star"/>Suosikit
        </Button>
      </Grid.Column>
      <Grid.Column width={3}>
        <Button as={Link} to="/recipes/create" color="green"><Icon name="plus"/>Luo uusi resepti</Button>
      </Grid.Column>
    </Grid.Row>
  );

  const sortOptions = [
    {
      key: 'title',
      text: 'Nimen mukaan',
      value: 'title'
    },
    {
      key: 'likes',
      text: 'Eniten tykkäyksiä',
      value: 'likes',
    },
    {
      key: 'newest',
      text: 'Viimeksi lisätyt',
      value: 'newest',
    }
  ];

  return (
    <Grid >
      {loggedUser === null ? null : loggedUserOptions}
      <Grid.Row centered columns={1}>
        <Grid.Column textAlign="center" width={14}>
          <h3>Hae reseptejä</h3>
          <Input icon="search" onChange={({ target }) => setFilter(target.value)} value={filter} />

          <div style={{ textAlign: 'right' }}><Icon name="sort alphabet down" />
            <Dropdown
              inline
              header="Järjestä reseptit"
              options={sortOptions}
              placeholder="Järjestä reseptit"
              onChange={(e, target) => setSortBy(target.value)} />
          </div>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row centered columns={3}>
        <Grid.Column />
        <Grid.Column width={14}>
          <Grid stackable doubling columns={3}>{recipeList}</Grid>
        </Grid.Column>
        <Grid.Column />
      </Grid.Row>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    recipes: state.recipes,
    loggedUser: state.loggedUser
  };
};

export default connect(
  mapStateToProps
)(withRouter(RecipeList));