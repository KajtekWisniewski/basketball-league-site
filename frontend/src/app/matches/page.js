'use client';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import styles from './matchesArchive.module.css';
import Link from 'next/link';
import MatchPreview from '../../components/matchComponents/MatchPreview';
import NavBar from '../../components/NavBar';
import globalStyles from '../../app/globals.css';
import { useSelector } from 'react-redux';

export default function MatchesArchive() {
  const [matches, setMatches] = useState(null);
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPlayersList = () => {
      axios
        .get(`http://127.0.0.1:3001/matches`)
        .then((response) => {
          setMatches(response.data);
        })
        .catch((error) => console.error('Error fetching players data:', error));
    };
    fetchPlayersList();
  }, []);

  //placeholder for loading
  if (!matches) {
    return <div></div>;
  }

  const handleSort = (field) => {
    setSortOrder((prevOrder) =>
      sortField === field ? (prevOrder === 'asc' ? 'desc' : 'asc') : 'asc'
    );
    setSortField(field);
  };

  //to change, sorting players by lastname instead of first
  const sortedMatches = [...matches].sort((a, b) => {
    const compareValue = (field) =>
      a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0;
    return sortOrder === 'asc' ? compareValue(sortField) : compareValue(sortField) * -1;
  });

  return (
    <>
      <NavBar></NavBar>

      {userInfo?.user && (
        <Link className={globalStyles.linkStyle} href={`/matches/add-match`}>
          <h1 className="text-xl">ADD A MATCH</h1>
        </Link>
      )}
      <button onClick={() => handleSort('date')}>Date</button>
      {sortedMatches.map((match) => (
        <MatchPreview key={match._id} matchId={match._id} />
      ))}
    </>
  );
}
