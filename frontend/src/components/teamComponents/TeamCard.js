import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import useTeamColor from '../../hooks/useTeamColor';
import styles from './TeamCard.module.css';
import formatDatabaseData from '../../functions/formatDatabaseData';
import PlayerPreview from '../playerComponents/PlayerPreview';
import ManageRoster from './ManageRoster';
import RemoveFromRoster from './RemoveFromRoster';
import DeleteTeamButton from './RemoveTeam';
import { INITIAL_STATE, playerCardReducer } from '@/reducers/TeamCardReducer';

const TeamCard = ({ teamId }) => {
  const [state, dispatch] = useReducer(playerCardReducer, INITIAL_STATE);
  const teamColor = useTeamColor(state.teamCol);

  useEffect(() => {
    const fetchPlayerData = () => {
      axios
        .get(`http://127.0.0.1:3001/teams/${teamId}`)
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
          console.log(state);
        })
        .catch((error) => console.error('Error fetching player data:', error));
    };
    fetchPlayerData();
  }, [teamId, state.teamRoster]);

  const handlePlayerDelete = () => {
    dispatch({ type: 'DELETE' });
  };
  //placeholder for loading
  if (!state.team) {
    return <div></div>;
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
            <DeleteTeamButton
              teamId={teamId}
              onDelete={handlePlayerDelete}
            ></DeleteTeamButton>
          </div>
          <div>
            <h2>Current Roster</h2>
            {state.team.roster.map((player, index) => (
              <>
                <PlayerPreview key={player._id} playerId={player._id} />
                <RemoveFromRoster
                  key={index}
                  teamId={teamId}
                  playerId={player._id}
                  onTeamChange={() => dispatch({ type: 'ROSTER_LENGTH_MINUS' })}
                ></RemoveFromRoster>
              </>
            ))}
          </div>
          <ManageRoster
            teamId={teamId}
            onTeamChange={() => dispatch({ type: 'ROSTER_LENGTH_PLUS' })}
          ></ManageRoster>
        </>
      )}
      {state.deleted && <div>usunieto druzyne</div>}
    </>
  );
};

export default TeamCard;
