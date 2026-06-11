import React from "react";

const Header = ({ onClearChat, isClearing }) => {
  return (
    <header className="app-header">
      <div className="brand-wrapper interactive">
        <span className="material-symbols-outlined brand-logo-icon">
          temp_preferences_custom
        </span>
        <div className="brand-title-row">
          <h1 className="brand-name">AskAI</h1>
          <div className="status-dot" title="AskAI is online"></div>
        </div>
      </div>
      <div className="header-actions">
        <button
          onClick={onClearChat}
          disabled={isClearing}
          className="btn-clear interactive"
          title="Clear entire conversation history"
        >
          <span className="material-symbols-outlined">
            {isClearing ? "sync" : "mop"}
          </span>
          <span>{isClearing ? "Clearing..." : "Clear Chat"}</span>
        </button>
        <button 
          className="btn-record interactive" 
          type="button" 
          title="Toggle status"
          aria-label="Status record indicator"
        >
          <span className="material-symbols-outlined">
            radio_button_checked
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
