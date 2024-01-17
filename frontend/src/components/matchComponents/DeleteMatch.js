import React from 'react';
import axios from 'axios';

const DeleteMatchButton = ({ matchId, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:3001/matches/${matchId}`);
      console.log(`Match with ID ${matchId} deleted successfully`);
      onDelete();
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  return (
    <button type="button" onClick={handleDelete}>
      Delete Match
    </button>
  );
};

export default DeleteMatchButton;
