import styles from './page.module.css'
import NavBar from '../components/NavBar'
import dynamic from 'next/dynamic';

const Standings = dynamic(() => import('../components/teamComponents/Standings'), { ssr: false });

export default function Home() {
 
  return (
    <>
    <NavBar></NavBar>
    <Standings></Standings>
    </>
  );
};
