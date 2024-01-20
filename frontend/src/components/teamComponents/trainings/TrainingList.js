import React from 'react';
import styles from '@/components/userComponents/User.module.css';

const TrainingList = ({ trainings, onEdit, editingTraining, page, onDelete }) => {
  const sortedTrainings = [...trainings].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div className={styles.editForm}>
      <div className={styles.filler}></div>
      <h2>upcoming trainings</h2>
      <div className={styles.trainingListDiv}>
        {sortedTrainings.map((training, index) => (
          <div key={index}>
            <div
              key={training._id}
              className={
                training._id === editingTraining?._id ? styles.editingTraining : ''
              }
            >
              {training.location} - {new Date(training.date).toLocaleString()}
            </div>
            <div key={training._id + index}>
              {page && (
                <button
                  className={styles.searchButton}
                  onClick={() => onEdit(training)}
                >
                  Edit
                </button>
              )}
              {page && (
                <button
                  className={styles.searchButton}
                  onClick={() => onDelete(training._id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingList;
