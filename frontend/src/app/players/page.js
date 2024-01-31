'use client';
import axios from 'axios';
import PlayerPreview from '../../components/playerComponents/PlayerPreview';
import React, { useState, useEffect } from 'react';
import styles from './playersList.module.scss';
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
          <h1 className="text-xl">ADD A PLAYER</h1>
        </Link>
      )}
      <table className={styles.playersTable}>
        <thead>
          <tr className="flex flex-row gap-1 content-center border-solid border-1 border-white">
            <th>Sort By: </th>
            <button onClick={() => handleSort('name')}>Name</button>
            <button onClick={() => handleSort('age')}>Age</button>
            <button onClick={() => handleSort('team')}>Team</button>
            <button onClick={() => handleSort('teamNumber')}>Number</button>
            <button onClick={() => handleSort('position')}>Position</button>
            <button onClick={() => handleSort('height')}>Height</button>
            <button onClick={() => handleSort('birthdate')}>Birthdate</button>
            <button onClick={() => handleSort('countryOfOrigin')}>Origin</button>
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
