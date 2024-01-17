import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import { ACTION_TYPES_MATCH } from '@/reducers/ActionTypes';
import { INITIAL_STATE, addMatchReducer } from '@/reducers/AddMatchReducer';

const AddMatchForm = () => {
  const [state, dispatch] = useReducer(addMatchReducer, INITIAL_STATE);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:3001/teams');
        //setTeams(response.data);
        dispatch({ type: ACTION_TYPES_MATCH.FETCH_TEAMS, payload: response.data });
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  // const handleTeamChange = (opponentIndex, teamId) => {
  //   setSelectedTeams((prevSelectedTeams) => ({
  //     ...prevSelectedTeams,
  //     [opponentIndex]: teamId
  //   }));
  // };

  // const handlePlayerChange = (opponentIndex, playerId) => {
  //   setSelectedPlayers((prevSelectedPlayers) => ({
  //     ...prevSelectedPlayers,
  //     [opponentIndex]: {
  //       ...prevSelectedPlayers[opponentIndex],
  //       [playerId]: !prevSelectedPlayers[opponentIndex]?.[playerId]
  //     }
  //   }));
  // };
  const handleTeamSelect = (selectedTeamId, opponentIndex) => {
    const selectedTeam = state.allteams.find((team) => team._id === selectedTeamId);
    dispatch({
      type: 'SELECT_TEAM',
      payload: {
        selectedTeam: selectedTeam || { _id: '', name: '', roster: [] },
        opponentIndex
      }
    });
  };

  const handlePlayersUpdate = (selectedPlayers, opponentIndex) => {
    dispatch({
      type: ACTION_TYPES_MATCH.UPDATE_PLAYERS,
      payload: { selectedPlayers, opponentIndex }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(state);
    // try {
    //   const response = await axios.post('http://127.0.0.1:3001/matches', state);
    //   console.log('Match added successfully:', response.data);
    // } catch (error) {
    //   console.error('Error adding a match', error);
    // }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Match Date:</label>
        <input
          type="datetime-local"
          value={state.date}
          onChange={(e) =>
            dispatch({ type: ACTION_TYPES_MATCH.SET_DATE, payload: e.target.value })
          }
        />
      </div>

      {state.opponents.map((opponent, index) => (
        <div key={index}>
          <h3>Opponent {index + 1}</h3>
          <label>Select Team:</label>
          <select
            value={opponent.team._id}
            onChange={(e) => handleTeamSelect(e.target.value, index)}
          >
            <option value="">Select Team</option>
            {state.allteams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>

          {state.played && opponent.team && (
            <div>
              <label>Team Score:</label>
              <input
                type="number"
                value={opponent.score || 0}
                onChange={(e) => {
                  const updatedOpponents = [...state.opponents];
                  updatedOpponents[index] = { ...opponent, score: e.target.value };
                  dispatch({ type: 'UPDATE_OPPONENTS', payload: updatedOpponents });
                }}
              />
              <label>Select Players:</label>
              {state.allteams
                .find((team) => team._id === opponent.team)
                ?.roster.map((player) => (
                  <div key={player._id}>
                    <input
                      type="checkbox"
                      id={`player_${player._id}`}
                      checked={opponent.players.some((p) => p.player === player._id)}
                      onChange={(e) => {
                        const selectedPlayers = e.target.checked
                          ? [
                              ...opponent.players,
                              {
                                player: player._id,
                                matchStatistics: {
                                  rebounds: 0,
                                  points: 0,
                                  foulsCommitted: 0,
                                  freeThrowsMade: 0,
                                  freeThrowPercentage: 0
                                }
                              }
                            ]
                          : opponent.players.filter((p) => p.player !== player._id);
                        handlePlayersUpdate(selectedPlayers, index);
                      }}
                    />
                    <label htmlFor={`player_${player._id}`}>{player.name}</label>
                    {opponent.players.some((p) => p.player === player._id) && (
                      <div>
                        <label>Rebounds:</label>
                        <input
                          type="number"
                          value={
                            opponent.players.find((p) => p.player === player._id)
                              ?.matchStatistics.rebounds || 0
                          }
                          onChange={(e) => {
                            const updatedPlayers = opponent.players.map((p) =>
                              p.player === player._id
                                ? {
                                    ...p,
                                    matchStatistics: {
                                      ...p.matchStatistics,
                                      rebounds: e.target.value
                                    }
                                  }
                                : p
                            );
                            handlePlayersUpdate(updatedPlayers, index);
                          }}
                        />

                        <label>Points:</label>
                        <input
                          type="number"
                          value={
                            opponent.players.find((p) => p.player === player._id)
                              ?.matchStatistics.points || 0
                          }
                          onChange={(e) => {
                            const updatedPlayers = opponent.players.map((p) =>
                              p.player === player._id
                                ? {
                                    ...p,
                                    matchStatistics: {
                                      ...p.matchStatistics,
                                      points: e.target.value
                                    }
                                  }
                                : p
                            );
                            handlePlayersUpdate(updatedPlayers, index);
                          }}
                        />

                        <label>Fouls Committed:</label>
                        <input
                          type="number"
                          value={
                            opponent.players.find((p) => p.player === player._id)
                              ?.matchStatistics.foulsCommitted || 0
                          }
                          onChange={(e) => {
                            const updatedPlayers = opponent.players.map((p) =>
                              p.player === player._id
                                ? {
                                    ...p,
                                    matchStatistics: {
                                      ...p.matchStatistics,
                                      foulsCommitted: e.target.value
                                    }
                                  }
                                : p
                            );
                            handlePlayersUpdate(updatedPlayers, index);
                          }}
                        />

                        <label>Free Throws Made:</label>
                        <input
                          type="number"
                          value={
                            opponent.players.find((p) => p.player === player._id)
                              ?.matchStatistics.freeThrowsMade || 0
                          }
                          onChange={(e) => {
                            const updatedPlayers = opponent.players.map((p) =>
                              p.player === player._id
                                ? {
                                    ...p,
                                    matchStatistics: {
                                      ...p.matchStatistics,
                                      freeThrowsMade: e.target.value
                                    }
                                  }
                                : p
                            );
                            handlePlayersUpdate(updatedPlayers, index);
                          }}
                        />
                        <label>Free Throw Percentage:</label>
                        <input
                          type="number"
                          value={
                            opponent.players.find((p) => p.player === player._id)
                              ?.matchStatistics.freeThrowPercentage || 0
                          }
                          onChange={(e) => {
                            const updatedPlayers = opponent.players.map((p) =>
                              p.player === player._id
                                ? {
                                    ...p,
                                    matchStatistics: {
                                      ...p.matchStatistics,
                                      freeThrowPercentage: e.target.value
                                    }
                                  }
                                : p
                            );
                            handlePlayersUpdate(updatedPlayers, index);
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}

      <button type="submit">Submit</button>
    </form>
  );
};

export default AddMatchForm;
