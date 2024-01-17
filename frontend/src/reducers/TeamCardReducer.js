const ACTION_TYPES = {
  FETCH: 'FETCH',
  DELETE: 'DELETE',
  ROSTER_LENGTH_PLUS: 'ROSTER_LENGTH_PLUS',
  ROSTER_LENGTH_MINUS: 'ROSTER_LENGTH_MINUS'
};

export const INITIAL_STATE = {
  team: null,
  teamCol: '',
  teamRoster: 0,
  deleted: false
};

export const playerCardReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.FETCH:
      return {
        ...state,
        team: action.payload.team,
        teamCol: action.payload.teamCol,
        teamRoster: action.payload.rosterLength
      };
    case ACTION_TYPES.DELETE:
      return {
        ...state,
        deleted: true
      };
    case ACTION_TYPES.ROSTER_LENGTH_PLUS:
      return {
        ...state,
        teamRoster: state.teamRoster + 1
      };
    case ACTION_TYPES.ROSTER_LENGTH_MINUS:
      return {
        ...state,
        teamRoster: state.teamRoster - 1
      };
    default:
      return state;
  }
};
