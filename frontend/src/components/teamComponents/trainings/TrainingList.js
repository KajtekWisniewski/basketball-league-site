import React from 'react';
import styles from './TrainingList.module.css';

const TrainingList = ({ trainings, onEdit, editingTraining, page }) => {
  const sortedTrainings = [...trainings].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <ul className={styles.trainingList}>
      <h2>upcoming trainings</h2>
      {sortedTrainings.map((training) => (
        <li
          key={training._id}
          className={
            training._id === editingTraining?._id ? styles.editingTraining : ''
          }
        >
          {training.location} - {new Date(training.date).toLocaleString()}
          {page && <button onClick={() => onEdit(training)}>Edit</button>}
        </li>
      ))}
    </ul>
  );
};

export default TrainingList;
