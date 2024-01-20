import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from '@/components/userComponents/User.module.css';

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
      <Form className={styles.editForm}>
        <div className={styles.filler}></div>
        <div className={styles.loginDiv}>
          <label className={styles.inputini}>
            Location:
            <Field className={styles.inputini} type="text" name="location" />
            <ErrorMessage name="location" component="div" className="error" />
          </label>
        </div>

        <div className={styles.loginDiv}>
          <label className={styles.inputini}>
            Date and Time:
            <Field className={styles.inputini} type="datetime-local" name="date" />
            <ErrorMessage name="date" component="div" className="error" />
          </label>
        </div>

        <button className={styles.searchButton} type="submit">
          Edit Training
        </button>
        <button className={styles.searchButton} type="button" onClick={onCancel}>
          Cancel Edit
        </button>
      </Form>
    </Formik>
  );
};

export default EditTrainingForm;
