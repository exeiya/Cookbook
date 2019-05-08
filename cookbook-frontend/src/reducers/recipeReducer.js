import recipeService from '../services/recipes';

const recipeReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_RECIPES':
      return action.data;
    case 'ADD_RECIPE':
      return [...state, action.data ];
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

export default recipeReducer;