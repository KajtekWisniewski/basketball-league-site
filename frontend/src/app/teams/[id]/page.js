'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import TeamCard from '../../../components/teamComponents/TeamCard';
import NavBar from '../../../components/NavBar';

function PlayerDetails({ params }) {
  const { id } = params;
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/${id}`
        );
        setTeam(response.data);
      } catch (error) {
        console.error(`Error fetching player details for ID ${id}:`, error);
      }
    };

    if (id) {
      fetchPlayerDetails();
    }
  }, [id]);

  //placeholder for loading
  if (!team) {
    return <div></div>;
  }

  return (
    <>
      <NavBar></NavBar>
      <TeamCard teamId={id} />
    </>
  );
}

export default PlayerDetails;
