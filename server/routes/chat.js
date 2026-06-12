const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require("mongoose");
const ChatHistory = require("../models/ChatHistory");

// Simple in-memory fallback database for sessions
const inMemoryDb = new Map();

// Helper to get session history (MDB or Memory fallback)
async function getSessionHistory(sessionId) {
  if (mongoose.connection.readyState === 1) {
    try {
      let chatHistory = await ChatHistory.findOne({ sessionId });
      if (!chatHistory) {
        chatHistory = new ChatHistory({ sessionId, messages: [] });
      }
      return chatHistory;
    } catch (err) {
      console.error("MongoDB findOne failed, falling back to memory:", err);
    }
  }
  
  // Fallback to in-memory store
  if (!inMemoryDb.has(sessionId)) {
    inMemoryDb.set(sessionId, { sessionId, messages: [] });
  }
  return inMemoryDb.get(sessionId);
}

// Helper to save session history (MDB or Memory fallback)
async function saveSessionHistory(chatHistory, newMessages) {
  if (mongoose.connection.readyState === 1 && typeof chatHistory.save === "function") {
    try {
      chatHistory.messages.push(...newMessages);
      await chatHistory.save();
      return;
    } catch (err) {
      console.error("MongoDB save failed, falling back to memory:", err);
    }
  }

  // Save to in-memory fallback
  const session = inMemoryDb.get(chatHistory.sessionId) || { sessionId: chatHistory.sessionId, messages: [] };
  session.messages.push(...newMessages);
  inMemoryDb.set(chatHistory.sessionId, session);
}

// Helper to delete session history (MDB or Memory fallback)
async function deleteSessionHistory(sessionId) {
  if (mongoose.connection.readyState === 1) {
    try {
      await ChatHistory.deleteOne({ sessionId });
    } catch (err) {
      console.error("MongoDB delete failed:", err);
    }
  }
  inMemoryDb.delete(sessionId);
}

// POST /api/chat - Send message and get AI reply
router.post("/", async (req, res) => {
  const { sessionId, message } = req.body;

  if (!sessionId || !message) {
    return res.status(400).json({ error: "sessionId and message are required" });
  }

  try {
    // 1. Load chat history (database or in-memory fallback)
    const chatHistory = await getSessionHistory(sessionId);

    // 2. Build Gemini chat history from stored messages
    // The API expects: [{ role: 'user'|'model', parts: [{ text: '...' }] }]
    const history = chatHistory.messages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // 3. Initialize Gemini API (e.g. gemini-3.1-flash-lite)
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    // 4. Start chat with existing history
    const chat = model.startChat({ history });

    // 5. Send message and get response
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    // 6. Save both user message and AI response (database or in-memory fallback)
    const newMessages = [
      { role: "user", text: message, timestamp: new Date() },
      { role: "model", text: reply, timestamp: new Date() }
    ];
    await saveSessionHistory(chatHistory, newMessages);

    // 7. Return reply, sessionId, and updated messages
    res.json({
      reply,
      sessionId,
      history: chatHistory.messages
    });
  } catch (err) {
    console.error("Error in POST /api/chat:", err);
    res.status(500).json({ error: err.message || "Failed to process chat message" });
  }
});

// GET /api/chat/:sessionId - Retrieve full chat history for a session
router.get("/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const chatHistory = await getSessionHistory(sessionId);
    res.json(chatHistory.messages);
  } catch (err) {
    console.error("Error in GET /api/chat/:sessionId:", err);
    res.status(500).json({ error: "Failed to retrieve chat history" });
  }
});

// DELETE /api/chat/:sessionId - Wipe chat history for a session
router.delete("/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    await deleteSessionHistory(sessionId);
    res.json({ success: true });
  } catch (err) {
    console.error("Error in DELETE /api/chat/:sessionId:", err);
    res.status(500).json({ error: "Failed to clear chat history" });
  }
});

module.exports = router;

