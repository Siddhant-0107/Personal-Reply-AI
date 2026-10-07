import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { parseWhatsAppExport } from "../ingestion/whatsappParser.js";
import { buildReplyPairs } from "../preprocessing/buildReplyPairs.js";
import { writeJsonl } from "../utils/writeJsonl.js";

type Args = { input:string; me:string; conversationId:string; output:string };

function parseArgs(argv:string[]):Args{
  const get=(name:string, fallback?:string)=>{
    const i=argv.indexOf(name);
    return i>=0 && argv[i+1] ? argv[i+1] : fallback;
  };
  const input=get("--input") ?? argv.find(x=>!x.startsWith("--"));
  const me=get("--me");
  if(!input || !me) throw new Error("Usage: npm run import -- --input <chat.txt> --me <your name> [--conversation-id <id>] [--output <dir>]");
  return {
    input:resolve(input),
    me,
    conversationId:get("--conversation-id", basename(input).replace(/\.txt$/i,""))!,
    output:resolve(get("--output","data/processed")!)
  };
}

export async function runImport(args:Args){
  const raw=await readFile(args.input,"utf8");
  const messages=parseWhatsAppExport(raw,args.me,args.conversationId);
  const replyPairs=buildReplyPairs(messages);
  await writeJsonl(resolve(args.output,"messages.jsonl"),messages);
  await writeJsonl(resolve(args.output,"reply_pairs.jsonl"),replyPairs);
  console.log("Import complete.");
  console.log("Messages:",messages.length);
  console.log("Reply pairs:",replyPairs.length);
  console.log("Output:",args.output);
}

if (process.argv[1]?.endsWith("importWhatsApp.ts") || process.argv[1]?.endsWith("importWhatsApp.js")){
  runImport(parseArgs(process.argv.slice(2))).catch(error=>{
    console.error("Import failed:",error instanceof Error ? error.message : error);
    process.exitCode=1;
  });
}