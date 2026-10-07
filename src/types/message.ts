import { z } from "zod";

export const MessageSchema = z.object({ id:z.string(), conversationId:z.string(), timestamp:z.string(), sender:z.string(), isMe:z.boolean(), text:z.string(), source:z.string() });
export type Message = z.infer<typeof MessageSchema>;
export const ReplyPairSchema = z.object({ conversationId:z.string(), context:z.array(MessageSchema), reply:MessageSchema });
export type ReplyPair = z.infer<typeof ReplyPairSchema>;