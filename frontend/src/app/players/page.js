'use client';
import axios from 'axios';
import PlayerPreview from '../../components/playerComponents/PlayerPreview';
import React, { useState, useEffect } from 'react';
import styles from './playersList.module.scss';
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import globalStyles from '../../app/globals.css';
import { useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';

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
    return (
      <>
        <NavBar></NavBar>
        <div className="flex justify-center">
          <ClipLoader
            color="#ffffff"
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          ></ClipLoader>
        </div>
      </>
    );
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
          <h1 className="text-3xl">ADD A PLAYER</h1>
        </Link>
      )}
      <table className={styles.playersTable}>
        <thead>
          <tr className="flex flex-row gap-1 content-center border-solid border-1 border-white">
            <th>Sort By:</th>
            <th className="text-6xl">{sortOrder === 'asc' ? '↑' : '↓'}</th>
            <td>
              <button onClick={() => handleSort('name')}>Name</button>
            </td>
            <td>
              <button onClick={() => handleSort('age')}>Age</button>
            </td>
            <td>
              <button onClick={() => handleSort('team')}>Team</button>
            </td>
            <td>
              <button onClick={() => handleSort('teamNumber')}>Number</button>
            </td>
            <td>
              <button onClick={() => handleSort('position')}>Position</button>
            </td>
            <td>
              <button onClick={() => handleSort('height')}>Height</button>
            </td>
            <td>
              <button onClick={() => handleSort('birthdate')}>Birthdate</button>
            </td>
            <td>
              <button onClick={() => handleSort('countryOfOrigin')}>Origin</button>
            </td>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player) => (
            <PlayerPreview key={player._id} playerId={player._id} />
          ))}
        </tbody>
      </table>
    </>
  );
}
