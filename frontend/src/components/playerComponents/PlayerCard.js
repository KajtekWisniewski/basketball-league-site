'use client';
import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import useTeamColor from '../../hooks/useTeamColor';
import styles from './PlayerCard.module.css';
import formatDatabaseData from '../../functions/formatDatabaseData';
import DeletePlayerButton from './DeletePlayer';
import AssignToTeam from './AssignToTeam';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const PlayerCard = ({ playerId }) => {
  const [player, setPlayer] = useState(null);
  const [team, setTeam] = useState(null);
  const teamColor = useTeamColor(team);
  const [deleted, setDeleted] = useState(false);
  const [triggerRerender, setTriggerRerender] = useState(0);
  const [teamId, setTeamId] = useState(null);
  const [matchesList, setMatchesList] = useState(null);
  // do use reducera
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const fetchPlayerData = () => {
      const response1 = axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players/${playerId}`)
        .then((response) => {
          setPlayer(response.data);
          setTeam(response.data.team);
        })
        .catch((error) => console.error('Error fetching player data:', error));
      const response2 = axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/getTeamId/${playerId}`)
        .then((response) => {
          setTeamId(response.data.teamId);
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
    setTimeout(() => {
      router.push(`/players/`);
    }, '1000');
  };

  const handleTeamChange = () => {
    console.log(`Team changed for player with ID ${playerId}`);
    setTeam(player.team);
    setTriggerRerender(triggerRerender + 1);
  };

  const isPlayerTeamless = () => (team === 'teamless' ? true : false);

  return (
    <>
      {!deleted && (
        <div className={styles.playerCard} style={{ backgroundColor: teamColor }}>
          <img
            className={styles.playerimg}
            src={player.pictureLink}
            alt={`${player.name}'s picture`}
          />
          <div className={styles.playerBasicData}>
            <h2>{player.name}</h2>
            <p>Age: {player.age}</p>
            <p>Birthdate: {player.birthdate.slice(0, 10)}</p>
            <p>Country of Origin: {formatDatabaseData(player.countryOfOrigin)}</p>
            <p>Height: {player.height} cm</p>
            {!isPlayerTeamless() && (
              <Link className={styles.linkStyle} href={`/teams/${teamId}`}>
                <p>Team: {formatDatabaseData(player.team)}</p>
              </Link>
            )}
            {isPlayerTeamless() && <p>Team: {formatDatabaseData(player.team)}</p>}
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
            <p>
              Free Throw Percentage:{' '}
              {player.statistics.freeThrowPercentage.toString().slice(0, 5)}%
            </p>

            <p>Fantasy Score: {player.fantasyScore}</p>
            <p>TEST: playerid : {player._id}</p>
          </div>

          {userInfo?.user && isPlayerTeamless() && (
            <AssignToTeam
              playerId={playerId}
              onTeamChange={handleTeamChange}
            ></AssignToTeam>
          )}
          {userInfo?.user?.isAdmin && (
            <DeletePlayerButton
              playerId={playerId}
              onDelete={handlePlayerDelete}
            ></DeletePlayerButton>
          )}
        </div>
      )}
      {deleted && <p>player has been deleted successfully</p>}
    </>
  );
};

export default PlayerCard;
