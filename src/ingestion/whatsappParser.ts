import type { Message } from "../types/message.js";

type HeaderMatch = {
  date: string;
  time: string;
  sender: string;
  text: string;
};

const DATE_TIME = String.raw`\\d{1,2}\\/\\d{1,2}\\/\\d{2,4},\\s*\\d{1,2}:\\d{2}(?::\\d{2})?(?:\\s?[AP]M)?`;
const HEADER_PATTERNS = [
  new RegExp(`^(${DATE_TIME})\\s-\\s(.+):\\s?(.*)import type { Message } from "../types/message.js";

type HeaderMatch = {
  date: string;
  time: string;
  sender: string;
  text: string;
};

, "i"),
  new RegExp(`^\\[(${DATE_TIME})\\]\\s(.+):\\s?(.*)import type { Message } from "../types/message.js";

type HeaderMatch = {
  date: string;
  time: string;
  sender: string;
  text: string;
};

, "i"),
];

const SYSTEM_LINE_PATTERN = new RegExp(`^\\[?${DATE_TIME}\\]?\\s-\\s`, "i");

function matchHeader(line: string): HeaderMatch | null {
  for (const pattern of HEADER_PATTERNS) {
    const match = line.match(pattern);
    if (!match) continue;

    const [, dateTime, senderAndText] = match;
    const separator = senderAndText.lastIndexOf(":");
    if (separator === -1) continue;

    const sender = senderAndText.slice(0, separator).trim();
    const text = senderAndText.slice(separator + 1).replace(/^\\s/, "");

    if (!sender) continue;

    const comma = dateTime.indexOf(",");
    return {
      date: dateTime.slice(0, comma),
      time: dateTime.slice(comma + 1).trim(),
      sender,
      text,
    };
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

    // System/event lines have a WhatsApp timestamp but no sender/message
    // separator. Never attach them to the preceding user's message.
    if (SYSTEM_LINE_PATTERN.test(rawLine)) continue;

    if (current && rawLine.trim()) {
      current.text += `\\n${rawLine}`;
    }
  }

  return messages;
}
