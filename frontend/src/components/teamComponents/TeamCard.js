'use client';
import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import useTeamColor from '../../hooks/useTeamColor';
import styles from './TeamCard.module.scss';
import formatDatabaseData from '../../functions/formatDatabaseData';
import PlayerPreview from '../playerComponents/PlayerPreview';
import ManageRoster from './ManageRoster';
import RemoveFromRoster from './RemoveFromRoster';
import DeleteTeamButton from './RemoveTeam';
import { INITIAL_STATE, teamCardReducer } from '@/reducers/TeamCardReducer';
import { useSelector } from 'react-redux';
import EditTeamForm from './EditTeam';
import TeamChat from './TeamChat';
import Link from 'next/link';
import { ClipLoader } from 'react-spinners';

const isUserInATeam = (currTeamId, userTeamId) => currTeamId === userTeamId;

const TeamCard = ({ teamId }) => {
  const [state, dispatch] = useReducer(teamCardReducer, INITIAL_STATE);
  const teamColor = useTeamColor(state.teamCol);
  const { userInfo } = useSelector((state) => state.auth);
  const [rerender, setRerender] = useState(0);

  useEffect(() => {
    const fetchTeamData = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/${teamId}`)
        .then((response) => {
          // setTeam(response.data);
          // setTeamCol(response.data.name);
          // setTeamRoster(response.data.roster.length);
          dispatch({
            type: 'FETCH',
            payload: {
              team: response.data,
              teamCol: response.data.name,
              rosterLength: response.data.roster.length
            }
          });
          //console.log(state);
        })
        .catch((error) => console.error('Error fetching player data:', error));
    };
    fetchTeamData();
  }, [teamId, state.teamRoster]);

  const handlePlayerDelete = () => {
    dispatch({ type: 'DELETE' });
  };
  //placeholder for loading
  if (!state.team) {
    return (
      <div className="flex justify-center">
        <ClipLoader
          color="#ffffff"
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        ></ClipLoader>
      </div>
    );
  }

  return (
    <>
      {!state.deleted && (
        <>
          <div className={styles.teamCard} style={{ backgroundColor: teamColor }}>
            <img
              className={styles.teamimg}
              src={state.team.logoLink}
              alt={`${state.team.name} logo`}
            />
            <div className={styles.teamBasicData}>
              <h2>{formatDatabaseData(state.team.name)}</h2>
              <p>City: {state.team.location}</p>
              <p>Conference: {formatDatabaseData(state.team.conference)}</p>
              <p>Division: {formatDatabaseData(state.team.division)}</p>
            </div>

            <div className={styles.teamStatistics}>
              <h3>Statistics:</h3>
              <p>Wins: {state.team.statistics.wins}</p>
              <p>Losses: {state.team.statistics.losses}</p>
              <p>
                Win Ratio: {state.team.statistics.winPercentage.toString().slice(0, 5)}%
              </p>
              <p>TEST id: {state.team._id}</p>
            </div>

            {userInfo?.user?.isAdmin && (
              <DeleteTeamButton
                teamId={teamId}
                onDelete={handlePlayerDelete}
              ></DeleteTeamButton>
            )}
          </div>
          <div className={styles.rosterSection}>
            <h2>Current Roster</h2>
            <table className={styles.playerTable}>
              <thead>
                <tr>
                  <td>&nbsp;</td>
                  <td>Name</td>
                  <td>Age</td>
                  <td>Short</td>
                  <td>Number</td>
                  <td>Position</td>
                  <td>Height</td>
                  <td>Birthdate</td>
                  <td>Country</td>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
            {state.team.roster.map((player, index) => (
              <tr key={player._id + index} className={styles.playerSection}>
                <PlayerPreview key={player._id} playerId={player._id} />
                {((userInfo?.user && isUserInATeam(teamId, userInfo?.user?.team)) ||
                  userInfo?.user?.isAdmin) && (
                  <RemoveFromRoster
                    key={index}
                    teamId={teamId}
                    playerId={player._id}
                    onTeamChange={() => dispatch({ type: 'ROSTER_LENGTH_MINUS' })}
                  ></RemoveFromRoster>
                )}
              </tr>
            ))}
          </div>

          {((userInfo?.user && isUserInATeam(teamId, userInfo?.user?.team)) ||
            userInfo?.user?.isAdmin) && (
            <div>
              <div className={styles.manageRoster}>
                <h1>MANAGE ROSTER</h1>
                <ManageRoster
                  teamId={teamId}
                  onTeamChange={() => dispatch({ type: 'ROSTER_LENGTH_PLUS' })}
                ></ManageRoster>
              </div>
              <div>
                <Link
                  className={styles.linkStyleTeamCard}
                  href={`/teams/${teamId}/trainings`}
                >
                  <h1>TEAM TRAININGS PAGE &#8594;</h1>
                </Link>
              </div>
            </div>
          )}
          {userInfo?.user?.isAdmin && (
            <div className={styles.editForm}>
              <h2>EDIT TEAM FORM</h2>
              <EditTeamForm
                teamId={teamId}
                teamName={state.team.name}
                teamLocation={state.team.location}
                teamConference={state.team.conference}
                teamDivision={state.team.division}
                teamLink={state.team.logoLink}
                onTeamEdit={() => dispatch({ type: 'ROSTER_LENGTH_PLUS' })}
              ></EditTeamForm>
            </div>
          )}
          {((userInfo?.user && isUserInATeam(teamId, userInfo?.user?.team)) ||
            userInfo?.user?.isAdmin) && <TeamChat teamId={teamId}></TeamChat>}
        </>
      )}
      {state.deleted && <div>usunieto druzyne</div>}
    </>
  );
};

export default TeamCard;
