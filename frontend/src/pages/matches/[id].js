import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import MatchCard from '../../components/matchComponents/MatchCard';

function MatchDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [match, setMatch] = useState(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3001/matches/${id}`);
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
    return <div></div>;
  }

  return (
    <>
      <MatchCard matchId={id}/>
    </>
  );
}

export default MatchDetails;