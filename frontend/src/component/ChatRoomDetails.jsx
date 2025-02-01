import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import AxiosInstance from "./auth/AxiosInstance";
import Picker from "@emoji-mart/react";
import "./ChatRoomDetails.css";

const ChatRoomDetail = () => {
  const { chatroom_id } = useParams();
  console.log("Chatroom ID:", chatroom_id);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatPartner, setChatPartner] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [socket, setSocket] = useState(null);

  const backendBaseURL = "http://localhost:8000";

  useEffect(() => {
    if (!chatroom_id) {
      setError("Invalid chatroom ID");
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await AxiosInstance.get(
          `/chat/chatrooms/${chatroom_id}/messages?chat_room=${chatroom_id}`
        );
        console.log("Fetched Messages:", response.data);
        setMessages(response.data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError("Error fetching messages: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await AxiosInstance.get("/auth/users/");
        console.log("Fetched User:", response.data);
        if (response.data.length > 0) {
          setCurrentUser(response.data[0]);
        } else {
          setError("No user found");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Error fetching user: " + error.message);
      }
    };

    fetchMessages();
    fetchCurrentUser();

    // WebSocket connection for real-time chat
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const token = localStorage.getItem("accessToken");
    const ws = new WebSocket(
      `${wsProtocol}://localhost:8000/ws/chat/${chatroom_id}/?token=${token}`
    );
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat_message") {  // Match the consumer's event type
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: Date.now(),
            content: data.message,
            sender: data.sender_id,
            message_type: data.message_type,
            timestamp: new Date().toISOString(),
            file: data.file || null,
          },
        ]);
      }
    };

    ws.onclose = (event) => {
      console.log(`WebSocket closed: ${event.code} - ${event.reason}`);
    };
  
    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [chatroom_id]);

  useEffect(() => {
    if (currentUser && messages.length > 0) {
      const uniqueUsers = [...new Set(messages.map((msg) => msg.sender))];
      const otherUser = uniqueUsers.find((user) => user !== currentUser.username);
      setChatPartner(otherUser || "Unknown");
    }
  }, [currentUser, messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "Unknown Time";
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown Date";
    return new Date(timestamp).toLocaleDateString([], {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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

  const renderMedia = (fileUrl) => {
    if (!fileUrl) return null;
    const file = fileUrl.startsWith("http") ? fileUrl : `${backendBaseURL}${fileUrl}`;
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
          </audio>
        </div>
      );
    }
    if (["mp4", "webm", "ogg"].includes(fileExtension)) {
      return (
        <div className="message-video">
          <video controls width="300">
            <source src={file} type={`video/${fileExtension}`} />
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !mediaFile) return;

    const formData = new FormData();
    formData.append("chat_room", chatroom_id);
    formData.append("content", newMessage);
    if (mediaFile) {
      formData.append("file", mediaFile);
    }

    try {
      const response = await AxiosInstance.post(
        `chat/chatrooms/${chatroom_id}/messages/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Message Sent:", response.data);
      // Send the new message via WebSocket
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            message: response.data.content,
            sender_id: currentUser.id, // Use ID instead of username
            message_type: response.data.message_type, // Ensure message type is included
          })
        );
      }
      setMessages([...messages, response.data]);
      setNewMessage("");
      setMediaFile(null);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Error sending message: " + error.message);
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji.native);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="chatroom-container">
      <h1 className="chatroom-title">{chatPartner}</h1>
      <div className="messages-container">
        {messages.length === 0 ? (
          <p className="no-messages">No messages yet</p>
        ) : (
          Object.keys(groupedMessages).map((date) => (
            <div key={date} className="date-group">
              <div className="date-header">{date}</div>
              <ul className="messages-list">
                {groupedMessages[date].map((message) => (
                  <li
                    key={message.id}
                    className={`message ${message.sender === currentUser?.username ? "sent" : "received"}`}
                  >
                    <div className="message-content">{message.content}</div>
                    {renderMedia(message.file)}
                    <div className="message-timestamp">{formatTime(message.timestamp)}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && <Picker onEmojiSelect={addEmoji} />}

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="message-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          😀
        </button>
        <input type="file" onChange={handleMediaChange} accept="image/*,audio/*,video/*,image/gif" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoomDetail;
