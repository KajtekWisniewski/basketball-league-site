import axios from 'axios';
import React, { useState, useEffect } from 'react';
import styles from './matchesArchive.module.css'
import Link from 'next/link'
import MatchPreview from '../../components/matchComponents/MatchPreview';

export default function TeamsList() {
    const [matches, setMatches] = useState(null);
    const [sortField, setSortField] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc')

    useEffect(() => {
      const fetchPlayersList = () => {
        axios
        .get(`http://127.0.0.1:3001/matches`)
        .then((response) => {
          setMatches(response.data)
        })
        .catch((error) => console.error('Error fetching players data:', error));
      };
      fetchPlayersList();
    }, [])

    //placeholder for loading
    if (!matches) {
      return <div></div>;
    }

    const handleSort = (field) => {
      setSortOrder((prevOrder) => (sortField === field ? (prevOrder === 'asc' ? 'desc' : 'asc') : 'asc'));
      setSortField(field);
    };

    //to change, sorting players by lastname instead of first
    const sortedMatches = [...matches].sort((a, b) => {
      const compareValue = (field) => (a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0);
      return sortOrder === 'asc' ? compareValue(sortField) : compareValue(sortField) * -1;
    });

    return (
      <>
      <Link style={styles.linkStyle} href={`/players/playersList`}>
            <h2>ALL PLAYERS</h2>
        </Link>
     <table className={styles.teamsTable}>
        <thead>
          <tr>
            <th onClick={() => handleSort('date')}>Date</th>
          </tr>
        </thead>
        <tbody>
          {sortedMatches.map((match) => (
              <MatchPreview key={match._id} matchId={match._id} />
          ))}
        </tbody>
      </table>
      </>
    ) 
  }