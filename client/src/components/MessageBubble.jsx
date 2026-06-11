import React from "react";

const parseInlineFormatting = (text) => {
  const parts = text.split(/(\*\*[\s\S]*?\*\*|\*[\s\S]*?\*|`[\s\S]*?`|\[[\s\S]*?\]\([\s\S]*?\))/g);
  
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("[") && part.includes("](")) {
      const linkMatch = part.match(/\[([\s\S]*?)\]\(([\s\S]*?)\)/);
      if (linkMatch) {
        return (
          <a 
            key={index} 
            href={linkMatch[2]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="interactive"
          >
            {linkMatch[1]}
          </a>
        );
      }
    }
    return part;
  });
};

const parseInlineAndLines = (text, blockKey) => {
  const lines = text.split("\n");
  const elements = [];
  let currentList = null;

  const flushList = (key) => {
    if (currentList) {
      const ListTag = currentList.type;
      elements.push(
        <ListTag key={key}>
          {currentList.items.map((item, i) => (
            <li key={i}>{parseInlineFormatting(item)}</li>
          ))}
        </ListTag>
      );
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const ulMatch = line.match(/^[\*\-]\s+(.*)/);
    const olMatch = line.match(/^\d+\.\s+(.*)/);

    if (ulMatch) {
      if (!currentList || currentList.type !== "ul") {
        flushList(`list-flush-${i}`);
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(ulMatch[1]);
    } else if (olMatch) {
      if (!currentList || currentList.type !== "ol") {
        flushList(`list-flush-${i}`);
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(olMatch[1]);
    } else {
      flushList(`list-flush-${i}`);
      const trimmed = line.trim();
      if (trimmed === "") {
        continue;
      }
      if (trimmed.startsWith("### ")) {
        elements.push(<h3 key={`h3-${i}`}>{parseInlineFormatting(trimmed.substring(4))}</h3>);
      } else if (trimmed.startsWith("## ")) {
        elements.push(<h2 key={`h2-${i}`}>{parseInlineFormatting(trimmed.substring(3))}</h2>);
      } else if (trimmed.startsWith("# ")) {
        elements.push(<h1 key={`h1-${i}`}>{parseInlineFormatting(trimmed.substring(2))}</h1>);
      } else {
        elements.push(<p key={`p-${i}`}>{parseInlineFormatting(line)}</p>);
      }
    }
  }

  flushList(`list-flush-end-${blockKey}`);
  return <React.Fragment key={blockKey}>{elements}</React.Fragment>;
};

const parseMarkdown = (text) => {
  if (!text) return "";
  const parts = text.split(/(```[\s\S]*?```)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      const language = match ? match[1] : "";
      const code = match ? match[2] : part.slice(3, -3);
      return (
        <pre key={index} className="code-block">
          {language && <div className="code-lang">{language}</div>}
          <code>{code}</code>
        </pre>
      );
    } else {
      return parseInlineAndLines(part, index);
    }
  });
};

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
          {isUser ? "person" : "smart_toy"}
        </span>
      </div>
      <div className="bubble-content-wrapper">
        <div className="message-bubble">
          {isUser ? text : parseMarkdown(text)}
        </div>
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
