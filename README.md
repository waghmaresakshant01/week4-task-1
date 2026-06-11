# AskAI — AI-Powered FAQ Chatbot Portal

AskAI is a full-stack, session-persistent FAQ chatbot portal. It features a dark, premium, editorial chat interface on the frontend, and a Node.js + Express backend that integrates with MongoDB Atlas and the Gemini 1.5 Flash API for context-aware conversations.

## Project Structure
```text
faq-chatbot/
├── client/         (React + Vite frontend)
└── server/         (Node.js + Express backend)
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (local installation or Atlas cluster)
- Gemini API Key (obtain from Google AI Studio)

### Backend Setup (`server/`)
1. Navigate to the backend directory:
   ```bash
   cd server
   ```
2. Copy the environment variables template and configure it:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and configure:
   - `PORT`: Server port (default `5000`)
   - `MONGO_URI`: Your MongoDB connection string
   - `GEMINI_API_KEY`: Your Gemini API key
   - `CLIENT_URL`: URL of the frontend (default `http://localhost:5173`)
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   Or run the production command:
   ```bash
   npm start
   ```

### Frontend Setup (`client/`)
1. Navigate to the frontend directory:
   ```bash
   cd client
   ```
2. Copy the environment variables template:
   ```bash
   cp .env.example .env
   ```
   Ensure `VITE_API_URL` is set to the URL of the running backend (default `http://localhost:5000`).
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the React development server:
   ```bash
   npm run dev
   ```
5. Build the application for production:
   ```bash
   npm run build
   ```

---

## API Endpoints (Backend)

- **POST `/api/chat`**
  - **Body**: `{ sessionId: String, message: String }`
  - **Action**: Initializes a Gemini API chat session using existing conversation history from MongoDB, sends the user message, saves both user and model responses, and returns the response details.
  - **Response**: `{ reply: String, sessionId: String, history: Array }`

- **GET `/api/chat/:sessionId`**
  - **Action**: Returns the full chat history array for the given `sessionId`.
  - **Response**: `Array` of message objects.

- **DELETE `/api/chat/:sessionId`**
  - **Action**: Wipes the chat history associated with the given `sessionId` from the database.
  - **Response**: `{ success: true }`

---

## Deployment Notes

### Frontend: Deploying `client/` on Netlify
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Environment variables**:
  - `VITE_API_URL`: `https://your-render-backend.onrender.com`

### Backend: Deploying `server/` on Render
- **Build command**: `npm install`
- **Start command**: `node server.js`
- **Environment variables**:
  - `PORT`: Port number (e.g., `10000` or Render default)
  - `MONGO_URI`: Your MongoDB Atlas connection string
  - `GEMINI_API_KEY`: Your Gemini API key
  - `CLIENT_URL`: Your Netlify frontend URL (e.g., `https://your-app.netlify.app`)
