import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import TrainingForm from './TrainingForm';
import TrainingList from './TrainingList';
import EditTrainingForm from './EditTrainingForm';

const TrainingManager = ({ teamId, page }) => {
  const [socket, setSocket] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [editingTraining, setEditingTraining] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');

    newSocket.emit('joinTrainingRoom', teamId);

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [teamId]);

  useEffect(() => {
    if (socket) {
      socket.on('initialTrainings', (initialTrainings) => {
        setTrainings(initialTrainings);
      });

      socket.on('updatedTrainings', (updatedTrainings) => {
        setTrainings(updatedTrainings);
      });
    }
  }, [socket]);

  const handleTrainingSubmit = (newTraining) => {
    if (socket) {
      socket.emit('addTraining', teamId, newTraining);
    }
  };

  const handleTrainingEdit = (training) => {
    setEditingTraining(training);
  };

  const handleEditSubmit = (updatedTraining) => {
    if (socket) {
      socket.emit('editTraining', teamId, updatedTraining);
      setEditingTraining(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTraining(null);
  };

  return (
    <>
      {page ? (
        <div>
          <TrainingForm onSubmit={handleTrainingSubmit} />
          <TrainingList
            trainings={trainings}
            onEdit={handleTrainingEdit}
            editingTraining={editingTraining}
            page={page}
          />
          {editingTraining && (
            <EditTrainingForm
              key={editingTraining._id}
              onSubmit={handleEditSubmit}
              onCancel={handleCancelEdit}
              editingTraining={editingTraining}
            />
          )}
        </div>
      ) : (
        <TrainingList trainings={trainings} page={page} />
      )}
    </>
  );
};

export default TrainingManager;
