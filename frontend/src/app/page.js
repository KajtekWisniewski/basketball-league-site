'use client';
import styles from './page.module.css';
import NavBar from '../components/NavBar';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import Standings from '@/components/teamComponents/Standings';
import LogIn from '@/components/userComponents/login-page';

// const Standings = dynamic(() => import('../components/teamComponents/Standings'), {
//   ssr: false
// });

export default function Home() {
  const username = useSelector((state) => state.authReducer.value.username);
  const isModerator = useSelector((state) => state.authReducer.value.isModerator);
  return (
    <>
      <NavBar></NavBar>
      <LogIn></LogIn>
      <h1>Username: {username}</h1>
      {isModerator && <h1> this user is a moderator</h1>}
      <Standings></Standings>
    </>
  );
}
