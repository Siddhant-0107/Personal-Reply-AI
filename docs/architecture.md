# Architecture

## Ingestion

Every importer converts source-specific exports into a canonical message schema:

- conversation_id
- timestamp
- speaker
- text
- source
- message_id

## Pair construction

For each user reply, preserve the preceding conversation window rather than treating every message independently.

## Retrieval

Embed representative conversation turns. Store metadata for conversation, tone, language, topic, date, and length.

## Generation

Provide the current conversation, retrieved examples, stable style instructions, and desired tone/length to the model. Generate multiple candidates.

## Feedback

When the user edits or selects a candidate, save the correction as preference data. This teaches the system what the user actually prefers.
