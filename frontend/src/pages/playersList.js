import axios from 'axios';
import PlayerCard from '../components/PlayerCard';
import React, { useState, useEffect } from 'react';

export default function PlayersList() {
    const [players, setPlayers] = useState(null);

    useEffect(() => {
      const fetchPlayersList = () => {
        axios
        .get(`http://127.0.0.1:3001/players`)
        .then((response) => {
          setPlayers(response.data)
        })
        .catch((error) => console.error('Error fetching players data:', error));
      };
      fetchPlayersList();
    }, [])

    if (!players) {
      return <div>Loading...</div>;
    }

    return (
      <>
      {players.map((player) => <PlayerCard playerId={player._id} />)}
      </>
    ) 
  }