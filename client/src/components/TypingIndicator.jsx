import React from "react";

const TypingIndicator = () => {
  return (
    <div className="message-row model">
      <div className="avatar-wrapper">
        <span className="material-symbols-outlined">smart_toy</span>
      </div>
      <div className="bubble-content-wrapper">
        <div className="typing-indicator-wrapper">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
