import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './TrainingList.module.css';

const EditTrainingForm = ({ onSubmit, onCancel, editingTraining }) => {
  const initialValues = {
    location: editingTraining ? editingTraining.location : '',
    date: editingTraining
      ? new Date(editingTraining.date).toISOString().split('Z')[0]
      : ''
  };

  const validationSchema = Yup.object({
    location: Yup.string().required('Location is required'),
    date: Yup.date()
      .min(new Date(), 'Date must be in the future')
      .required('Date is required')
  });

  const handleSubmit = (values, { resetForm }) => {
    const editedTraining = {
      id: editingTraining._id,
      location: values.location,
      date: new Date(values.date)
    };

    onSubmit(editedTraining);

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
          <ErrorMessage name="location" component="div" className="error" />
        </label>

        <label>
          Date and Time:
          <Field type="datetime-local" name="date" />
          <ErrorMessage name="date" component="div" className="error" />
        </label>

        <button type="submit">Edit Training</button>
        <button type="button" onClick={onCancel}>
          Cancel Edit
        </button>
      </Form>
    </Formik>
  );
};

export default EditTrainingForm;
