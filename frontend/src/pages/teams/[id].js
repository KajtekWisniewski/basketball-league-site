import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import TeamCard from '../../components/TeamCard';

function PlayerDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3001/teams/${id}`);
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
      <TeamCard teamId={id}/>
    </>
  );
}

export default PlayerDetails;