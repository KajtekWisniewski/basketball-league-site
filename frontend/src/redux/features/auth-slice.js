'use client';
import { createSlice } from '@reduxjs/toolkit';
import { userLogin, registerUser } from './authActions';

//TO JEST DO ZMIANY -> POWODUJE SERVER-SIDE RENDER ERRORY
// const userToken = localStorage.getItem('userToken')
//   ? localStorage.getItem('userToken')
//   : null;

// const userInfo = localStorage.getItem('userInfo')
//   ? JSON.parse(localStorage.getItem('userInfo'))
//   : null;

const userToken = null;
const userInfo = null;

// to powoduje hydration error
// const userToken =
//   typeof window !== 'undefined' && localStorage.getItem('userToken')
//     ? localStorage.getItem('userToken')
//     : null;

// const userInfo =
//   typeof window !== 'undefined' && localStorage.getItem('userInfo')
//     ? JSON.parse(localStorage.getItem('userInfo'))
//     : null;

const initialState = {
  loading: false,
  userInfo,
  userToken,
  error: null,
  success: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');
      state.loading = false;
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
    },
    setCredentials: (state, { payload }) => {
      state.userInfo = payload;
    },
    setToken: (state, payload) => {
      state.userToken = payload;
    },
    toggleModerator: (state, action) => {
      state.value.user.isAdmin = !state.value.user.isAdmin;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.userToken = action.payload.userToken;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true; // registration successful
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, setCredentials, toggleModerator, setToken } = authSlice.actions;
export default authSlice.reducer;
