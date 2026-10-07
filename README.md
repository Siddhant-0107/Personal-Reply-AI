# Personal Reply AI

A privacy-first personal reply assistant that learns your conversational style from exported chat history and suggests replies to new messages.

## Goal

Turn historical conversations into searchable context and style memory, then use an LLM to generate replies that feel natural to you.

## Architecture

```
Chat export
   ↓
Parser / normalizer
   ↓
Message → reply dataset
   ↓
Embeddings + vector search
   ↓
Relevant conversation examples
   ↓
LLM + style profile
   ↓
3 reply candidates
   ↓
Human approval / edit
   ↓
Optional feedback memory
```

## Planned stack

- Node.js + TypeScript
- Express API
- React frontend
- MongoDB
- Vector search
- LLM provider abstraction
- Chat importers
- Optional local model support

## Privacy

Never commit raw personal chats, API keys, tokens, or exported conversation files.

The raw and processed data folders are ignored by Git. Keep sensitive data local.

## Roadmap

### Phase 1 — Dataset
- Import exported conversations
- Normalize timestamps and participants
- Identify your messages and preceding context
- Build reply pairs
- Sanitize and deduplicate

### Phase 2 — Reply engine
- Build a style profile
- Retrieve similar conversations
- Generate multiple candidate replies
- Add tone controls

### Phase 3 — Learning loop
- Capture selected and edited replies
- Store corrections
- Improve retrieval and style instructions
- Add evaluation metrics

### Phase 4 — Product
- Chat-style web UI
- Person/conversation profiles
- Searchable memory
- Optional deployment

## First milestone

Implement a WhatsApp-style text export parser and produce clean JSONL reply examples.
