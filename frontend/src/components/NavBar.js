import Link from 'next/link'
import styles from './NavBar.module.css'

const NavBar = ({}) => {
 return (
    <nav className={styles.navbar}>
         <Link className={styles.linkStyle} href={`/teams/teamsList`}>
            <h2>ALL TEAMS</h2>
        </Link>
        <Link className={styles.linkStyle} href={`/players/playersList`}>
            <h2>ALL PLAYERS</h2>
        </Link>
        <Link className={styles.linkStyle} href={`/matches/matchArchive`}>
            <h2>MATCH ARCHIVE</h2>
        </Link>
    </nav>
 )
}

export default NavBar