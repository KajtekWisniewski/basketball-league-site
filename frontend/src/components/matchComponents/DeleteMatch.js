import React from 'react';
import axios from 'axios';

const DeleteMatchButton = ({ matchId, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matches/${matchId}`);
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
