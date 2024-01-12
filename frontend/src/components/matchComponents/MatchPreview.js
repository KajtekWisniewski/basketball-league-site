import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTeamColor from '../../hooks/useTeamColor';
import styles from './MatchPreview.module.css';
import formatDatabaseData from '../../functions/formatDatabaseData';
import Link from 'next/link';

const MatchPreview = ({ matchId }) => {
  const [match, setMatch] = useState(null);

  useEffect(() => {
    const fetchMatchData = () => {
      axios
        .get(`http://127.0.0.1:3001/matches/${matchId}`)
        .then((response) => {
          setMatch(response.data);
        })
        .catch((error) => console.error('Error fetching match data:', error));
    };

    fetchMatchData();
  }, [matchId]);

  // placeholder for loading
  if (!match) {
    return <div></div>;
  }

  return (
    <div>
      <p>{match.opponents[0].name}</p>
      <p>{match.opponents[1].name}</p>
    </div>
  );
};

export default MatchPreview;
