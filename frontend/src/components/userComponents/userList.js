import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './User.module.css';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`
        );
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleToggleAdmin = async (userId, isAdmin) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile/${userId}`,
        { isAdmin: !isAdmin }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isAdmin: !isAdmin } : user
        )
      );
    } catch (error) {
      console.error('Error toggling admin status:', error);
    }
  };

  return (
    <div>
      <h2>User List</h2>
      <ul className={styles.userList}>
        {users.map((user) => (
          <li key={user._id} className={user.isAdmin ? styles.admin : styles.user}>
            {user.name} - {user.email} - Admin: {user.isAdmin ? 'Yes' : 'No'}
            <button onClick={() => handleDelete(user._id)}>Delete</button>
            <button onClick={() => handleToggleAdmin(user._id, user.isAdmin)}>
              Toggle Admin
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
