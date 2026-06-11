const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "model"],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatHistorySchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
      unique: true // Ensure only one document exists per sessionId
    },
    messages: [MessageSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ChatHistory", ChatHistorySchema);
