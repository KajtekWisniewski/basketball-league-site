import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTeamColor from '../hooks/useTeamColor';
import styles from './PlayerPreview.module.css'
import formatDatabaseData from '../functions/formatDatabaseData';
import abbreviateTeamName from '../functions/abbreviateTeamName';
import Link from 'next/link'

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

  //placeholder for loading
  if (!player) {
    return <div></div>;
  }

  return (
    <>
        <div className={styles.playerPreviewData} style={{ backgroundColor: teamColor}}>
            <Link style={styles.linkStyle} href={`/players/${player._id}`}>
                <img className={styles.playerimg} src={player.pictureLink} alt={`${player.name}'s picture`} />
            </Link>
            <h3>{player.name}</h3>
            <p>{player.age}</p>
            <h4>{abbreviateTeamName(player.team)}</h4>
            <p>{player.teamNumber}</p>
            <p>{formatDatabaseData(player.position)}</p>
            <p>{player.height}cm</p>
            <p>{player.birthdate.slice(0,10)}</p>
            <p>{formatDatabaseData(player.countryOfOrigin)}</p>
        </div>
    </>
  );
};

export default PlayerPreview;
