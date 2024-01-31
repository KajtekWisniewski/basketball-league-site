'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTeamColor from '../../hooks/useTeamColor';
import styles from './TeamPreview.module.css';
import formatDatabaseData from '../../functions/formatDatabaseData';
import Link from 'next/link';
import { ClipLoader } from 'react-spinners';

const TeamPreview = ({ teamId }) => {
  const [team, setTeam] = useState(null);
  const [teamCol, setTeamCol] = useState(null);
  const teamColor = useTeamColor(teamCol);

  useEffect(() => {
    const fetchTeamsData = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/${teamId}`)
        .then((response) => {
          setTeam(response.data);
          setTeamCol(response.data.name);
        })
        .catch((error) => console.error('Error fetching player data:', error));
    };
    fetchTeamsData();
  }, [teamId]);

  //placeholder for loading
  if (!team) {
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
    <tr className={styles.teamCard} style={{ backgroundColor: teamColor }}>
      <td>
        <img className={styles.teamimg} src={team.logoLink} alt={`${team.name} logo`} />
      </td>
      <td>
        <Link className={styles.linkStyle} href={`/teams/${team._id}`}>
          <h2>{formatDatabaseData(team.name)}</h2>
        </Link>
      </td>
      <td>{team.location}</td>
      <td>{formatDatabaseData(team.conference)}</td>
      <td>{formatDatabaseData(team.division)}</td>
      <td>{team.statistics.wins}</td>
      <td>{team.statistics.losses}</td>
      <td>{team.statistics.winPercentage.toString().slice(0, 5)}%</td>
    </tr>
  );
};

export default TeamPreview;
