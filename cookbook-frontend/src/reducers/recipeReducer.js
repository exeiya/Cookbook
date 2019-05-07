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

export const initializeRecipes = (data) => {
  return {
    type: 'INIT_RECIPES',
    data
  };
};

export const addRecipe = (data) => {
  return {
    type: 'ADD_RECIPE',
    data
  };
};

export default recipeReducer;