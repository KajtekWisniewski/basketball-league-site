import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTeamColor from '../../hooks/useTeamColor';
import styles from './TeamCard.module.css'
import formatDatabaseData from '../../functions/formatDatabaseData';
import PlayerPreview from '../playerComponents/PlayerPreview';
import ManageRoster from './ManageRoster';
import DeletePlayerButton from '../playerComponents/DeletePlayer';
import RemoveFromRoster from './RemoveFromRoster';

const TeamCard = ({ teamId }) => {
  const [team, setTeam] = useState(null);
  const [teamCol, setTeamCol] = useState(null)
  const teamColor = useTeamColor(teamCol);
  const [teamRoster, setTeamRoster] = useState(0);

  useEffect(() => {
    const fetchPlayerData = () => {
        axios
            .get(`http://127.0.0.1:3001/teams/${teamId}`)
            .then((response) => {
                setTeam(response.data)
                setTeamCol(response.data.name)
                setTeamRoster(response.data.roster.length)
            })
            .catch((error) => console.error('Error fetching player data:', error));
    };
    fetchPlayerData();
  }, [teamId, teamRoster]);

  //placeholder for loading
  if (!team) {
    return <div></div>;
  }

  return (
    <>
    <div className={styles.teamCard} style={{ backgroundColor: teamColor}}>
    <img className={styles.teamimg} src={team.logoLink} alt={`${team.name} logo`} />
        <div className={styles.teamBasicData}>
            <h2>{formatDatabaseData(team.name)}</h2>
            <p>City: {team.location}</p>
            <p>Conference: {formatDatabaseData(team.conference)}</p>
            <p>Division: {formatDatabaseData(team.division)}</p>
        </div>

        <div className={styles.teamStatistics}>
            <h3>Statistics:</h3>
            <p>Wins: {team.statistics.wins}</p>
            <p>Losses: {team.statistics.losses}</p>
            <p>Win Ratio: {team.statistics.winPercentage.toString().slice(0,5)}%</p>
            <p>TEST id: {team._id}</p>
        </div>
    </div>
    <div>
        <h2>Current Roster</h2>
        {team.roster.map((player, index) => (
            <>
              <PlayerPreview key={player._id} playerId={player._id} />
              <RemoveFromRoster key={index} teamId={teamId} playerId={player._id} onTeamChange={() => setTeamRoster(teamRoster-1)}></RemoveFromRoster>
              </>
          ))}
    </div>
    <ManageRoster teamId={teamId} onTeamChange={() => setTeamRoster(teamRoster+1)}></ManageRoster>
    </>
  );
};

export default TeamCard;
