
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import AxiosInstance from "./Auth/AxiosInstance";

const ChatRoomDetail = () => {
  const { chatRoomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchStatus, setFetchStatus] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await AxiosInstance.get(`chat/chatrooms/${chatRoomId}/messages`);
        setMessages(response.data);
        setFetchStatus("Messages fetched successfully!");
      } catch (error) {
        setError("Error while fetching messages: " + error.message);
        setFetchStatus("Failed to fetch messages.");
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, [chatRoomId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Welcome to chatroom {chatRoomId}</h1>
      {fetchStatus && <p>{fetchStatus}</p>}
      {messages.length > 0 && (
        <ul>
          {messages.map((message) => (
            <li key={message.id}>
              <span>Sender: {message.sender}</span>
              {message.content && <p>Content: {message.content}</p>}
              {message.file && <img src={message.file} alt="Message File" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatRoomDetail;

