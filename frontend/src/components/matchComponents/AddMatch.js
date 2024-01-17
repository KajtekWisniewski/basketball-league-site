import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddMatchForm = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState({});
  const [selectedPlayers, setSelectedPlayers] = useState({});
  const [matchDate, setMatchDate] = useState('');
  const [isDateFromPast, setIsDateFromPast] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:3001/teams');
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  const handleTeamChange = (opponentIndex, teamId) => {
    setSelectedTeams((prevSelectedTeams) => ({
      ...prevSelectedTeams,
      [opponentIndex]: teamId
    }));
  };

  const handlePlayerChange = (opponentIndex, playerId) => {
    setSelectedPlayers((prevSelectedPlayers) => ({
      ...prevSelectedPlayers,
      [opponentIndex]: {
        ...prevSelectedPlayers[opponentIndex],
        [playerId]: !prevSelectedPlayers[opponentIndex]?.[playerId]
      }
    }));
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();

    setIsDateFromPast(selectedDate < currentDate);
    setMatchDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Selected Teams:', selectedTeams);
    console.log('Selected Players:', selectedPlayers);
    console.log('Match Date:', matchDate);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Match Date:</label>
        <input type="date" value={matchDate} onChange={handleDateChange} />
      </div>
      {[0, 1].map((index) => (
        <div key={index}>
          <label>{`Opponent ${index + 1} Team:`}</label>
          <select
            value={selectedTeams[index] || ''}
            onChange={(e) => handleTeamChange(index, e.target.value)}
          >
            <option value="" disabled>
              Select Team
            </option>
            {teams
              .filter((t) => t._id !== selectedTeams[1 - index])
              .map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
          </select>

          {selectedTeams[index] && (
            <div>
              <label>{`Opponent ${index + 1} Players:`}</label>
              {teams
                .find((t) => t._id === selectedTeams[index])
                ?.roster.map((player) => (
                  <div key={player._id}>
                    <input
                      type="checkbox"
                      id={`player-${player._id}`}
                      checked={selectedPlayers[index]?.[player._id] || false}
                      onChange={() => handlePlayerChange(index, player._id)}
                    />
                    <label htmlFor={`player-${player._id}`}>{player.name}</label>
                  </div>
                ))}
            </div>
          )}

          {isDateFromPast && (
            <div>
              <label>{`Opponent ${index + 1} Score:`}</label>
              <input type="number" placeholder="Score" disabled={!isDateFromPast} />
            </div>
          )}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddMatchForm;
