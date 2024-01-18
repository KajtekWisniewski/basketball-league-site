import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, team }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      await axios.post(
        `http://localhost:3001/users/register`,
        { name, email, password, team },
        config
      );
    } catch (error) {
      // return custom error message from backend if present
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const userLogin = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // configure header's Content-Type as JSON
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const { data } = await axios.post(
        `http://localhost:3001/users/login`,
        { email, password },
        config
      );

      // store user's token in local storage
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userInfo', JSON.stringify({ user: data.user }));
      console.log(data.user);
      return data;
    } catch (error) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
