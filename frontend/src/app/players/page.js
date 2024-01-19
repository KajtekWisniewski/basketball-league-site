'use client';
import axios from 'axios';
import PlayerPreview from '../../components/playerComponents/PlayerPreview';
import React, { useState, useEffect } from 'react';
import styles from './playersList.module.css';
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import globalStyles from '../../app/globals.css';
import { useSelector } from 'react-redux';

export default function PlayersList() {
  const [players, setPlayers] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPlayersList = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players`)
        .then((response) => {
          setPlayers(response.data);
        })
        .catch((error) => console.error('Error fetching players data:', error));
    };
    fetchPlayersList();
  }, []);

  //placeholder for loading
  if (!players) {
    return <div></div>;
  }

  const handleSort = (field) => {
    setSortOrder((prevOrder) =>
      sortField === field ? (prevOrder === 'asc' ? 'desc' : 'asc') : 'asc'
    );
    setSortField(field);
  };

  //to change, sorting players by lastname instead of first
  const sortedPlayers = [...players].sort((a, b) => {
    const compareValue = (field) =>
      a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0;
    return sortOrder === 'asc' ? compareValue(sortField) : compareValue(sortField) * -1;
  });

  return (
    <>
      <NavBar></NavBar>
      {userInfo?.user && (
        <Link className={globalStyles.linkStyle} href={`/players/add-player`}>
          <h1>ADD A PLAYER</h1>
        </Link>
      )}
      <table className={styles.playersTable}>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('age')}>Age</th>
            <th onClick={() => handleSort('team')}>Team</th>
            <th onClick={() => handleSort('teamNumber')}>Number</th>
            <th onClick={() => handleSort('position')}>Position</th>
            <th onClick={() => handleSort('height')}>Height</th>
            <th onClick={() => handleSort('birthdate')}>Birthdate</th>
            <th onClick={() => handleSort('countryOfOrigin')}>Origin</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <div>
        {sortedPlayers.map((player) => (
          <PlayerPreview key={player._id} playerId={player._id} />
        ))}
      </div>
    </>
  );
}
