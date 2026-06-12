const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const chatRouter = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS config
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: clientUrl,
    credentials: true
  })
);

// Connect to MongoDB
mongoose.set("bufferCommands", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AskAI API Server</title>
      <style>
        body {
          background-color: #0a0a0f;
          color: #e2e2e9;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          overflow: hidden;
        }
        .container {
          background-color: #111118;
          border: 1px solid #1a1a24;
          padding: 40px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
          max-width: 400px;
          width: 90%;
        }
        .glow-dot {
          width: 12px;
          height: 12px;
          background-color: #00ff66;
          border-radius: 50%;
          display: inline-block;
          margin-bottom: 20px;
          box-shadow: 0 0 12px #00ff66;
        }
        h1 {
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 10px 0;
          color: #ffffff;
        }
        p {
          color: #7c6fff;
          font-size: 14px;
          margin: 0 0 20px 0;
        }
        .status-badge {
          background-color: rgba(124, 111, 255, 0.1);
          color: #7c6fff;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid rgba(124, 111, 255, 0.2);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="glow-dot"></div>
        <h1>AskAI Backend Server</h1>
        <p>API service is running and active.</p>
        <span class="status-badge">ONLINE</span>
      </div>
    </body>
    </html>
  `);
});

app.use("/api/chat", chatRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
