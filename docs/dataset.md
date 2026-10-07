# Dataset Design

## Canonical message

```json
{
  "conversation_id": "conversation-123",
  "timestamp": "2026-10-07T05:00:00+05:30",
  "speaker": "user",
  "text": "yesss I'm free tonight 😭",
  "source": "whatsapp"
}
```

## Reply example

```json
{
  "context": [
    {"speaker": "other", "text": "are you free tonight?"},
    {"speaker": "user", "text": "yesss I'm free tonight 😭"}
  ],
  "reply": "yesss I'm free tonight 😭"
}
```

Keep raw imports separate from processed data so preprocessing can be rerun safely.
