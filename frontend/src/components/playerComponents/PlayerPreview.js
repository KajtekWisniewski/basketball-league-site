'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTeamColor from '../../hooks/useTeamColor';
import styles from './PlayerPreview.module.scss';
import formatDatabaseData from '../../functions/formatDatabaseData';
import abbreviateTeamName from '../../functions/abbreviateTeamName';
import Link from 'next/link';
import { ClipLoader } from 'react-spinners';

const PlayerPreview = ({ playerId }) => {
  const [player, setPlayer] = useState(null);
  const [team, setTeam] = useState(null);
  const teamColor = useTeamColor(team);

  useEffect(() => {
    const fetchPlayerData = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players/${playerId}`)
        .then((response) => {
          setPlayer(response.data);
          setTeam(response.data.team);
        })
        .catch((error) => console.error('Error fetching player data:', error));
    };
    fetchPlayerData();
  }, [playerId]);

  //placeholder for loading
  if (!player) {
    return (
      <tr className="flex justify-center">
        <td className="flex justify-center">
          <div className="flex justify-center">
            <ClipLoader
              color="#ffffff"
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            ></ClipLoader>
          </div>
        </td>
      </tr>
    );
  }

  return (
    //   <>
    //     <div className={styles.playerPreviewData} style={{ backgroundColor: teamColor }}>
    //       <Link className={styles.linkStyle} href={`/players/${player._id}`}>
    //         <img
    //           className={styles.playerimg}
    //           src={player.pictureLink}
    //           alt={`${player.name}'s picture`}
    //         />
    //       </Link>
    //       <h3>{player.name}</h3>
    //       <p>{player.age}</p>
    //       <h4>{abbreviateTeamName(player.team)}</h4>
    //       <p>{player.teamNumber}</p>
    //       <p>{formatDatabaseData(player.position)}</p>
    //       <p>{player.height}cm</p>
    //       <p>{player.birthdate.slice(0, 10)}</p>
    //       <p>{formatDatabaseData(player.countryOfOrigin)}</p>
    //     </div>
    //   </>
    // );
    <tr className={styles.playerPreviewData} style={{ backgroundColor: teamColor }}>
      <td>
        <Link className={styles.linkStyle} href={`/players/${player._id}`}>
          <img
            className={styles.playerimg}
            src={player.pictureLink}
            alt={`${player.name}'s picture`}
          />
        </Link>
      </td>
      <td>
        <Link className={styles.linkStyle} href={`/players/${player._id}`}>
          <h3>{player.name}</h3>
        </Link>
      </td>
      <td>{player.age}</td>
      <td>
        <h4>{abbreviateTeamName(player.team)}</h4>
      </td>
      <td>{player.teamNumber}</td>
      <td>{formatDatabaseData(player.position)}</td>
      <td>{player.height}cm</td>
      <td>{player.birthdate.slice(0, 10)}</td>
      <td>{formatDatabaseData(player.countryOfOrigin)}</td>
    </tr>
  );
};

export default PlayerPreview;
