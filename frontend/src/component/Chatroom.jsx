import React, { useState, useEffect } from 'react';
import AxiosInstance from './Auth/AxiosInstance';
import { Link } from 'react-router-dom';
import './ChatRoom.css';

const ChatroomList = () => {
  const [chatrooms, setChatrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        const response = await AxiosInstance.get('chat/chatrooms/');
        setChatrooms(response.data);
      } catch (error) {
        setError('Failed to load chatrooms. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchChatrooms();
  }, []);

  if (loading) {
    return <div className="loading">Loading chatrooms...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (chatrooms.length === 0) {
    return <div className="empty-state">No chatrooms available.</div>;
  }

  return (
    <div className="chatroom-container">
      {chatrooms.map((chatroom) => (
        <div key={chatroom.id} className="chatroom">
          <Link to={`/chatroom/${chatroom.id}`} className="chatroom-link">
            <div className="chatroom-item user-info">
              <span>User: {chatroom.user || 'Unknown User'}</span>
            </div>
            <div className="chatroom-item status-info">
              <span>Status: {chatroom.status || 'No Status'}</span>
            </div>
            <div className="chatroom-item created-at-info">
              <span>
                Created At: {new Date(chatroom.created_at).toLocaleString()}
              </span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ChatroomList;
