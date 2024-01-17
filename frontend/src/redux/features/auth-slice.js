import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    isAuth: false,
    username: '',
    uid: '',
    isModerator: false
  }
};

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: () => {
      return initialState;
    },
    logIn: (state, action) => {
      return {
        value: {
          isAuth: true,
          username: action.payload,
          uid: 'someId',
          isModerator: false
        }
      };
    },
    toggleModerator: (state, action) => {
      state.value.isModerator = !state.value.isModerator;
    }
  }
});

export const { logIn, logOut, toggleModerator } = auth.actions;
export default auth.reducer;
