import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTeamColor from '../hooks/useTeamColor';

const PlayerCard = ({ playerId }) => {
  const [player, setPlayer] = useState(null);
  const [team, setTeam] = useState(null)
  const teamColor = useTeamColor(team);

  useEffect(() => {
    const fetchPlayerData = () => {
        axios
            .get(`http://127.0.0.1:3001/players/${playerId}`)
            .then((response) => {
                setPlayer(response.data)
                setTeam(response.data.team)
            })
            .catch((error) => console.error('Error fetching player data:', error));
    };
    fetchPlayerData();
  }, [playerId]);

  if (!player) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: teamColor, padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
      <h2>{player.name}</h2>
      <p>Age: {player.age}</p>
      <p>Birthdate: {player.birthdate.slice(0,10)}</p>
      <p>Country of Origin: {player.countryOfOrigin.toUpperCase()}</p>
      <p>Height: {player.height} cm</p>
      <p>Team: {player.team.replace("-"," ")}</p>
      <p>Position: {player.position.replace("-"," ")}</p>
      <p>Team Number: {player.teamNumber}</p>

      <img src={player.pictureLink} alt={`${player.name}'s picture`} />

      <h3>Statistics:</h3>
      <p>Games Played: {player.statistics.gamesPlayed}</p>
      <p>Rebounds: {player.statistics.rebounds}</p>
      <p>Points: {player.statistics.points}</p>
      <p>Fouls Committed: {player.statistics.foulsCommitted}</p>
      <p>Free Throws Made: {player.statistics.freeThrowsMade}</p>
      <p>Free Throw Percentage: {player.statistics.freeThrowPercentage}</p>

      <p>Fantasy Score: {player.fantasyScore}</p>
      <p>TEST: playerid : {player._id}</p>
    </div>
  );
};

export default PlayerCard;
