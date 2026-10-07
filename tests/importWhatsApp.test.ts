import { describe, expect, it, vi } from "vitest";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runImport } from "../src/cli/importWhatsApp.js";

describe("WhatsApp import pipeline",()=>{
  it("writes messages and reply pairs as JSONL",async()=>{
    const dir=await mkdtemp(join(tmpdir(),"reply-ai-"));
    const input=join(dir,"chat.txt");
    const output=join(dir,"processed");
    await writeFile(input,[
      "7/10/26, 5:32 AM - Alice: where are you?",
      "7/10/26, 5:33 AM - Me: hostel 😭",
      "7/10/26, 5:34 AM - Alice: come outside",
      "7/10/26, 5:35 AM - Me: why 😭"
    ].join("\n"),"utf8");

    const log=vi.spyOn(console,"log").mockImplementation(()=>{});
    await runImport({input,me:"Me",conversationId:"test",output});

    const messages=(await readFile(join(output,"messages.jsonl"),"utf8")).trim().split("\n");
    const pairs=(await readFile(join(output,"reply_pairs.jsonl"),"utf8")).trim().split("\n");

    expect(messages).toHaveLength(4);
    expect(pairs).toHaveLength(2);
    expect(JSON.parse(pairs[1]).reply.text).toBe("why 😭");
    log.mockRestore();
  });
});