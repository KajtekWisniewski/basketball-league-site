'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PlayerCard from '../../../components/playerComponents/PlayerCard';
import NavBar from '../../../components/NavBar';
import { useSelector } from 'react-redux';

function PlayerDetails({ params }) {
  const { id } = params;
  const [player, setPlayer] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/players/${id}`
        );
        setPlayer(response.data);
      } catch (error) {
        console.error(`Error fetching player details for ID ${id}:`, error);
      }
    };

    if (id) {
      fetchPlayerDetails();
    }
  }, [id]);

  //placeholder for loading
  if (!player) {
    return <div></div>;
  }

  return (
    <>
      <NavBar></NavBar>
      <PlayerCard playerId={id} />
    </>
  );
}

export default PlayerDetails;
