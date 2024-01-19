'use client';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import styles from './MatchCard.module.css';

const CommentSection = ({ matchId }) => {
  const [socket, setSocket] = useState(null);
  const [comments, setComments] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');

    newSocket.emit('joinCommentSection', matchId);

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [matchId, userInfo]);

  useEffect(() => {
    if (socket) {
      socket.on('initialComments', (initialComments) => {
        setComments(initialComments);
      });
    }

    if (socket) {
      socket.on('updatedComments', (updatedComments) => {
        setComments(updatedComments);
      });
    }

    return () => {
      if (socket) {
        socket.off('initialComments');
        socket.off('updatedComments');
      }
    };
  }, [socket]);

  const handleCommentSubmit = (newComment) => {
    const commentWithUserInfo = {
      ...newComment,
      author: userInfo.user._id,
      date: new Date()
    };

    if (socket) {
      socket.emit('comment', matchId, commentWithUserInfo);
    }
    //console.log(commentWithUserInfo);
  };

  return (
    <div>
      {userInfo?.user ? (
        <h2>Comment Section</h2>
      ) : (
        <h2>Comment Section. Log in to add comments</h2>
      )}
      <div>
        <CommentList comments={comments} />
      </div>
      {userInfo?.user && (
        <div>
          <CommentForm onSubmit={handleCommentSubmit} />
        </div>
      )}
    </div>
  );
};

const CommentList = ({ comments }) => (
  <ul>
    {comments.map((comment) => (
      <li key={comment._id} className={styles.comment}>
        {comment.date.toString().slice(0, 19).replace('T', ' ')} -{' '}
        {comment.author?.name} - {comment.body}
      </li>
    ))}
  </ul>
);

const CommentForm = ({ onSubmit }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() !== '') {
      onSubmit({ body: newComment });
      setNewComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        rows="4"
        cols="50"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <br />
      <button type="submit">Submit Comment</button>
    </form>
  );
};

export default CommentSection;
