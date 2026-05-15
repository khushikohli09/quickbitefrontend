import React, { useState } from "react";
import axios from "axios";
import "../styles/Chatbot.css";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 API URL from environment variable
  const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    setChat((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const token =
        sessionStorage.getItem("token") ||
        localStorage.getItem("token");

      // ✅ Fixed: Use environment variable
      const res = await axios.post(
        `${API_URL}/api/chat`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const botMsg = { sender: "bot", text: res.data.reply || res.data.message || "Thanks for your message!" };
      setChat((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chatbot error:", err);
      
      let errorMessage = "Server error. Please try again.";
      if (err.response?.data?.reply) {
        errorMessage = err.response.data.reply;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }

    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      sendMessage();
    }
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <div className="chat-icon" onClick={() => setOpen(!open)}>
        🤖
      </div>

      {/* CHAT BOX */}
      {open && (
        <div className="chatbox">
          <div className="chat-header">
            <span>QuickBite Assistant 🍔</span>
            <span className="close-btn" onClick={() => setOpen(false)}>✖</span>
          </div>

          <div className="chat-body">
            {chat.length === 0 && (
              <div className="msg bot welcome">
                👋 Hi! I'm QuickBite Assistant. Ask me about menu, offers, or your orders!
              </div>
            )}
            {chat.map((c, i) => (
              <div
                key={i}
                className={`msg ${c.sender}`}
              >
                {c.sender === "bot" && <span className="bot-icon">🤖</span>}
                {c.text}
              </div>
            ))}
            {isLoading && (
              <div className="msg bot typing">
                <span className="bot-icon">🤖</span>
                Typing...
              </div>
            )}
          </div>

          <div className="chat-footer">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask something..."
              disabled={isLoading}
            />
            <button onClick={sendMessage} disabled={isLoading}>
              {isLoading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
