'use client';
import { useState } from 'react';
import { logIn, logOut, toggleModerator } from '@/redux/features/auth-slice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function LogIn() {
  const [username, setUsername] = useState('');

  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.authReducer.value.isAuth);

  const onClickLogIn = () => {
    dispatch(logIn(username));
  };

  const onClickToggle = () => {
    dispatch(toggleModerator());
  };

  const onClickLogOut = () => {
    dispatch(logOut());
  };

  return (
    <div>
      <input type="text" onChange={(e) => setUsername(e.target.value)}></input>
      <button onClick={onClickLogIn}>Log In</button>
      <button onClick={onClickLogOut}>Log Out</button>
      {isAuth && <button onClick={onClickToggle}>Toggle Moderator Mode</button>}
    </div>
  );
}
