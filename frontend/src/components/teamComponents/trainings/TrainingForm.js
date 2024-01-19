import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './TrainingList.module.css';

const AddTrainingForm = ({ onSubmit }) => {
  const initialValues = {
    location: '',
    date: ''
  };

  const validationSchema = Yup.object({
    location: Yup.string().required('Location is required'),
    date: Yup.date()
      .min(new Date(), 'Date must be in the future')
      .required('Date is required')
  });

  const handleSubmit = (values, { resetForm }) => {
    const newTraining = {
      location: values.location,
      date: new Date(values.date)
    };

    onSubmit(newTraining);

    resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form className={styles.addForm}>
        <label>
          Location:
          <Field type="text" name="location" />
          <ErrorMessage name="location" component="div" className={styles.error} />
        </label>

        <label>
          Date and Time:
          <Field type="datetime-local" name="date" />
          <ErrorMessage name="date" component="div" className={styles.error} />
        </label>

        <button type="submit">Add Training</button>
      </Form>
    </Formik>
  );
};

export default AddTrainingForm;
