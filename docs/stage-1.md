# Stage 1 — Chat Data Pipeline

Goal: WhatsApp export → canonical messages → reply-pair dataset.

Definition of done:
- WhatsApp text exports parse correctly.
- Multiline messages are preserved.
- User messages are identified.
- Reply pairs preserve recent context.
- Tests pass.

Next: CLI import, cleaning rules, JSONL writer, and validation against a real export.