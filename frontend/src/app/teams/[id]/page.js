'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import TeamCard from '../../../components/teamComponents/TeamCard';
import NavBar from '../../../components/NavBar';
import { ClipLoader } from 'react-spinners';

function TeamDetails({ params }) {
  const { id } = params;
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
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
      fetchTeamDetails();
    }
  }, [id]);

  //placeholder for loading
  if (!team) {
    return (
      <>
        <NavBar></NavBar>
        <div className="flex justify-center">
          <ClipLoader
            color="#ffffff"
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          ></ClipLoader>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar></NavBar>
      <TeamCard teamId={id} />
    </>
  );
}

export default TeamDetails;
