'use client';
import styles from './page.module.css';
import NavBar from '../components/NavBar';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import Standings from '@/components/teamComponents/Standings';
import variables from './variables.module.scss';

// const Standings = dynamic(() => import('../components/teamComponents/Standings'), {
//   ssr: false
// });

export default function Home() {
  return (
    <>
      <NavBar></NavBar>
      <h1 style={{ color: variables.primaryColor }} className="text-xl">
        STANDINGS:
      </h1>
      <Standings></Standings>
    </>
  );
}
