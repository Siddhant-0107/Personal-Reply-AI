import type { Message } from "../types/message.js";

type HeaderMatch = {
  date: string;
  time: string;
  sender: string;
  text: string;
};

const HEADER_PATTERNS = [
  /^(\\d{1,2}\\/\\d{1,2}\\/\\d{2,4}),\\s*(\\d{1,2}:\\d{2}(?::\\d{2})?(?:\\s?[AP]M)?)\\s-\\s(.+?):\\s?(.*)$/i,
  /^\\[(\\d{1,2}\\/\\d{1,2}\\/\\d{2,4}),\\s*(\\d{1,2}:\\d{2}(?::\\d{2})?(?:\\s?[AP]M)?)\\]\\s(.+?):\\s?(.*)$/i,
];

function matchHeader(line: string): HeaderMatch | null {
  for (const pattern of HEADER_PATTERNS) {
    const match = line.match(pattern);
    if (match) {
      const [, date, time, sender, text] = match;
      return {
        date,
        time,
        sender: sender.trim(),
        text: text ?? "",
      };
    }
  }

  return null;
}

function normalizeInput(input: string): string {
  return input.replace(/^\\uFEFF/, "").replace(/\\r\\n/g, "\\n").replace(/\\r/g, "\\n");
}

/**
 * Parse a WhatsApp text export into canonical messages.
 *
 * Supported common formats:
 *   7/10/26, 5:32 AM - Alice: hello
 *   07/10/2026, 17:32 - Alice: hello
 *   [7/10/26, 5:32 AM] Alice: hello
 *
 * Lines that do not contain a sender/message separator are treated as
 * system messages or continuations of the previous message.
 */
export function parseWhatsAppExport(
  input: string,
  myName: string,
  conversationId = "default",
): Message[] {
  if (!myName.trim()) {
    throw new Error("myName must not be empty");
  }

  const messages: Message[] = [];
  let current: Message | null = null;

  for (const rawLine of normalizeInput(input).split("\\n")) {
    const header = matchHeader(rawLine);

    if (header) {
      current = {
        id: `msg_${messages.length + 1}`,
        conversationId,
        timestamp: `${header.date} ${header.time}`,
        sender: header.sender,
        isMe: header.sender === myName.trim(),
        text: header.text,
        source: "whatsapp",
      };

      messages.push(current);
      continue;
    }

    // WhatsApp system/event lines (e.g. encryption notices, participants
    // joining/leaving, security-code changes) have no sender separator.
    // Do not accidentally turn them into training messages.
    if (current && rawLine.trim()) {
      current.text += `\\n${rawLine}`;
    }
  }

  return messages;
}
