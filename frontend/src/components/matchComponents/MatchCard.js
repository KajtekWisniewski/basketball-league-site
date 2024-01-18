'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTeamColor from '../../hooks/useTeamColor';
import styles from './MatchCard.module.css';
import formatDatabaseData from '../../functions/formatDatabaseData';
import Link from 'next/link';
import PlayerPreview from '../playerComponents/PlayerPreview';
import DeleteMatchButton from './DeleteMatch';
import { useSelector } from 'react-redux';

const MatchCard = ({ matchId }) => {
  const [match, setMatch] = useState(null);
  const [teamCol1, setTeamCol1] = useState(null);
  const teamColor1 = useTeamColor(teamCol1);
  const [teamCol2, setTeamCol2] = useState(null);
  const teamColor2 = useTeamColor(teamCol2);
  const [deleted, setDeleted] = useState(false);
  //jak zostanie czas to refactor na useReducer ^^
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchMatchData = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matches/${matchId}`)
        .then((response) => {
          setMatch(response.data);
          setTeamCol1(response.data.opponents[0].team.name);
          setTeamCol2(response.data.opponents[1].team.name);
        })
        .catch((error) => console.error('Error fetching match data:', error));
    };

    fetchMatchData();
  }, [matchId]);

  const handlePlayerDelete = () => {
    setDeleted(true);
  };

  // placeholder for loading
  if (!match) {
    return <div></div>;
  }

  return (
    <>
      <div className={styles.date}>
        <h1>{match.date.slice(0, 10)}</h1>
        <h2>{match.date.slice(11, 16)}</h2>
      </div>
      <div className={styles.matchCard}>
        <div className={styles.singleTeamPrev} style={{ backgroundColor: teamColor1 }}>
          <div className={styles.basicInfo}>
            <Link
              className={styles.linkStyle}
              href={`/teams/${match.opponents[0].team?._id}`}
            >
              <img
                className={styles.teamimg}
                src={match.opponents[0].team?.logoLink}
                alt={`${match.opponents[0].team?.name} logo`}
              />
            </Link>
            <h2>{formatDatabaseData(match.opponents[0].team?.name)}</h2>
            <h2>{match.opponents[0].score}</h2>
            <p>W{match.opponents[0].team?.statistics.wins}</p>
            <p>L{match.opponents[0].team?.statistics.losses}</p>
            <p>
              {match.opponents[0].team?.statistics.winPercentage.toString().slice(0, 5)}
              %
            </p>
          </div>
          {match.opponents[0].players?.map((player) => (
            <>
              <PlayerPreview key={player?.player._id} playerId={player?.player._id} />
              <div className={styles.individualMatchStats}>
                <p>{player?.player.name}&apos; match statistics</p>
                <p>rebounds: {player?.matchStatistics.rebounds}</p>
                <p>points: {player?.matchStatistics.points}</p>
                <p>fouls: {player?.matchStatistics.foulsCommitted}</p>
                <p>free throws made: {player?.matchStatistics.freeThrowsMade}</p>
                <p>
                  free throws percentage: {player?.matchStatistics.freeThrowPercentage}%
                </p>
              </div>
            </>
          ))}
        </div>

        <div className={styles.singleTeamPrev} style={{ backgroundColor: teamColor2 }}>
          <div className={styles.basicInfo}>
            <Link
              className={styles.linkStyle}
              href={`/teams/${match.opponents[1].team?._id}`}
            >
              <img
                className={styles.teamimg}
                src={match.opponents[1].team?.logoLink}
                alt={`${match.opponents[1].team?.name} logo`}
              />
            </Link>
            <h2>{formatDatabaseData(match.opponents[1].team?.name)}</h2>
            <h2>{match.opponents[1].score}</h2>
            <p>W{match.opponents[1].team?.statistics.wins}</p>
            <p>L{match.opponents[1].team?.statistics.losses}</p>
            <p>
              {match.opponents[1].team?.statistics.winPercentage.toString().slice(0, 5)}
              %
            </p>
          </div>

          {match.opponents[1].players?.map((player) => (
            <>
              <PlayerPreview key={player?.player._id} playerId={player?.player._id} />
              <div className={styles.individualMatchStats}>
                <p>{player?.player.name}&apos; match statistics</p>
                <p>rebounds: {player?.matchStatistics.rebounds}</p>
                <p>points: {player?.matchStatistics.points}</p>
                <p>fouls: {player?.matchStatistics.foulsCommitted}</p>
                <p>free throws made: {player?.matchStatistics.freeThrowsMade}</p>
                <p>
                  free throws percentage: {player?.matchStatistics.freeThrowPercentage}%
                </p>
              </div>
            </>
          ))}
        </div>
      </div>
      <div>
        {userInfo?.user?.isAdmin && (
          <>
            <DeleteMatchButton
              matchId={matchId}
              onDelete={handlePlayerDelete}
            ></DeleteMatchButton>
            {deleted && <p>USUNIETO MECZ POMYSLNIE</p>}
          </>
        )}
      </div>
    </>
  );
};

export default MatchCard;
