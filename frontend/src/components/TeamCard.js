import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTeamColor from '../hooks/useTeamColor';
import styles from './TeamCard.module.css'
import formatDatabaseData from '../functions/formatDatabaseData';
import PlayerPreview from './PlayerPreview';

const TeamCard = ({ teamId }) => {
  const [team, setTeam] = useState(null);
  const [teamCol, setTeamCol] = useState(null)
  const teamColor = useTeamColor(teamCol);

  useEffect(() => {
    const fetchPlayerData = () => {
        axios
            .get(`http://127.0.0.1:3001/teams/${teamId}`)
            .then((response) => {
                setTeam(response.data)
                setTeamCol(response.data.name.toLowerCase().replaceAll(" ", "-"))
            })
            .catch((error) => console.error('Error fetching player data:', error));
    };
    fetchPlayerData();
  }, [teamId]);

  //placeholder for loading
  if (!team) {
    return <div></div>;
  }

  return (
    <>
    <div className={styles.teamCard} style={{ backgroundColor: teamColor}}>
    <img className={styles.teamimg} src={team.logoLink} alt={`${team.name} logo`} />
        <div className={styles.teamBasicData}>
            <h2>{team.name}</h2>
            <p>City: {team.location}</p>
            <p>Conference: {formatDatabaseData(team.conference)}</p>
            <p>Division: {formatDatabaseData(team.division)}</p>
        </div>

        <div className={styles.teamStatistics}>
            <h3>Statistics:</h3>
            <p>Wins: {team.statistics.wins}</p>
            <p>Losses: {team.statistics.losses}</p>
            <p>Win Ratio: {team.statistics.winPercentage.toString().slice(0,5)}%</p>
        </div>
    </div>
    <div>
        <h2>Current Roster</h2>
        {team.roster.map((player) => (
              <PlayerPreview key={player._id} playerId={player._id} />
          ))}
    </div>
    </>
  );
};

export default TeamCard;
