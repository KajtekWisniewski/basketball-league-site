'use client';

import React, { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setToken } from './features/auth-slice';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userFromLocalStorage = JSON.parse(localStorage.getItem('userInfo'));
      const tokenFromLocalStorage = localStorage.getItem('userToken');

      if (userFromLocalStorage) {
        dispatch(setCredentials(userFromLocalStorage));
      }

      if (tokenFromLocalStorage) {
        dispatch(setToken(tokenFromLocalStorage));
      }
    }
  }, [dispatch]);

  return children;
};

export default AuthInitializer;
