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

  // Handle custom cursor and ambient background parallax
  useEffect(() => {
    const cursor = document.querySelector(".custom-cursor");
    const orbsContainer = document.querySelector(".ambient-orbs-container");

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;

      // Update cursor position directly in DOM for performance
      if (cursor) {
        cursor.style.left = `${clientX}px`;
        cursor.style.top = `${clientY}px`;
      }

      // Update orb parallax position directly in DOM
      if (orbsContainer) {
        const { innerWidth, innerHeight } = window;
        // Normalize coordinates from -0.5 to 0.5
        const offsetX = (clientX / innerWidth) - 0.5;
        const offsetY = (clientY / innerHeight) - 0.5;
        
        // Max shift is 30px (-30px to 30px)
        const shiftX = offsetX * 60;
        const shiftY = offsetY * 60;

        orbsContainer.style.setProperty("--orb-x", `${shiftX}px`);
        orbsContainer.style.setProperty("--orb-y", `${shiftY}px`);
      }
    };

    const handleMouseOver = (e) => {
      // Toggle cursor scaling on hover of interactive items
      const isInteractive = e.target.closest("a, button, input, textarea, select, .interactive, .suggestion-chip");
      if (cursor) {
        if (isInteractive) {
          cursor.classList.add("hovering");
        } else {
          cursor.classList.remove("hovering");
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

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
    <>
      <div id="custom-cursor" className="custom-cursor" aria-hidden="true"></div>
      <div className="ambient-orbs-container" aria-hidden="true">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>
      <div className="app-container">
        <div className="film-grain" aria-hidden="true"></div>

        <Header onClearChat={handleClearChat} isClearing={isClearing} />
        <ChatWindow 
          messages={messages} 
          isLoading={isLoading} 
          onSendMessage={handleSendMessage} 
        />
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
    </>
  );
}

export default App;
