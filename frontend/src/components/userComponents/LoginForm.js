'use client';
import React, { createContext, useReducer, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '@/redux/features/authActions';
import { useRouter } from 'next/navigation';
import styles from './User.module.css';

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
      <Form className={styles.loginForm}>
        <h2>LOGIN PAGE</h2>
        <div className={styles.loginDiv}>
          <label htmlFor="email">Email:</label>
          <Field className={styles.inputini} type="email" id="email" name="email" />
          <ErrorMessage className={styles.error} name="email" component="div" />
        </div>

        <div className={styles.loginDiv}>
          <label htmlFor="password">Password:</label>
          <Field
            className={styles.inputini}
            type="password"
            id="password"
            name="password"
          />
          <ErrorMessage className={styles.error} name="password" component="div" />
        </div>

        <button type="submit" className={styles.searchButton} disabled={loading}>
          {loading ? 'loading' : 'Login'}
        </button>
        {!error && Formik.isSubmitting && <p>login success</p>}
        {error && <p className={styles.error}>{error}</p>}
      </Form>
    </Formik>
  );
};

export default LoginForm;
