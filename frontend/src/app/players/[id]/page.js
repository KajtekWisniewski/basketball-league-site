'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PlayerCard from '../../../components/playerComponents/PlayerCard';
import NavBar from '../../../components/NavBar';
import { useSelector } from 'react-redux';
import MatchPreview from '@/components/matchComponents/MatchPreview';

function PlayerDetails({ params }) {
  const { id } = params;
  const [player, setPlayer] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);
  const [matchesList, setMatchesList] = useState([]);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/players/${id}`
        );
        setPlayer(response.data);
        const response3 = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/matches/find-player-matches/${id}`
        );
        setMatchesList(response3.data);
        console.log(response3.data);
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
      <div>
        <h1 className="text-center font-bold">
          Player played in the following matches:
        </h1>
        {matchesList.length > 0 ? (
          <div className="ml-3 ">
            {matchesList.map((match) => (
              <MatchPreview key={match} matchId={match} />
            ))}
          </div>
        ) : (
          <div>This player has not played in any matches </div>
        )}
      </div>
    </>
  );
}

export default PlayerDetails;
