# Requirements: AI-Powered FAQ Chatbot Portal

**Defined:** 2026-06-11
**Core Value:** Enable users to have frictionless, context-aware conversations with an AI chatbot under a dark, premium, editorial chat interface that operates with high responsiveness and session persistence.

## v1 Requirements

### Backend Services

- [ ] **BACK-01**: Express backend server running on configurable PORT (default 5000) with CORS enabled for the frontend origin.
- [ ] **BACK-02**: Connect to MongoDB Atlas using standard `MONGO_URI` connection strings.
- [ ] **BACK-03**: Mongoose ChatHistory model containing indexed `sessionId`, an array of messages with `role` ("user" or "model"), `text`, and `timestamp`, plus standard `createdAt`/`updatedAt` timestamps.
- [ ] **BACK-04**: POST `/api/chat` route to retrieve/create chat history, initialize a Gemini chat session with `startChat()` using official `@google/generative-ai` package, send the message, store user/model exchanges in MongoDB, and return the reply.
- [ ] **BACK-05**: GET `/api/chat/:sessionId` route returning the full array of chat history for the given session ID.
- [ ] **BACK-06**: DELETE `/api/chat/:sessionId` route to wipe the session history from MongoDB and return `{ success: true }`.

### Frontend Application

- [ ] **FRONT-01**: React + Vite SPA using plain CSS styling (no Tailwind CSS, no UI frameworks) and Inter font.
- [ ] **FRONT-02**: Dark premium UI theme featuring near black backgrounds (`#0a0a0f`), surface cards (`#111118`), soft purple accents (`#7c6fff`), white text user bubbles, and dark AI bubbles (`#1a1a24`).
- [ ] **FRONT-03**: Random `sessionId` generator on first launch with persistence in `localStorage` for session retention.
- [ ] **FRONT-04**: Fetch and populate existing messages from the backend on mount.
- [ ] **FRONT-05**: Header component displaying "AskAI", an online indicator dot with purple glow animation, and a functional "Clear Chat" button (trash icon/text).
- [ ] **FRONT-06**: ChatWindow component that renders scrollable message bubbles with user/AI avatars, timestamps (HH:MM), and a dynamic TypingIndicator with three bouncing dots.
- [ ] **FRONT-07**: Message list auto-scrolling to the bottom upon receipt of a new message or when loading finishes.
- [ ] **FRONT-08**: InputBar component showing an auto-resizing textarea (up to 4 rows), a submit button with arrow icon, enter-key submission, loading spinner, and disabled inputs during loading.
- [ ] **FRONT-09**: Error toast display at bottom center (red, auto-dismissing after 3 seconds) for failed API calls.

## v2 Requirements

### Analytics & Moderation

- **ANAL-01**: Admin dashboard showing overall chatbot usage, total sessions, and common user queries.
- **MODR-01**: User feedback mechanism for rating AI responses (thumbs up/down).
- **MODR-02**: Moderation filter on input queries to prevent prompt injection or offensive terms.

## Out of Scope

| Feature | Reason |
|---------|--------|
| User authentication | Not requested; anonymous session IDs are sufficient for the chatbot scope. |
| Multi-turn document uploads | Out of scope for a basic FAQ chatbot. |
| Tailwind CSS integration | User explicitly requested plain CSS only. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BACK-01 | Phase 1 | Pending |
| BACK-02 | Phase 1 | Pending |
| BACK-03 | Phase 1 | Pending |
| BACK-04 | Phase 2 | Pending |
| BACK-05 | Phase 2 | Pending |
| BACK-06 | Phase 2 | Pending |
| FRONT-01 | Phase 3 | Pending |
| FRONT-02 | Phase 3 | Pending |
| FRONT-03 | Phase 3 | Pending |
| FRONT-04 | Phase 4 | Pending |
| FRONT-05 | Phase 4 | Pending |
| FRONT-06 | Phase 4 | Pending |
| FRONT-07 | Phase 4 | Pending |
| FRONT-08 | Phase 5 | Pending |
| FRONT-09 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0 ✓

---
*Requirements defined: 2026-06-11*
*Last updated: 2026-06-11 after initial definition*
