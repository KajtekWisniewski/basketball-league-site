import axios from 'axios';
import TeamPreview from '../../components/TeamPreview';
import React, { useState, useEffect } from 'react';
import styles from './teamsList.module.css'
import Link from 'next/link'

export default function TeamsList() {
    const [teams, setTeams] = useState(null);
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc')

    useEffect(() => {
      const fetchPlayersList = () => {
        axios
        .get(`http://127.0.0.1:3001/teams`)
        .then((response) => {
          setTeams(response.data)
        })
        .catch((error) => console.error('Error fetching players data:', error));
      };
      fetchPlayersList();
    }, [])

    //placeholder for loading
    if (!teams) {
      return <div></div>;
    }

    const handleSort = (field) => {
      setSortOrder((prevOrder) => (sortField === field ? (prevOrder === 'asc' ? 'desc' : 'asc') : 'asc'));
      setSortField(field);
    };

    //to change, sorting players by lastname instead of first
    const sortedPlayers = [...teams].sort((a, b) => {
      const compareValue = (field) => (a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0);
      return sortOrder === 'asc' ? compareValue(sortField) : compareValue(sortField) * -1;
    });

    return (
      <>
      <Link style={styles.linkStyle} href={`/players/playersList`}>
            <h2>ALL PLAYERS</h2>
        </Link>
     <table className={styles.playersTable}>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('statistics.winPercentage')}>WR</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((team) => (
              <TeamPreview key={team._id} teamId={team._id} />
          ))}
        </tbody>
      </table>
      </>
    ) 
  }