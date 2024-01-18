'use client';
import React, { createContext, useReducer, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '@/redux/features/authActions';
import { useRouter } from 'next/navigation';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required')
});

const LoginForm = () => {
  const { loading, userInfo, error } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const initialValues = {
    email: '',
    password: ''
  };

  useEffect(() => {
    if (userInfo) {
      router.push('/user-profile');
      //console.log(userInfo);
    }
  }, [router, userInfo]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    dispatch(userLogin(values));
    //resetForm();
    setSubmitting(false);
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

        <button type="submit" disabled={loading}>
          {loading ? 'loading' : 'Login'}
        </button>
        {!error && Formik.isSubmitting && <p>login success</p>}
        {error && <p>{error}</p>}
      </Form>
    </Formik>
  );
};

export default LoginForm;
