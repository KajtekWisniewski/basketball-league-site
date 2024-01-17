export const INITIAL_STATE = {
  calculatedAge: 0,
  nameError: false,
  playerPage: '',
  submitted: false
};

export const addPlayerReducer = (state, action) => {
  switch (action.type) {
    case 'SUBMIT':
      return {
        ...state,
        nameError: false,
        submitted: true,
        playerPage: action.payload
      };
    case 'ERROR':
      return {
        ...state,
        nameError: true
      };
    case 'CALCULATE':
      return {
        ...state,
        calculatedAge: action.payload
      };
    default:
      return state;
  }
};
