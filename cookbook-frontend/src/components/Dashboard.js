import React from 'react';
import { connect } from 'react-redux';
import { Grid, } from 'semantic-ui-react';
import RecipeCard from '../components/RecipeCard';

const Dashboard = ({ recipes }) => {

  const getRandomRecipes = () => {
    let randomArray = [];
    for (let i = 0; i < 4; i++) {
      const random = Math.floor(Math.random() * recipes.length);
      if (!randomArray.includes(random)) {
        randomArray.push(random);
      }
    }
    return randomArray.map(random => RecipeCard(recipes[random]));
  };

  const getNewestRecipes = () => {
    let newestRecipes = new Array(4);
    for (let i = 0; i < newestRecipes.length; i++) {
      newestRecipes[i] = RecipeCard(recipes[recipes.length-i-1]);
    }
    return newestRecipes;
  };

  return (
    <Grid padded>
      <Grid.Row columns={1}>
        <Grid.Column width={12}>
          <p>Keittokirjassa tällä hetkellä {recipes.length} reseptiä!</p>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row >
        <Grid.Column>
          <h3>Satunnaisia reseptejä</h3>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{ padding: 0, margin: 0 }}>
        <Grid doubling columns={4} style={{ padding: 0, margin: 0 }}>
          {getRandomRecipes()}
        </Grid>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <h3>Uusimmat reseptit</h3>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{ padding: 0, margin: 0 }}>
        <Grid doubling columns={4} style={{ padding: 0, margin: 0 }}>
          {getNewestRecipes()}
        </Grid>
      </Grid.Row>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    recipes: state.recipes
  };
};

export default connect(
  mapStateToProps
)(Dashboard);