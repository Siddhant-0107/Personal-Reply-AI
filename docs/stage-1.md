# Stage 1 — Chat Data Pipeline

## Done

- [x] Canonical message schema
- [x] WhatsApp parser
- [x] Multiline messages
- [x] Reply-pair construction
- [x] JSONL writer
- [x] CLI importer
- [x] End-to-end tests

## Usage

```bash
npm install
npm run import -- --input ./chat.txt --me "Your Name"
```

Optional:

```bash
npm run import -- --input ./chat.txt --me "Your Name" --conversation-id girlfriend --output ./data/processed
```

Generated files:

- `messages.jsonl` — canonical parsed messages
- `reply_pairs.jsonl` — conversation context → user's reply

## Important

Never commit your real chat export or generated personal dataset. These are ignored by `.gitignore`.

## Next

Validate the parser against a real export, then add robust cleaning and media/system-message handling.