'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import formatDatabaseData from '../../functions/formatDatabaseData';
import Link from 'next/link';

const AssignToTeam = ({ playerId, onTeamChange }) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teamsData, setTeamsData] = useState(null);

  useEffect(() => {
    const fetchTeamList = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/teams`)
        .then((response) => {
          setTeamsData(response.data);
        })
        .catch((error) => console.error('Error fetching players data:', error));
    };
    fetchTeamList();
  }, []);

  const handleTeamChange = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/${selectedTeam}/changeRoster`,
        { playerId }
      );
      console.log('Team changed successfully:', response.data);
      onTeamChange();
    } catch (error) {
      console.error('Error changing team:', error);
    }
  };

  if (!teamsData) {
    return <div>loading..</div>;
  }

  return (
    <div>
      <label htmlFor="teamSelect">Assign Team:</label>
      <select
        id="teamSelect"
        name="teamSelect"
        value={selectedTeam}
        onChange={(e) => setSelectedTeam(e.target.value)}
      >
        <option value="">Select Team</option>
        {teamsData.map((team) => (
          <option key={team._id} value={team._id}>
            {formatDatabaseData(team.name)}
          </option>
        ))}
      </select>

      <button type="button" onClick={handleTeamChange} disabled={!selectedTeam}>
        Change Team
      </button>
    </div>
  );
};

export default AssignToTeam;
