import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import useTeamColor from '../../hooks/useTeamColor';
import styles from './PlayerCard.module.css'
import formatDatabaseData from '../../functions/formatDatabaseData';
import DeletePlayerButton from './DeletePlayer';
import AssignToTeam from './AssignToTeam';
import Link from 'next/link';

const PlayerCard = ({ playerId }) => {
  const [player, setPlayer] = useState(null);
  const [team, setTeam] = useState(null)
  const teamColor = useTeamColor(team);
  const [deleted, setDeleted] = useState(false);
  const [triggerRerender, setTriggerRerender] = useState(0);
  const [teamId, setTeamId] = useState(null);

  useEffect(() => {
    const fetchPlayerData = () => {
        const response1 = axios
            .get(`http://127.0.0.1:3001/players/${playerId}`)
            .then((response) => {
                setPlayer(response.data)
                setTeam(response.data.team)
            })
            .catch((error) => console.error('Error fetching player data:', error));
          const response2 = axios
            .get(`http://127.0.0.1:3001/teams/getTeamId/${playerId}`)
            .then((response) => {
                setTeamId(response.data.teamId)
            })
            .catch((error) => console.error('Error fetching player data:', error));
      };
    fetchPlayerData();
  }, [playerId, triggerRerender]);

  //placeholder for loading
  if (!player) {
    return <div></div>;
  }

  const handlePlayerDelete = () => {
    setDeleted(true);
  };

  const handleTeamChange = () => {
    console.log(`Team changed for player with ID ${playerId}`);
    setTeam(player.team);
    setTriggerRerender(triggerRerender+1);
  };

  const isPlayerTeamless = () => team === 'teamless' ? true : false;

  return (
    <>
    {!deleted &&
    <div className={styles.playerCard} style={{ backgroundColor: teamColor}}>
        <img className={styles.playerimg} src={player.pictureLink} alt={`${player.name}'s picture`} />
        <div className={styles.playerBasicData}>
            <h2>{player.name}</h2>
            <p>Age: {player.age}</p>
            <p>Birthdate: {player.birthdate.slice(0,10)}</p>
            <p>Country of Origin: {formatDatabaseData(player.countryOfOrigin)}</p>
            <p>Height: {player.height} cm</p>
            {teamId && <Link className={styles.linkStyle} href={`/teams/${teamId}`}>
            <p>Team: {formatDatabaseData(player.team)}</p>
            </Link>}
            {!teamId && <p>Team: {formatDatabaseData(player.team)}</p>}
            <p>Position: {formatDatabaseData(player.position)}</p>
            <p>Team Number: {player.teamNumber}</p>
        </div>

        <div className={styles.playerStatistics}>
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

        <DeletePlayerButton playerId={playerId} onDelete={handlePlayerDelete}></DeletePlayerButton>
        
        { isPlayerTeamless() && <AssignToTeam playerId={playerId} onTeamChange={handleTeamChange}></AssignToTeam>}
    </div>
    }
  {deleted && <p>player has been deleted successfully</p>}
  </>
  );
};

export default PlayerCard;
