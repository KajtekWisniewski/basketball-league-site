'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '@/components/NavBar';
import { useSelector } from 'react-redux';
import TeamChat from '@/components/teamComponents/TeamChat';

function ChatPage({ params }) {
  const { id } = params;
  const [team, setTeam] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  //   useEffect(() => {
  //     const fetchTeamDetails = async () => {
  //       try {
  //         const response = await axios.get(
  //           `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/${id}`
  //         );
  //         setTeam(response.data);
  //       } catch (error) {
  //         console.error(`Error fetching team details for ID ${id}:`, error);
  //       }
  //     };

  //     if (id) {
  //       fetchTeamDetails();
  //     }
  //   }, [id]);

  //   //placeholder for loading
  //   if (!team) {
  //     return <div></div>;
  //   }

  return (
    <>
      <NavBar></NavBar>
      {(userInfo?.user && userInfo?.user.team === id) || userInfo?.user.isAdmin ? (
        <div>
          <TeamChat teamId={id}></TeamChat>
        </div>
      ) : (
        <h1>unauthorized</h1>
      )}
    </>
  );
}

export default ChatPage;
