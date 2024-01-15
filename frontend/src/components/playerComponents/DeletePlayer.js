import React from 'react';
import axios from 'axios';

const DeletePlayerButton = ({ playerId, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:3001/players/${playerId}`);
      console.log(`Player with ID ${playerId} deleted successfully`);
      onDelete();
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  };

  return (
    <button type="button" onClick={handleDelete}>
      Delete Player
    </button>
  );
};

export default DeletePlayerButton;
