import React from "react";

const Header = ({ onClearChat, isClearing }) => {
  return (
    <header className="app-header">
      <div className="brand-wrapper">
        <div className="brand-title-row">
          <h1 className="brand-name">AskAI</h1>
          <div className="status-dot" title="AskAI is online"></div>
        </div>
        <p className="brand-tagline">Ask me anything</p>
      </div>
      <button
        onClick={onClearChat}
        disabled={isClearing}
        className="btn-clear"
        title="Clear entire conversation history"
      >
        <span className="material-symbols-outlined">
          {isClearing ? "sync" : "delete"}
        </span>
        <span>{isClearing ? "Clearing..." : "Clear Chat"}</span>
      </button>
    </header>
  );
};

export default Header;
