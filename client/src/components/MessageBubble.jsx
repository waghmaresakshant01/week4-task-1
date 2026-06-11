import React from "react";

const MessageBubble = ({ role, text, timestamp }) => {
  const isUser = role === "user";

  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const date = new Date(timeString);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    } catch (e) {
      return "";
    }
  };

  return (
    <div className={`message-row ${role}`}>
      <div className="avatar-wrapper">
        <span className="material-symbols-outlined">
          {isUser ? "person" : "spark"}
        </span>
      </div>
      <div className="bubble-content-wrapper">
        <div className="message-bubble">{text}</div>
        {timestamp && (
          <div className="bubble-time" title={new Date(timestamp).toLocaleString()}>
            {formatTime(timestamp)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
