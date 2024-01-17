import React from 'react';
import axios from 'axios';

const DeleteTeamButton = ({ teamId, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:3001/teams/${teamId}`);
      console.log(`Team with ID ${teamId} deleted successfully`);
      onDelete();
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  return (
    <button type="button" onClick={handleDelete}>
      Delete Team
    </button>
  );
};

export default DeleteTeamButton;
