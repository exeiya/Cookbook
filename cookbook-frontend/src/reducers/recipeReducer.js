import recipeService from '../services/recipes';
import { notify } from '../reducers/notificationReducer';

const recipeReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_RECIPES':
      return action.data;
    case 'ADD_RECIPE':
      return [...state, action.data ];
    case 'LIKE_RECIPE': {
      const likedRecipe = action.data;
      return state.map(r => r.id === likedRecipe.id ? likedRecipe : r);
    }
    case 'ADD_COMMENT': {
      const recipe = action.data;
      return state.map(r => r.id === recipe.id
        ? { ...recipe, comments: recipe.comments }
        : r);
    }
    case 'REMOVE_RECIPE': {
      const removedRecipe = action.data;
      return state.filter(r => r.id !== removedRecipe.id);
    }
    case 'UPDATE_RECIPE': {
      const updatedRecipe = action.data;
      return state.map(r => r.id === updatedRecipe.id
        ? updatedRecipe : r);
    }
    default:
      return state;
  }
};

export const initializeRecipes = () => {
  return async dispatch => {
    const recipes = await recipeService.getAll();
    dispatch({
      type: 'INIT_RECIPES',
      data: recipes
    });
  };
};

export const addRecipe = (recipe) => {
  return async dispatch => {
    try {
      const newRecipe = await recipeService.create(recipe);
      dispatch({
        type: 'ADD_RECIPE',
        data: newRecipe
      });
      dispatch(notify(`Uusi resepti '${newRecipe.title}' lisätty!`, 'success'));
      return true;
    } catch (error) {
      console.log(error);
      dispatch(notify('Virhe reseptin luonnissa! Uutta reseptiä ei luotu.', 'error'));
      return false;
    }
  };
};

export const likeRecipe = (recipe) => {
  return async dispatch => {
    const likedRecipe = await recipeService.likeRecipe(recipe);
    dispatch({
      type: 'LIKE_RECIPE',
      data: likedRecipe
    });
  };
};

export const addComment = (recipe, comment) => {
  return async dispatch => {
    const updatedRecipe = await recipeService.addComment(recipe, comment);
    dispatch({
      type: 'ADD_COMMENT',
      data: updatedRecipe
    });
  };
};

export const removeRecipe = (recipe) => {
  return async dispatch => {
    await recipeService.removeRecipe(recipe.id);
    dispatch({
      type: 'REMOVE_RECIPE',
      data: recipe
    });
  };
};

export const updateRecipe = (recipe) => {
  return async dispatch => {
    try {
      const updatedRecipe = await recipeService.update(recipe);
      dispatch({
        type: 'UPDATE_RECIPE',
        data: updatedRecipe
      });
      dispatch(notify(`Reseptin ${updatedRecipe.title} muutokset tallennettu!`, 'success'));
      return true;
    } catch (error) {
      console.log(error);
      dispatch(notify('Reseptin muokkaaminen ei onnistunut, muutoksia ei tallennettu', 'error'));
      return false;
    }
  };
};

export default recipeReducer;