import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RemoveFromRoster = ({ teamId, playerId, onTeamChange }) => {

  const handleTeamChange = async () => {
    try {
      const response = await axios.delete(`http://127.0.0.1:3001/teams/${teamId}/changeRoster`, { data: { playerId } });
      console.log('Team changed successfully:', response.data);
      onTeamChange();
    } catch (error) {
      console.error('Error removing from a team:', error);
    }
  };

  return (
    <div>
      <button type="button" onClick={handleTeamChange}>
        Remove from roster
      </button>
    </div>
  );
};

export default RemoveFromRoster;
