'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTeamColor from '../../hooks/useTeamColor';
import styles from './MatchPreview.module.scss';
import formatDatabaseData from '../../functions/formatDatabaseData';
import Link from 'next/link';
import { ClipLoader } from 'react-spinners';

const MatchPreview = ({ matchId }) => {
  const [match, setMatch] = useState(null);
  const [teamCol1, setTeamCol1] = useState(null);
  const teamColor1 = useTeamColor(teamCol1);
  const [teamCol2, setTeamCol2] = useState(null);
  const teamColor2 = useTeamColor(teamCol2);

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

  // placeholder for loading
  if (!match) {
    return (
      <tr className="flex justify-center">
        <td className="flex justify-center">
          <div className="flex justify-center">
            <ClipLoader
              color="#ffffff"
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            ></ClipLoader>
          </div>
        </td>
      </tr>
    );
  }

  // return (
  //   <div className={styles.matchPreviewCard}>
  //     <Link className={styles.linkStyle} href={`/matches/${match._id}`}>
  //       <h3>{match.date.slice(0, 10)}</h3>
  //       <h2>{match.date.slice(11, 16)}</h2>
  //     </Link>
  //     <div className={styles.singleTeamPrev1} style={{ backgroundColor: teamColor1 }}>
  //       <Link
  //         className={styles.linkStyle}
  //         href={`/teams/${match.opponents[0].team?._id}`}
  //       >
  //         <img
  //           className={styles.teamimg}
  //           src={match.opponents[0].team?.logoLink}
  //           alt={`${match.opponents[0].team?.name} logo`}
  //         />
  //       </Link>
  //       <Link className={styles.linkStyle} href={`/matches/${match._id}`}>
  //         <h2>{formatDatabaseData(match.opponents[0].team?.name)}</h2>
  //         <p>W{match.opponents[0].team?.statistics.wins}</p>
  //         <p>L{match.opponents[0].team?.statistics.losses}</p>
  //         <p>
  //           {match.opponents[0].team?.statistics.winPercentage.toString().slice(0, 5)}%
  //         </p>
  //         <h2 className="text-xl font-bold ">{match.opponents[0].score}</h2>
  //       </Link>
  //     </div>

  //     <h2>-</h2>
  //     <div className={styles.singleTeamPrev} style={{ backgroundColor: teamColor2 }}>
  //       <Link className={styles.linkStyle} href={`/matches/${match._id}`}>
  //         <h2 className="text-xl font-bold ">{match.opponents[1].score}</h2>
  //         <p>
  //           {match.opponents[1].team?.statistics.winPercentage.toString().slice(0, 5)}%
  //         </p>
  //         <p>W{match.opponents[1].team?.statistics.wins}</p>
  //         <p>L{match.opponents[1].team?.statistics.losses}</p>
  //         <h2>{formatDatabaseData(match.opponents[1].team?.name)}</h2>
  //       </Link>
  //       <Link
  //         className={styles.linkStyle}
  //         href={`/teams/${match.opponents[1].team?._id}`}
  //       >
  //         <img
  //           className={styles.teamimg}
  //           src={match.opponents[1].team?.logoLink}
  //           alt={`${match.opponents[1].team?.name} logo`}
  //         />
  //       </Link>
  //     </div>
  //   </div>
  // );
  return (
    <tr className={styles.matchPreviewCard}>
      <td>
        <Link className={styles.linkStyle} href={`/matches/${match._id}`}>
          <h3>{match.date.slice(0, 10)}</h3>
          <h2>{match.date.slice(11, 16)}</h2>
        </Link>
      </td>
      <td>
        <div className={styles.singleTeamPrev1} style={{ backgroundColor: teamColor1 }}>
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
          <Link className={styles.linkStyle} href={`/matches/${match._id}`}>
            <h2>{formatDatabaseData(match.opponents[0].team?.name)}</h2>
            <p>W{match.opponents[0].team?.statistics.wins}</p>
            <p>L{match.opponents[0].team?.statistics.losses}</p>
            <p>
              {match.opponents[0].team?.statistics.winPercentage.toString().slice(0, 5)}
              %
            </p>
          </Link>
          <h2 className="text-3xl font-bold ">{match.opponents[0].score}</h2>
        </div>
      </td>

      <td>
        <h2 className="text-4xl">&nbsp;-</h2>
      </td>

      <td>
        <div className={styles.singleTeamPrev} style={{ backgroundColor: teamColor2 }}>
          <h2 className="text-3xl font-bold ">{match.opponents[1].score}</h2>
          <Link className={styles.linkStyle} href={`/matches/${match._id}`}>
            <p>
              {match.opponents[1].team?.statistics.winPercentage.toString().slice(0, 5)}
              %
            </p>
            <p>W{match.opponents[1].team?.statistics.wins}</p>
            <p>L{match.opponents[1].team?.statistics.losses}</p>
            <h2>{formatDatabaseData(match.opponents[1].team?.name)}</h2>
          </Link>
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
        </div>
      </td>
    </tr>
  );
};

export default MatchPreview;
