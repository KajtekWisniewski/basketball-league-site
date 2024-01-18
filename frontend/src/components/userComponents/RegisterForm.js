'use client';

import React, { useState, useEffect, createContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const RegisterForm = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:3001/teams');
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

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
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const response = await axios.post(
            'http://localhost:3001/users/register',
            values
          );
          console.log('Registration successful!', response.data);
        } catch (error) {
          console.error(
            'Registration failed',
            error.response?.data || 'An error occurred'
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Form>
        <div>
          <label htmlFor="name">Name:</label>
          <Field type="text" id="name" name="name" />
          <ErrorMessage name="name" component="div" />
        </div>

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

        <div>
          <label htmlFor="team">Team:</label>
          <Field as="select" id="team" name="team">
            {loading ? (
              <option value="" disabled>
                Loading teams...
              </option>
            ) : (
              teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))
            )}
          </Field>
          <ErrorMessage name="team" component="div" />
        </div>

        <button type="submit">Register</button>
      </Form>
    </Formik>
  );
};

export default RegisterForm;
