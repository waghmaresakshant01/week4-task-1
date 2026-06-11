import React, { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const ChatWindow = ({ messages, isLoading }) => {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new message or when loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="chat-window">
      {messages.length === 0 ? (
        <div className="chat-empty">
          <span className="material-symbols-outlined chat-empty-icon">
            forum
          </span>
          <h2 className="chat-empty-title">Welcome to AskAI</h2>
          <p className="chat-empty-desc">
            Your premium FAQ companion. Ask me anything about our services, policies, or general questions!
          </p>
        </div>
      ) : (
        messages.map((msg, index) => (
          <MessageBubble
            key={msg._id || index}
            role={msg.role}
            text={msg.text}
            timestamp={msg.timestamp}
          />
        ))
      )}

      {isLoading && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
