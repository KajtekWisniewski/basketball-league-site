import { ACTION_TYPES_MATCH } from './ActionTypes';

export const INITIAL_STATE = {
  allteams: [],
  date: '',
  played: true,
  opponents: [
    {
      team: '',
      score: 0,
      players: []
    },
    {
      team: '',
      score: 0,
      players: []
    }
  ],
  comments: []
};

export const addMatchReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES_MATCH.FETCH_TEAMS:
      return {
        ...state,
        allteams: action.payload
      };
    case ACTION_TYPES_MATCH.SET_DATE:
      const date = action.payload;
      const isDateFromPast = new Date(date) < new Date();
      return {
        ...state,
        date,
        played: isDateFromPast
      };
    case ACTION_TYPES_MATCH.SELECT_TEAM:
      return {
        ...state,
        opponents: state.opponents.map((opponent, index) =>
          index === action.payload.opponentIndex
            ? { ...opponent, team: action.payload.selectedTeam._id }
            : opponent
        )
      };
    case ACTION_TYPES_MATCH.UPDATE_PLAYERS:
      return {
        ...state,
        opponents: state.opponents.map((opponent, index) =>
          index === action.payload.opponentIndex
            ? { ...opponent, players: action.payload.selectedPlayers }
            : opponent
        )
      };
    case ACTION_TYPES_MATCH.UPDATE_OPPONENTS:
      return {
        ...state,
        opponents: action.payload
      };
    default:
      return state;
  }
};
