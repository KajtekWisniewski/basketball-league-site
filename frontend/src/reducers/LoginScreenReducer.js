import { ACTION_TYPES_LOGIN } from './ActionTypes';

export const INITIAL_STATE = {
  name: '',
  email: '',
  team: '',
  id: '',
  isAdmin: false,
  pictureLink: ''
};

export const LoginScreenReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES_LOGIN.LOGIN:
      return {
        name: action.payload.name,
        email: action.payload.email,
        team: action.payload.team,
        id: action.payload.id,
        isAdmin: action.payload.isAdmin,
        pictureLink: action.payload.pictureLink
      };
    case ACTION_TYPES_LOGIN.LOGOUT:
      return {
        INITIAL_STATE
      };
    case ACTION_TYPES_LOGIN.CHANGE_TEAM:
      return {
        ...state,
        team: action.payload
      };
    default:
      return {
        state
      };
  }
};
