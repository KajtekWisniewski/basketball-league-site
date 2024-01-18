'use client';
import AddPlayerForm from '@/components/playerComponents/AddPlayer';
import NavBar from '../../../components/NavBar';
import { useSelector } from 'react-redux';

export default function AddPlayer() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      <NavBar></NavBar>
      {userInfo?.user ? (
        <AddPlayerForm></AddPlayerForm>
      ) : (
        <p>forbidden. please login</p>
      )}
    </>
  );
}
