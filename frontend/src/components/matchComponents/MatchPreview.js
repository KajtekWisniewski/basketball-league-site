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
    <div className={styles.matchPreviewCard}> 
     <Link style={styles.linkStyle} href={`/matches/${match._id}`}>
      <h3>{match.date.slice(0,10)} {match.date.slice(14,19)}</h3>
      </Link>
      <div className={styles.singleTeamPrevLeft}>
      <img className={styles.teamimg} src={match.opponents[0].team?.logoLink} alt={`${match.opponents[0].team?.name} logo`} />
        <p>{match.opponents[0].team?.name}</p>
        <p>W{match.opponents[0].team?.statistics.wins}</p>
        <p>L{match.opponents[0].team?.statistics.losses}</p>
        <p>{match.opponents[0].team?.statistics.winPercentage.toString().slice(0,5)}%</p>
        <h2>{match.opponents[0].score}</h2>
      </div>
      <h2>-</h2>
      <div className={styles.singleTeamPrevRight}>
      <h2>{match.opponents[1].score}</h2>
        <p>{match.opponents[1].team?.statistics.winPercentage.toString().slice(0,5)}%</p>
        <p>W{match.opponents[1].team?.statistics.wins}</p>
        <p>L{match.opponents[1].team?.statistics.losses}</p>
        <p>{match.opponents[1].team?.name}</p>
        <img className={styles.teamimg} src={match.opponents[1].team?.logoLink} alt={`${match.opponents[1].team?.name} logo`} />


      </div>
    </div>
  );
};

export default MatchPreview;
