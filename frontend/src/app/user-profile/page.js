'use client';
import { useSelector } from 'react-redux';
import TeamPreview from '@/components/teamComponents/TeamPreview';
import Link from 'next/link';
import globalStyles from '@/app/globals.css';
import NavBar from '@/components/NavBar';
import TrainingManager from '@/components/teamComponents/trainings/TrainingManager';

export default function UserProfile() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      <NavBar></NavBar>
      <div>
        {userInfo ? (
          <>
            <span>
              Welcome <strong>{userInfo.user.name}!</strong>
            </span>
            <div>{userInfo.user.isAdmin && <p>Jesteś adminem</p>}</div>
            <h2>Your team:</h2>
            <TeamPreview teamId={userInfo?.user.team}></TeamPreview>
            <TrainingManager
              teamId={userInfo?.user.team}
              page={false}
            ></TrainingManager>
          </>
        ) : (
          <>
            <Link className={globalStyles.linkStyle} href={`/login`}>
              <p>Please login</p>
            </Link>
          </>
        )}
      </div>
    </>
  );
}
