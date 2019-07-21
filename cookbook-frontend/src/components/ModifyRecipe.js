import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { Grid, Button } from 'semantic-ui-react';
import RecipeForm from './RecipeForm';
import { updateRecipe } from '../reducers/recipeReducer';

const ModifyRecipe = ({ recipe, updateRecipe, loggedUser }) => {
  if (!recipe) return null;
  if ( !loggedUser || !recipe.user || (recipe.user.id !== loggedUser.id)) return (<Redirect to="/recipes" />);
  return (
    <Grid>
      <Grid.Row columns={1}>
        <Grid.Column>
          <div style={{ textAlign: 'center' }}>
            <h2>Muokkaa reseptiä</h2>
          </div>
        </Grid.Column>
      </Grid.Row>
      <RecipeForm
        onSubmit={updateRecipe}
        values={recipe}
        submitButton={<Button positive>Tallenna muutokset</Button>} />
    </Grid>
  );
};

export default connect(
  state => ({
    loggedUser: state.loggedUser
  }),
  { updateRecipe }
)(withRouter(ModifyRecipe));