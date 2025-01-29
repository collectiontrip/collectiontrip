import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import AxiosInstance from "./Auth/AxiosInstance";
import "./ChatRoomDetails.css";

const ChatRoomDetail = () => {
  const { chatRoomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await AxiosInstance.get(`chat/chatrooms/${chatRoomId}/messages`);
        setMessages(response.data);
      } catch (error) {
        setError("Error while fetching messages: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [chatRoomId]);

  // Function to format timestamp to readable time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Function to format timestamp to readable date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, message) => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(messages);

  const renderMedia = (file) => {
    if (!file) return null;
    const fileExtension = file.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) {
      return (
        <div className="message-image">
          <img src={file} alt="Uploaded content" />
        </div>
      );
    }

    if (["mp3", "wav", "ogg"].includes(fileExtension)) {
      return (
        <div className="message-audio">
          <audio controls>
            <source src={file} type={`audio/${fileExtension}`} />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }

    if (["mp4", "webm", "ogg"].includes(fileExtension)) {
      return (
        <div className="message-video">
          <video controls>
            <source src={file} type={`video/${fileExtension}`} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    return (
      <div className="message-file">
        <a href={file} target="_blank" rel="noopener noreferrer">
          Download File
        </a>
      </div>
    );
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="chatroom-container">
      <h1 className="chatroom-title">Chatroom {chatRoomId}</h1>

      <div className="messages-container">
        {Object.keys(groupedMessages).map((date) => (
          <div key={date} className="date-group">
            <div className="date-header">{date}</div>
            <ul className="messages-list">
              {groupedMessages[date].map((message) => (
                <li key={message.id} className="message">
                  <div className="message-sender">{message.sender}</div>
                  <div className="message-content">{message.content}</div>
                  {renderMedia(message.file)}
                  <div className="message-timestamp">{formatTime(message.timestamp)}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatRoomDetail;
