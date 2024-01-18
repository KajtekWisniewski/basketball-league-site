import Link from 'next/link';
import styles from './NavBar.module.css';

const NavBar = ({}) => {
  return (
    <nav className={styles.navbar}>
      <Link className={styles.linkStyle} href={`/teams/`}>
        <h2>ALL TEAMS</h2>
      </Link>
      <Link className={styles.linkStyle} href={`/players/`}>
        <h2>ALL PLAYERS</h2>
      </Link>
      <Link className={styles.linkStyle} href={`/`}>
        <h2>STANDINGS</h2>
      </Link>
      <Link className={styles.linkStyle} href={`/matches/`}>
        <h2>MATCH ARCHIVE</h2>
      </Link>
      <Link className={styles.linkStyle} href={`/matches/schedule`}>
        <h2>SCHEDULE</h2>
      </Link>
      <Link className={styles.linkStyle} href={`/login`}>
        <h2>LOGIN</h2>
      </Link>
      <Link className={styles.linkStyle} href={`/register`}>
        <h2>REGISTER</h2>
      </Link>
    </nav>
  );
};

export default NavBar;
