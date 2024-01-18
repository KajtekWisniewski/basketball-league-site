'use client';
import React, { createContext, useReducer } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ACTION_TYPES_LOGIN } from '@/reducers/ActionTypes';
import { LoginScreenReducer, INITIAL_STATE } from '@/reducers/LoginScreenReducer';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required')
});

const LoginForm = () => {
  const [state, dispatch] = useReducer(LoginScreenReducer, INITIAL_STATE);

  const initialValues = {
    email: '',
    password: ''
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('http://localhost:3001/users/login', values);

      // Assuming your API returns a token on successful login
      const token = response.data.token;

      // Handle successful login, e.g., store token in local storage
      console.log('Login successful! Token:', token);
      dispatch({
        type: ACTION_TYPES_LOGIN.LOGIN,
        payload: {
          name: response.data.user.name,
          email: response.data.user.email,
          team: response.data.user.team,
          isAdmin: response.data.user.isAdmin,
          id: response.data.user._id,
          pictureLink: response.data.user.pictureLink
        }
      });
      localStorage.setItem('userInfo', JSON.stringify(state));
      resetForm();
    } catch (error) {
      // Handle login failure, e.g., show error message
      console.error('Login failed', error.response?.data || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={LoginSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <div>
          <label htmlFor="email">Email:</label>
          <Field type="email" id="email" name="email" />
          <ErrorMessage name="email" component="div" />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <Field type="password" id="password" name="password" />
          <ErrorMessage name="password" component="div" />
        </div>

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default LoginForm;
