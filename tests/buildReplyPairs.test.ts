import {describe,expect,it} from "vitest";
import {parseWhatsAppExport} from "../src/ingestion/whatsappParser.js";
import {buildReplyPairs} from "../src/preprocessing/buildReplyPairs.js";
describe("buildReplyPairs",()=>{it("creates context reply examples",()=>{const input=["7/10/26, 5:32 AM - Alice: where are you?","7/10/26, 5:33 AM - Me: hostel","7/10/26, 5:34 AM - Alice: come outside","7/10/26, 5:35 AM - Me: why 😭"].join("\n");const p=buildReplyPairs(parseWhatsAppExport(input,"Me","test"));expect(p).toHaveLength(2);expect(p[1].reply.text).toBe("why 😭");});});