import recipeService from '../services/recipes';

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
    const newRecipe = await recipeService.create(recipe);
    dispatch({
      type: 'ADD_RECIPE',
      data: newRecipe
    });
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

export default recipeReducer;