import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import RecipeForm from './RecipeForm';
import { addRecipe } from '../reducers/recipeReducer';

const CreateRecipe = (props) => {

  return (
    <Grid>
      <Grid.Row columns={1}>
        <Grid.Column>
          <div style={{ textAlign: 'center' }}>
            <h2>Luo uusi resepti</h2>
          </div>
        </Grid.Column>
      </Grid.Row>
      <RecipeForm
        onSubmit={props.addRecipe}
        submitButtonText="Lisää resepti"
        redirectPathOnSubmit="/recipes" />
    </Grid>
  );
};

export default connect(
  null,
  { addRecipe }
)(CreateRecipe);