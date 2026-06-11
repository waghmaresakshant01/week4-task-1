import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import InputBar from "./components/InputBar";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getOrGenerateSessionId = () => {
  let sessionId = localStorage.getItem("askai_session_id");
  if (!sessionId) {
    sessionId = `session_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    localStorage.setItem("askai_session_id", sessionId);
  }
  return sessionId;
};

function App() {
  const [sessionId] = useState(getOrGenerateSessionId);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/chat/${sessionId}`);
        if (!res.ok) {
          throw new Error("Failed to load chat history");
        }
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error loading chat history:", err);
        showError("Unable to connect to the chat server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [sessionId]);

  // Handle toast timeout
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const showError = (msg) => {
    setError(msg);
  };

  const handleSendMessage = async (text) => {
    // 1. Instantly append user message to local state
    const userMessage = {
      role: "user",
      text,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 2. Post to backend API
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sessionId,
          message: text
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to send message");
      }

      const data = await res.json();
      
      // 3. Update state with the updated messages from DB to ensure timestamps/ids match
      setMessages(data.history);
    } catch (err) {
      console.error("Error sending message:", err);
      showError(err.message || "Unable to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (messages.length === 0) return;
    
    setIsClearing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/${sessionId}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("Failed to clear chat history");
      }

      setMessages([]);
    } catch (err) {
      console.error("Error clearing chat:", err);
      showError("Failed to clear chat history. Please try again.");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="app-container">
      <div className="film-grain" aria-hidden="true"></div>
      <div className="ambient-glow" aria-hidden="true"></div>
      <div className="ambient-glow-left" aria-hidden="true"></div>

      <Header onClearChat={handleClearChat} isClearing={isClearing} />
      <ChatWindow messages={messages} isLoading={isLoading} />
      <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />

      {error && (
        <div className="error-toast">
          <span className="material-symbols-outlined error-toast-icon">
            error
          </span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default App;
