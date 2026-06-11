import React, { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const ChatWindow = ({ messages, isLoading, onSendMessage }) => {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new message or when loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const suggestions = [
    { text: "Optimize React component", icon: "code" },
    { text: "Design system tokens", icon: "palette" },
    { text: "Explain quantum computing", icon: "psychology" }
  ];

  return (
    <div className="chat-window">
      {messages.length === 0 ? (
        <div className="chat-empty">
          <span className="material-symbols-outlined chat-empty-icon animate-spin-slow" aria-hidden="true">
            flare
          </span>
          <h2 className="chat-empty-title">What do you want to know?</h2>
          <p className="chat-empty-desc">
            Ask anything. I can help with code, design, or deep philosophical inquiries.
          </p>
          <div className="chat-empty-chips">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(suggestion.text)}
                className="suggestion-chip interactive"
                type="button"
              >
                <span className="material-symbols-outlined text-sm text-primary">
                  {suggestion.icon}
                </span>
                <span>{suggestion.text}</span>
              </button>
            ))}
          </div>
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
