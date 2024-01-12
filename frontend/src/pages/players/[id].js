import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import PlayerCard from '../../components/playerComponents/PlayerCard';
import NavBar from '../../components/NavBar';

function PlayerDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3001/players/${id}`);
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
      <PlayerCard playerId={id}/>
    </>
  );
}

export default PlayerDetails;