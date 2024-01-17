import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import { ACTION_TYPES_MATCH } from '@/reducers/ActionTypes';
import { INITIAL_STATE, addMatchReducer } from '@/reducers/AddMatchReducer';

const AddMatchForm = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState({});
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [matchDate, setMatchDate] = useState('');
  const [isDateFromPast, setIsDateFromPast] = useState(false);
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
    try {
      const response = await axios.post('http://127.0.0.1:3001/matches', state);
      console.log('Match added successfully:', response.data);
    } catch (error) {
      console.error('Error adding a match', error);
    }
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

          {opponent.team && (
            <div>
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
                          ? [...opponent.players, { player: player._id }]
                          : opponent.players.filter((p) => p.player !== player._id);
                        handlePlayersUpdate(selectedPlayers, index);
                      }}
                    />
                    <label htmlFor={`player_${player._id}`}>{player.name}</label>
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
