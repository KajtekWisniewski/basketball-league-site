import React from 'react';
import axios from 'axios';

const DeletePlayerButton = ({ playerId, onDelete }) => {
  const handleDelete = async () => {
    try {
      //to jest glupie XDD pozatym lepiej to zrobic po stronie backendu ale narazie mi sie nie chce wiec tak zostawiam
      // jak bedzie czas to naprawie
      const teamid = await axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/getTeamId/${playerId}`)
        .then(async (response) =>
          response.data.teamId === 'teamless'
            ? console.log('XD')
            : await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/${response.data.teamId}/changeRoster`,
                { data: { playerId } }
              )
        );
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players/${playerId}`);
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
