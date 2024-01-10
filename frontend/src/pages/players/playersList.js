import axios from 'axios';
import PlayerPreview from '../../components/PlayerPreview';
import React, { useState, useEffect } from 'react';
import styles from './playersList.module.css'
import Link from 'next/link';

export default function PlayersList() {
    const [players, setPlayers] = useState(null);
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc')

    useEffect(() => {
      const fetchPlayersList = () => {
        axios
        .get(`http://127.0.0.1:3001/players`)
        .then((response) => {
          setPlayers(response.data)
        })
        .catch((error) => console.error('Error fetching players data:', error));
      };
      fetchPlayersList();
    }, [])

    //placeholder for loading
    if (!players) {
      return <div></div>;
    }

    const handleSort = (field) => {
      setSortOrder((prevOrder) => (sortField === field ? (prevOrder === 'asc' ? 'desc' : 'asc') : 'asc'));
      setSortField(field);
    };

    //to change, sorting players by lastname instead of first
    const sortedPlayers = [...players].sort((a, b) => {
      const compareValue = (field) => (a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0);
      return sortOrder === 'asc' ? compareValue(sortField) : compareValue(sortField) * -1;
    });

    return (
      <>
     <table className={styles.playersTable}>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('age')}>Age</th>
            <th onClick={() => handleSort('team')}>Team</th>
            <th onClick={() => handleSort('teamNumber')}>Number</th>
            <th onClick={() => handleSort('position')}>Position</th>
            <th onClick={() => handleSort('height')}>Height</th>
            <th>Birthdate</th>
            <th onClick={() => handleSort('countryOfOrigin')}>Origin</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player) => (
              <PlayerPreview key={player._id} playerId={player._id} />
          ))}
        </tbody>
      </table>
      </>
    ) 
  }