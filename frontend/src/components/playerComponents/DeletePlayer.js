import React from 'react';
import axios from 'axios';

const DeletePlayerButton = ({ playerId, onDelete }) => {
  const handleDelete = async () => {
    try {
      //to jest glupie XDD pozatym lepiej to zrobic po stronie backendu ale narazie mi sie nie chce wiec tak zostawiam
      // jak bedzie czas to naprawie
      const teamid = await axios
        .get(`http://127.0.0.1:3001/teams/getTeamId/${playerId}`)
        .then(async (response) =>
          response.data.teamId === 'teamless'
            ? console.log('XD')
            : await axios.delete(
                `http://127.0.0.1:3001/teams/${response.data.teamId}/changeRoster`,
                { data: { playerId } }
              )
        );
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
