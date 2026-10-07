import { describe, expect, it } from "vitest";
import { parseWhatsAppExport } from "../src/ingestion/whatsappParser.js";

describe("parseWhatsAppExport", () => {
  it("parses 12-hour and 24-hour timestamps", () => {
    const input = [
      "7/10/26, 5:32 AM - Alice: morning",
      "07/10/2026, 17:33 - Me: done",
      "[7/10/2026, 17:34] Alice: okay",
    ].join("\n");

    const messages = parseWhatsAppExport(input, "Me", "test");

    expect(messages).toHaveLength(3);
    expect(messages[0].timestamp).toBe("7/10/26 5:32 AM");
    expect(messages[1].timestamp).toBe("07/10/2026 17:33");
    expect(messages[2].timestamp).toBe("7/10/2026 17:34");
    expect(messages[1].isMe).toBe(true);
  });

  it("preserves multiline messages, emojis, Hinglish and Unicode", () => {
    const input = [
      "7/10/26, 5:32 AM - Me: kya scene hai 😭",
      "kal library aa raha hu",
      "थोड़ा late होगा 😂",
    ].join("\n");

    const messages = parseWhatsAppExport(input, "Me");

    expect(messages).toHaveLength(1);
    expect(messages[0].text).toBe("kya scene hai 😭\nkal library aa raha hu\nथोड़ा late होगा 😂");
  });

  it("parses media omitted and deleted-message placeholders as normal message text", () => {
    const input = [
      "7/10/26, 5:32 AM - Alice: <Media omitted>",
      "7/10/26, 5:33 AM - Me: This message was deleted",
    ].join("\n");

    const messages = parseWhatsAppExport(input, "Me");

    expect(messages).toHaveLength(2);
    expect(messages[0].text).toBe("<Media omitted>");
    expect(messages[1].text).toBe("This message was deleted");
  });

  it("skips WhatsApp system/event lines", () => {
    const input = [
      "7/10/26, 5:32 AM - Alice: hello",
      "7/10/26, 5:33 AM - Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen to them.",
      "7/10/26, 5:34 AM - Me: hi",
    ].join("\n");

    const messages = parseWhatsAppExport(input, "Me");

    expect(messages).toHaveLength(2);
    expect(messages[1].text).toBe("hi");
  });

  it("supports names containing colons and message URLs", () => {
    const input = [
      "7/10/26, 5:32 AM - Dr: Strange: https://example.com/a:b",
      "7/10/26, 5:33 AM - Me: got it: thanks",
    ].join("\n");

    const messages = parseWhatsAppExport(input, "Me");

    expect(messages).toHaveLength(2);
    expect(messages[0].sender).toBe("Dr: Strange");
    expect(messages[0].text).toBe("https://example.com/a:b");
    expect(messages[1].text).toBe("got it: thanks");
  });

  it("keeps an explicitly empty message payload", () => {
    const input = "7/10/26, 5:32 AM - Me:";
    const messages = parseWhatsAppExport(input, "Me");

    expect(messages).toHaveLength(1);
    expect(messages[0].text).toBe("");
  });

  it("ignores blank lines outside messages", () => {
    const input = [
      "",
      "7/10/26, 5:32 AM - Alice: hello",
      "",
      "7/10/26, 5:33 AM - Me: hi",
      "",
    ].join("\n");

    expect(parseWhatsAppExport(input, "Me")).toHaveLength(2);
  });

  it("strips a UTF-8 BOM", () => {
    const input = "\uFEFF7/10/26, 5:32 AM - Me: hello";
    expect(parseWhatsAppExport(input, "Me")[0].text).toBe("hello");
  });

  it("rejects an empty self name", () => {
    expect(() => parseWhatsAppExport("anything", "   ")).toThrow("myName must not be empty");
  });
  it("strips invisible Unicode direction marks before parsing", () => {
    const input = "\u200E[7/10/2026, 17:34] Me: hello";
    const messages = parseWhatsAppExport(input, "Me");
    expect(messages).toHaveLength(1);
    expect(messages[0].sender).toBe("Me");
    expect(messages[0].text).toBe("hello");
  });
});
