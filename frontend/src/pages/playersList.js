import axios from 'axios';
import PlayerCard from '../components/PlayerCard';
import PlayerPreview from '../components/PlayerPreview';
import React, { useState, useEffect } from 'react';
import styles from './playersList.module.css'

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
      <div className={styles.bannerList}>
        <p className={styles.lol}>Photo</p>
        <p>Name</p>
        <p>Age</p>
        <p>Team</p>
        <p>Number</p>
        <p>Position</p>
        <p>Height</p>
        <p>Birthdate</p>
        <p>Origin</p>
    </div>
      {players.reverse().slice(0,5).map((player) => <PlayerPreview playerId={player._id} key={player._id}/>)}
      </>
    ) 
  }