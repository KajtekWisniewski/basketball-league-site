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
  return (
    <>
      <NavBar></NavBar>
      <Standings></Standings>
    </>
  );
}
