'use client';
import { useSelector } from 'react-redux';
import TeamPreview from '@/components/teamComponents/TeamPreview';
import Link from 'next/link';
import globalStyles from '@/app/globals.css';
import NavBar from '@/components/NavBar';

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
            <span>Your team:</span>
            <TeamPreview teamId={userInfo?.user.team}></TeamPreview>
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
