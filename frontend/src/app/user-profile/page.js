'use client';
import { useSelector } from 'react-redux';
import TeamPreview from '@/components/teamComponents/TeamPreview';
import Link from 'next/link';
import globalStyles from '@/app/globals.css';
import NavBar from '@/components/NavBar';
import TrainingManager from '@/components/teamComponents/trainings/TrainingManager';
import { useEffect } from 'react';
import axios from 'axios';

export default function UserProfile() {
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const firstVisitFlag = localStorage.getItem('firstVisitFlag');
    const fetchData = async () => {
      try {
        if (userInfo) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/${userInfo?.user?.team}/hasUpcomingTraining`
          );

          const trainingData = response.data;

          console.log(firstVisitFlag, trainingData);
          if (
            (!firstVisitFlag || firstVisitFlag === 'true') &&
            trainingData.hasUpcomingTraining
          ) {
            alert(`You have ${trainingData.numberOfTrainings} upcoming trainings`);
            localStorage.setItem('firstVisitFlag', 'false');
          }
        }
      } catch (error) {
        console.error('Error fetching upcoming training data:', error);
      }
    };

    fetchData();
  }, [userInfo]);

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
            <Link
              className={globalStyles.linkStyle}
              href={`/teams/${userInfo?.user.team}/trainings`}
            >
              <TrainingManager
                teamId={userInfo?.user.team}
                page={false}
              ></TrainingManager>
            </Link>
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
