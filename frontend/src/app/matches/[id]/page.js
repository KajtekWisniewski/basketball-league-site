'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import MatchCard from '../../../components/matchComponents/MatchCard';
import NavBar from '../../../components/NavBar';

function MatchDetails({ params }) {
  const { id } = params;
  const [match, setMatch] = useState(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/matches/${id}`
        );
        setMatch(response.data);
      } catch (error) {
        console.error(`Error fetching player details for ID ${id}:`, error);
      }
    };

    if (id) {
      fetchPlayerDetails();
    }
  }, [id]);

  //placeholder for loading
  if (!match) {
    return <div>COKOLWIEK</div>;
  }

  return (
    <>
      <NavBar></NavBar>
      <MatchCard matchId={id} />
    </>
  );
}

export default MatchDetails;
