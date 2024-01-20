'use client';

import React, { useState, useEffect, createContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '@/redux/features/authActions';
import { useRouter } from 'next/navigation';
import styles from './User.module.css';
import formatDatabaseData from '@/functions/formatDatabaseData';

const RegisterForm = () => {
  const [teams, setTeams] = useState([]);
  const [loading1, setLoading] = useState(true);
  const { loading, userInfo, error, success } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [submission, setSubmission] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams`
        );
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    if (!error && submission && success) {
      router.push('/login');
      //console.log(userInfo);
    }
  }, [router, error, submission, success]);

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        password: '',
        team: teams.length > 0 ? teams[0]._id : ''
      }}
      validationSchema={Yup.object({
        name: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().required('Required'),
        team: Yup.string().required('Required')
      })}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        dispatch(registerUser(values));
        setSubmitting(false);
        if (!error) {
          setSubmission(true);
        }
      }}
    >
      <Form className={styles.loginForm}>
        <h2>REGISTER PAGE</h2>
        <div className={styles.loginDiv}>
          <label htmlFor="name">Name:</label>
          <Field className={styles.inputini} type="text" id="name" name="name" />
          <ErrorMessage name="name" component="div" />
        </div>

        <div className={styles.loginDiv}>
          <label htmlFor="email">Email:</label>
          <Field className={styles.inputini} type="email" id="email" name="email" />
          <ErrorMessage name="email" component="div" />
        </div>

        <div className={styles.loginDiv}>
          <label htmlFor="password">Password:</label>
          <Field
            className={styles.inputini}
            type="password"
            id="password"
            name="password"
          />
          <ErrorMessage name="password" component="div" />
        </div>

        {/* <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <Field type="password" id="confirmPassword" name="confirmPassword" />
          <ErrorMessage name="confirmPassword" component="div" />
        </div> */}

        <div className={styles.loginDiv}>
          <label htmlFor="team">Team:</label>
          <Field className={styles.teamsList} as="select" id="team" name="team">
            {loading1 ? (
              <option value="" disabled>
                Loading teams...
              </option>
            ) : (
              teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {formatDatabaseData(team.name)}
                </option>
              ))
            )}
          </Field>
          <ErrorMessage name="team" component="div" />
        </div>

        <button type="submit" disabled={loading} className={styles.searchButton}>
          {loading ? 'loading' : 'Register'}
        </button>
        {!error && Formik.isSubmitting && <p>registration succesfull</p>}
        {error && <p>{error}</p>}
      </Form>
    </Formik>
  );
};

export default RegisterForm;
