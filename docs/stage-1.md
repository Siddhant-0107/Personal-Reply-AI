# Stage 1 — Chat Data Pipeline

## Done

- [x] Canonical message schema
- [x] WhatsApp parser
- [x] Multiline messages
- [x] Reply-pair construction
- [x] JSONL writer
- [x] CLI importer
- [x] End-to-end tests
- [x] Robust WhatsApp timestamp/header handling
- [x] 12-hour and 24-hour time support
- [x] UTF-8 BOM, CRLF/CR and Unicode/Hinglish support
- [x] Media/deleted-message placeholders preserved
- [x] Empty message payloads preserved
- [x] Timestamped system/event lines ignored
- [x] Sender names containing colons supported
- [x] URLs and message text containing colons preserved

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

## Parser behavior

The importer accepts common WhatsApp text-export variants such as:

```text
7/10/26, 5:32 AM - Alice: hello
07/10/2026, 17:33 - Me: done
[7/10/2026, 17:34] Alice: okay
```

It also handles:

- multiline messages
- emojis and non-Latin Unicode
- Hindi/Hinglish
- Windows/Unix line endings
- UTF-8 BOM at the beginning of an export
- `<Media omitted>`
- deleted-message placeholder text
- messages with URLs
- message text containing colons
- sender names containing colons
- empty message payloads

Timestamped WhatsApp system/event lines without a valid sender/message header are ignored rather than appended to the previous message.

## Validation

Run the parser tests with:

```bash
npm test
npm run build
```

Then validate against an actual export locally:

```bash
npm run import -- --input "./chat.txt" --me "Your Name"
```

Inspect:

```text
data/processed/messages.jsonl
data/processed/reply_pairs.jsonl
```

**Do not commit the real export or generated personal dataset.** These are ignored by `.gitignore`.

## Next

Stage 2: dataset cleaning and conversation reconstruction — remove unusable training examples, normalize metadata, detect attachment/system noise, and build higher-quality context → reply examples.
