const ACTION_TYPES = {
  SUBMIT: 'SUBMIT',
  ERROR: 'ERROR',
  CALCULATE: 'CALCULATE'
};

export const INITIAL_STATE = {
  calculatedAge: 0,
  nameError: false,
  playerPage: '',
  submitted: false
};

export const addPlayerReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SUBMIT:
      return {
        ...state,
        nameError: false,
        submitted: true,
        playerPage: action.payload
      };
    case ACTION_TYPES.ERROR:
      return {
        ...state,
        nameError: true
      };
    case ACTION_TYPES.CALCULATE:
      return {
        ...state,
        calculatedAge: action.payload
      };
    default:
      return state;
  }
};
