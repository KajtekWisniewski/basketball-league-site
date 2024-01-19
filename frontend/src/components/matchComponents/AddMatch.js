'use client';
import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import { ACTION_TYPES_MATCH } from '@/reducers/ActionTypes';
import { INITIAL_STATE, addMatchReducer } from '@/reducers/AddMatchReducer';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import globalStyles from '@/app/globals.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function getRandomNumber() {
  return Math.floor(Math.random() * 21);
}

const AddMatchForm = () => {
  const [state, dispatch] = useReducer(addMatchReducer, INITIAL_STATE);
  const [errors, setErrors] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams`
        );
        //setTeams(response.data);
        dispatch({ type: ACTION_TYPES_MATCH.FETCH_TEAMS, payload: response.data });
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  const validationSchema = Yup.object().shape({
    allteams: Yup.array(),
    date: Yup.string().required('Date of a match is required'),
    played: Yup.boolean().required(),
    opponents: Yup.array()
      .of(
        Yup.object().shape({
          team: Yup.string()
            .notOneOf(['select-team', 'Select Team'])
            .required('both teams are required'),
          score: Yup.number(),
          players: Yup.array().of(
            Yup.object().shape({
              player: Yup.string(),
              matchStatistics: Yup.object().shape({
                rebounds: Yup.number().min(0, 'rebounds cant go into negatives'),
                points: Yup.number().min(0, 'points cant go into negatives'),
                foulsCommitted: Yup.number()
                  .min(0, 'foulsCommitted cant go into negatives')
                  .default(getRandomNumber()),
                freeThrowsMade: Yup.number().min(
                  0,
                  'freeThrowsMade cant go into negatives'
                ),
                freeThrowPercentage: Yup.number()
                  .min(0, 'percentages dont go below 0')
                  .max(100, 'percentages dont go over 100')
              })
            })
          )
        })
      )
      .test('unique-teams', 'Opponents must have different teams', function (value) {
        const teams = value.map((opponent) => opponent.team);
        const uniqueTeams = new Set(teams);

        return uniqueTeams.size === teams.length;
      }),
    comments: Yup.array()
  });

  const handleTeamSelect = (selectedTeamId, opponentIndex) => {
    const selectedTeam = state.allteams.find((team) => team._id === selectedTeamId);
    dispatch({
      type: ACTION_TYPES_MATCH.SELECT_TEAM,
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
    //console.log(state);
    // try {
    //   const response = await axios.post('http://127.0.0.1:3001/matches', state);
    //   console.log('Match added successfully:', response.data);
    // } catch (error) {
    //   console.error('Error adding a match', error);
    // }
    try {
      validationSchema.validateSync(state, { abortEarly: false });
      //console.log('Form submission successful!');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/matches`,
        state
      );
      console.log('Match added successfully:', response.data);
      setErrors([]);
      router.push(`/matches/${response.data._id}`);
    } catch (error) {
      console.error('Validation Error:', error.errors);
      setErrors(error.errors);
      console.error('Error adding a match', error);
    }
  };

  return userInfo ? (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Match Date: Specify date to proceed further: </label>
        <input
          type="datetime-local"
          value={state.date}
          onChange={(e) =>
            dispatch({ type: ACTION_TYPES_MATCH.SET_DATE, payload: e.target.value })
          }
        />
      </div>

      {state.date !== '' &&
        state.opponents.map((opponent, index) => (
          <div key={index}>
            <h3>Opponent {index + 1}</h3>
            <label>Select Team:</label>
            <select
              value={opponent.team._id}
              onChange={(e) => handleTeamSelect(e.target.value, index)}
            >
              <option value="select-team">Select Team</option>
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
                    dispatch({
                      type: ACTION_TYPES_MATCH.UPDATE_OPPONENTS,
                      payload: updatedOpponents
                    });
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
      {errors.length > 0 && errors.map((error, id) => <p key={id}>{error}</p>)}
    </form>
  ) : (
    <Link className={globalStyles.linkStyle} href={`/login`}>
      <p>Please login</p>
    </Link>
  );
};

export default AddMatchForm;
