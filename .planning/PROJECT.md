# AI-Powered FAQ Chatbot Portal

## What This Is

A full-stack AI-Powered FAQ Chatbot Portal named **AskAI** featuring a dark premium chat UI on the frontend (React + Vite + Plain CSS) and a robust backend (Node.js + Express + MongoDB + Gemini 1.5 Flash API) that tracks session-based chat history and handles continuous conversations using the Gemini API's `startChat()` method with session history persistence in MongoDB.

## Core Value

Enable users to have frictionless, context-aware conversations with an AI chatbot under a dark, premium, editorial chat interface that operates with high responsiveness and session persistence.

## Requirements

### Validated

- **CHAT-BACK-01**: Express backend server connecting to MongoDB Atlas and supporting session-based chat history. (Phase 1/2)
- **CHAT-BACK-02**: Mongoose ChatHistory model tracking sessionId, message role, text, and timestamps. (Phase 1)
- **CHAT-BACK-03**: Backend API POST `/api/chat` that loads history, initializes Gemini chat session with history, invokes Gemini 1.5 Flash, stores both messages in MongoDB, and returns the reply, sessionId, and updated history. (Phase 2)
- **CHAT-BACK-04**: Backend API GET `/api/chat/:sessionId` to retrieve full chat history. (Phase 2)
- **CHAT-BACK-05**: Backend API DELETE `/api/chat/:sessionId` to wipe chat history for a session. (Phase 2)
- **CHAT-FRONT-01**: React + Vite frontend styled with a dark premium theme (#0a0a0f, #111118, #7c6fff, #1a1a24, Inter font) and smooth message fade-in animations. (Phase 3)
- **CHAT-FRONT-02**: App.jsx layout housing Header, ChatWindow, and InputBar with random sessionId generation and localStorage persistence. (Phase 3)
- **CHAT-FRONT-03**: Header component displaying "AskAI" with an online green/purple glow dot indicator and a "Clear Chat" button. (Phase 4)
- **CHAT-FRONT-04**: ChatWindow component displaying message bubbles with user/AI avatars, timestamps, auto-scrolling to bottom, and TypingIndicator. (Phase 4)
- **CHAT-FRONT-05**: InputBar component supporting auto-resize textarea up to 4 rows, enter-to-submit (Shift+Enter for newline), disabled states, and a loading spinner. (Phase 5)
- **CHAT-FRONT-06**: Error handling with auto-dismissing inline toast on API failure. (Phase 5)

### Active

(None - All requirements have been completed and validated)

### Out of Scope

- [User accounts/Authentication] — Scope is limited to session ID stored in localStorage.
- [TailwindCSS/UI Libraries] — Strictly plain CSS as per user request.
- [TypeScript] — Explicitly asked to use JavaScript only.

## Context

- The UI design should draw inspiration from the Shinkei Systems premium dark editorial style used in previous projects, employing subtle borders, elegant typography, smooth transitions, and high-contrast styling.
- Backend calls Gemini 1.5 Flash using the official `@google/generative-ai` package and starts a chat using `startChat()` with historical messages formatted for Gemini (roles: `"user"` and `"model"`).

## Constraints

- **Language**: JavaScript only (no TypeScript)
- **Styling**: Plain CSS only (no Tailwind CSS, no UI frameworks)
- **Environment**: Must read credentials from `.env` on backend and backend URL from `.env` on frontend (via `import.meta.env.VITE_API_URL`).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Plain CSS | User explicitly requested no Tailwind or component libraries | — Implemented |
| Gemini Chat History Mapping | Convert MongoDB role `"model"` to Gemini API expected role `"model"` | — Implemented |
| Dark Premium Theme | Custom color palette (#0a0a0f, #111118, #7c6fff) matching high-end fintech aesthetics | — Implemented |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-11 after verification*
