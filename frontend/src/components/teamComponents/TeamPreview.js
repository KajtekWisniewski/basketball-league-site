import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTeamColor from '../../hooks/useTeamColor';
import styles from './TeamPreview.module.css'
import formatDatabaseData from '../../functions/formatDatabaseData';
import Link from 'next/link'

const TeamPreview = ({ teamId }) => {
  const [team, setTeam] = useState(null);
  const [teamCol, setTeamCol] = useState(null)
  const teamColor = useTeamColor(teamCol);

  useEffect(() => {
    const fetchPlayerData = () => {
        axios
            .get(`http://127.0.0.1:3001/teams/${teamId}`)
            .then((response) => {
                setTeam(response.data)
                setTeamCol(response.data.name)
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
        <Link className={styles.linkStyle} href={`/teams/${team._id}`}>
            <h2>{formatDatabaseData(team.name)}</h2>
        </Link>
        <p>{team.location}</p>
        <p>{formatDatabaseData(team.conference)}</p>
        <p>{formatDatabaseData(team.division)}</p>
        <p>{team.statistics.wins}</p>
        <p>{team.statistics.losses}</p>
        <p>{team.statistics.winPercentage.toString().slice(0,5)}%</p> 
    </div>
    </>
  );
};

export default TeamPreview;
