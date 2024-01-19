'use client';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import styles from './TeamChat.module.css';

const TeamChat = ({ teamId }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');

    newSocket.emit('joinTeamChat', teamId);

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [teamId, userInfo]);

  useEffect(() => {
    if (socket) {
      socket.on('initialTeamMessages', (initialMessages) => {
        //console.log('Received initial team messages:', initialMessages);
        setMessages(initialMessages);
      });
    }

    if (socket) {
      socket.on('updatedTeamMessages', (updatedMessages) => {
        //console.log('Received updated team messages:', updatedMessages);
        setMessages(updatedMessages);
      });
    }

    return () => {
      if (socket) {
        socket.off('initialTeamMessages');
        socket.off('updatedTeamMessages');
      }
    };
  }, [socket]);

  const handleMessageSubmit = (newMessage) => {
    const messageWithUserInfo = {
      ...newMessage,
      author: userInfo.user._id,
      date: new Date()
    };

    if (socket) {
      socket.emit('teamMessage', teamId, messageWithUserInfo);
    }
    //console.log(commentWithUserInfo);
  };

  return (
    <div>
      {userInfo?.user && <h2>TEAM CHAT</h2>}
      <div>
        <MessagesList messages={messages} userInfo={userInfo} />
      </div>
      {userInfo?.user && (
        <div>
          <MessageForm onSubmit={handleMessageSubmit} />
        </div>
      )}
    </div>
  );
};

const MessagesList = ({ messages, userInfo }) => {
  if (!messages || messages.length === 0) {
    return <div>No messages available.</div>;
  }

  return (
    <ul className={styles.messagesList}>
      {messages.slice(-20).map((message) => (
        <li
          key={message._id}
          className={`${styles.message} ${
            message.author?._id === userInfo?.user?._id
              ? styles.ownMessage
              : styles.elseMessage
          }`}
        >
          <span className={styles.messageContent}>
            {`${message.date.toString().slice(0, 19).replace('T', ' ')} - ${
              message.author?.name
            }: ${message.body}`}
          </span>
        </li>
      ))}
    </ul>
  );
};

const MessageForm = ({ onSubmit }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== '') {
      onSubmit({ body: newMessage });
      setNewMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="..."
      />
      <br />
      <button type="submit">Send Message</button>
    </form>
  );
};

export default TeamChat;
