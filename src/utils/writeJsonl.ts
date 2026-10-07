import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export async function writeJsonl(path:string, rows:unknown[]):Promise<void>{
  await mkdir(dirname(path), { recursive:true });
  const content = rows.map(row => JSON.stringify(row)).join("\n") + (rows.length ? "\n" : "");
  await writeFile(path, content, "utf8");
}