'use client';
import AddTeamForm from '@/components/teamComponents/AddTeam';
import NavBar from '../../../components/NavBar';
import { useSelector } from 'react-redux';

export default function AddTeam() {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <>
      <NavBar></NavBar>
      {userInfo?.user ? <AddTeamForm></AddTeamForm> : <p>please login</p>}
    </>
  );
}
