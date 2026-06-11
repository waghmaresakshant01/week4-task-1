import React, { useState, useRef, useEffect } from "react";

const InputBar = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim() || isLoading) return;

    onSendMessage(text.trim());
    setText("");

    // Reset height explicitly
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="input-panel">
      <form onSubmit={handleSubmit} className="input-container">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          rows={1}
          disabled={isLoading}
          className="chat-textarea"
          aria-label="Chat input field"
        />
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="btn-send"
          aria-label="Send message"
        >
          {isLoading ? (
            <div className="spinner" />
          ) : (
            <span className="material-symbols-outlined">arrow_upward</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputBar;
