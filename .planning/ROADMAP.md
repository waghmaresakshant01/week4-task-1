# Roadmap: AI-Powered FAQ Chatbot Portal

## Overview

Build and deploy a full-stack, session-persistent FAQ chatbot portal featuring a highly polished, premium dark UI inspired by elite digital designs, integrating Gemini 1.5 Flash API for conversational intelligence.

## Phases

- [x] **Phase 1: Backend Foundation** - Express server configuration, MongoDB Atlas connection, and ChatHistory model schema.
- [x] **Phase 2: Chat API & Gemini Integration** - Chat history retrieval, deletion, and Gemini API integration with startChat() session history.
- [x] **Phase 3: Frontend Setup & Dark Theme** - React + Vite frontend setup, styling system config, and base dark layout.
- [x] **Phase 4: Message Flow & Navigation** - Session ID persistence, Header, scrollable ChatWindow, MessageBubbles, and Clear Chat functionality.
- [x] **Phase 5: Input Control, Feedback & Polish** - Auto-resizing InputBar, TypingIndicator, Error toast, and message fade-in animations.

---

## Phase Details

### Phase 1: Backend Foundation
**Goal**: Establish a running Node.js + Express backend with MongoDB connection and ChatHistory schema.
**Depends on**: Nothing
**Requirements**: [BACK-01, BACK-02, BACK-03]
**Success Criteria**:
  1. Backend runs on PORT from .env.
  2. Successfully connects to MongoDB Atlas using mongoose.
  3. Mongoose model saves and retrieves chat messages structured with session IDs.
**Plans**: 1 plan

Plans:
- [x] 01-01: Set up server infrastructure and MongoDB models

### Phase 2: Chat API & Gemini Integration
**Goal**: Implement chat history API endpoints and integrate Gemini 1.5 Flash with startChat() history.
**Depends on**: Phase 1
**Requirements**: [BACK-04, BACK-05, BACK-06]
**Success Criteria**:
  1. API returns full message history for a given session ID.
  2. POST /api/chat triggers a Gemini API request using history and stores both user and model messages.
  3. DELETE /api/chat/:sessionId clears the database record for that session.
**Plans**: 1 plan

Plans:
- [x] 02-01: Build chat routes and wire up generative AI client

### Phase 3: Frontend Setup & Dark Theme
**Goal**: Create a React app with a premium dark theme styling system in plain CSS.
**Depends on**: Phase 2
**Requirements**: [FRONT-01, FRONT-02, FRONT-03]
**Success Criteria**:
  1. Frontend page loads with font Inter, near black background (#0a0a0f), and layout structure.
  2. Client generates and stores a unique sessionId in localStorage.
**Plans**: 1 plan

Plans:
- [x] 03-01: Bootstrap client app and design system tokens

### Phase 4: Message Flow & Navigation
**Goal**: Implement history loading, Header, MessageBubbles, and Clear Chat.
**Depends on**: Phase 3
**Requirements**: [FRONT-04, FRONT-05, FRONT-06, FRONT-07]
**Success Criteria**:
  1. Existing chat history is fetched from the server and rendered on mount.
  2. Clear Chat button deletes history on the server and updates UI state.
  3. Message bubbles display user/AI avatars, timestamp, and align correctly.
  4. Message window auto-scrolls to the bottom upon receiving new content.
**Plans**: 1 plan

Plans:
- [x] 04-01: Build header, message windows, and history synchronizer

### Phase 5: Input Control, Feedback & Polish
**Goal**: Build the InputBar, TypingIndicator, loading spinner, error toast, and styling animations.
**Depends on**: Phase 4
**Requirements**: [FRONT-08, FRONT-09]
**Success Criteria**:
  1. Input textarea auto-resizes dynamically up to 4 rows.
  2. Bouncing dot TypingIndicator animates while waiting for responses.
  3. Error toast appears at bottom center on API failure and auto-dismisses in 3s.
  4. Messages animate smoothly (fade-in) when added.
**Plans**: 1 plan

Plans:
- [x] 05-01: Code InputBar, indicators, toasts, and styling animations

---

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Backend Foundation | 1/1 | Completed | 2026-06-11 |
| 2. Chat API & Gemini Integration | 1/1 | Completed | 2026-06-11 |
| 3. Frontend Setup & Dark Theme | 1/1 | Completed | 2026-06-11 |
| 4. Message Flow & Navigation | 1/1 | Completed | 2026-06-11 |
| 5. Input Control, Feedback & Polish | 1/1 | Completed | 2026-06-11 |

