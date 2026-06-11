const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ChatHistory = require("../models/ChatHistory");

// POST /api/chat - Send message and get AI reply
router.post("/", async (req, res) => {
  const { sessionId, message } = req.body;

  if (!sessionId || !message) {
    return res.status(400).json({ error: "sessionId and message are required" });
  }

  try {
    // 1. Load or create ChatHistory document by sessionId
    let chatHistory = await ChatHistory.findOne({ sessionId });
    if (!chatHistory) {
      chatHistory = new ChatHistory({ sessionId, messages: [] });
    }

    // 2. Build Gemini chat history from stored messages
    // The API expects: [{ role: 'user'|'model', parts: [{ text: '...' }] }]
    const history = chatHistory.messages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // 3. Initialize Gemini 1.5 Flash API
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. Start chat with existing history
    const chat = model.startChat({ history });

    // 5. Send message and get response
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    // 6. Save both user message and AI response to MongoDB
    chatHistory.messages.push({ role: "user", text: message, timestamp: new Date() });
    chatHistory.messages.push({ role: "model", text: reply, timestamp: new Date() });
    await chatHistory.save();

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
    const chatHistory = await ChatHistory.findOne({ sessionId });
    if (!chatHistory) {
      return res.json([]);
    }
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
    await ChatHistory.deleteOne({ sessionId });
    res.json({ success: true });
  } catch (err) {
    console.error("Error in DELETE /api/chat/:sessionId:", err);
    res.status(500).json({ error: "Failed to clear chat history" });
  }
});

module.exports = router;
