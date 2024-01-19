'use client';
import axios from 'axios';
import TeamPreview from '../../components/teamComponents/TeamPreview';
import React, { useState, useEffect } from 'react';
import styles from './teamsList.module.css';
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import globalStyles from '../../app/globals.css';
import { useSelector } from 'react-redux';

export default function TeamsList() {
  const [teams, setTeams] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchTeamList = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/teams`)
        .then((response) => {
          setTeams(response.data);
        })
        .catch((error) => console.error('Error fetching players data:', error));
    };
    fetchTeamList();
  }, []);

  //placeholder for loading
  if (!teams) {
    return <div></div>;
  }

  const handleSort = (field) => {
    setSortOrder((prevOrder) =>
      sortField === field ? (prevOrder === 'asc' ? 'desc' : 'asc') : 'asc'
    );
    setSortField(field);
  };

  //to change, sorting players by lastname instead of first
  const sortedTeams = [...teams].sort((a, b) => {
    const compareValue = (field) =>
      a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0;
    return sortOrder === 'asc' ? compareValue(sortField) : compareValue(sortField) * -1;
  });

  return (
    <>
      <NavBar></NavBar>
      {userInfo?.user && (
        <Link className={globalStyles.linkStyle} href={`/teams/add-team`}>
          <h1>ADD A TEAM</h1>
        </Link>
      )}
      <table className={styles.teamsTable}>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('statistics.winPercentage')}>WR</th>
            <th onClick={() => handleSort('conference')}>conference</th>
            <th onClick={() => handleSort('division')}>divison</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <div>
        {sortedTeams.map((team) => (
          <TeamPreview key={team._id} teamId={team._id} />
        ))}
      </div>
    </>
  );
}
