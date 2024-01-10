import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTeamColor from '../hooks/useTeamColor';
import styles from './PlayerPreview.module.css'
import formatDatabaseData from '../functions/formatDatabaseData';
import abbreviateTeamName from '../functions/abbreviateTeamName';

const PlayerPreview = ({ playerId }) => {
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
    <>
    <div className={styles.playerPreview}>
        
        <div className={styles.playerPreviewData}>
        <img className={styles.playerimg} src={player.pictureLink} alt={`${player.name}'s picture`} />
            <h2>{player.name}</h2>
            <p>{player.age}</p>
            <p style={{ color: teamColor}}>{abbreviateTeamName(player.team)}</p>
            <p>{player.teamNumber}</p>
            <p>{formatDatabaseData(player.position)}</p>
            <p>{player.age}</p>
            <p>{player.height}cm</p>
            <p>{player.birthdate.slice(0,10)}</p>
            <p>{formatDatabaseData(player.countryOfOrigin)}</p>
        </div>
    </div>
    </>
  );
};

export default PlayerPreview;
