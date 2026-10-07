import type { Message } from "../types/message.js";

const LINE_PATTERNS = [/^(\\d{1,2}\\/\\d{1,2}\\/\\d{2,4}),\\s*(\\d{1,2}:\\d{2}(?:\\s?[AP]M)?)\\s-\\s([^:]+):\\s?(.*)$/i,/^\\[(\\d{1,2}\\/\\d{1,2}\\/\\d{2,4}),\\s*(\\d{1,2}:\\d{2}(?:\\s?[AP]M)?)\\]\\s([^:]+):\\s?(.*)$/i];

export function parseWhatsAppExport(input:string,myName:string,conversationId="default"):Message[]{
 const messages:Message[]=[]; let current:Message|null=null;
 for(const line of input.replace(/^\\uFEFF/,"").split(/\\r?\\n/)){
  const match=LINE_PATTERNS.map(p=>line.match(p)).find(Boolean);
  if(match){const [,date,time,sender,text]=match; current={id:"msg_"+(messages.length+1),conversationId,timestamp:date+" "+time,sender:sender.trim(),isMe:sender.trim()===myName,text:text??"",source:"whatsapp"};messages.push(current);}
  else if(current&&line.trim()) current.text+="\\n"+line;
 }
 return messages;
}