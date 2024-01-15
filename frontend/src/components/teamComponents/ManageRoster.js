import React, { useState, useEffect } from 'react';
import axios from 'axios';
import formatDatabaseData from '../../functions/formatDatabaseData';
import Link from 'next/link'

const ManageRoster = ({ teamId, onTeamChange }) => {
  const [playerId, setPlayerId] = useState('');
  const [playersData, setPlayersData] = useState(null);

    useEffect(() => {
        const fetchTeamlessPlayers = () => {
          axios
          .get(`http://127.0.0.1:3001/players`)
          .then((response) => {
            setPlayersData(response.data.filter((player) => player.team === 'teamless'))
          })
          .catch((error) => console.error('Error fetching players data:', error));
        };
        fetchTeamlessPlayers();
      }, [])

  const handleTeamChange = async () => {
    try {
      const response = await axios.put(`http://127.0.0.1:3001/teams/${teamId}/changeRoster`, { playerId });
      console.log('Team changed successfully:', response.data);
      onTeamChange();
    } catch (error) {
      console.error('Error changing team:', error);
    }
  };

  if (!playersData) {
    return <div>loading..</div>;
  }

  return (
    <div>
      <label htmlFor="teamSelect">Choose a player to add to roster:</label>
      <select
        id="teamSelect"
        name="teamSelect"
        value={playerId}
        onChange={(e) => setPlayerId(e.target.value)}
      >
        <option value="">Select Team</option>
        {playersData.map((player) => (
          <option key={player._id} value={player._id}>
            {formatDatabaseData(player.name)}
          </option>
        ))}
      </select>

      <button type="button" onClick={handleTeamChange} disabled={!playerId}>
        Change Team
      </button>
    </div>
  );
};

export default ManageRoster;
