import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthorized } from "./_lib/auth.js";
import {
  buildChatCandidates,
  expandChatIdCandidates,
  getKnownChatIds,
  testTelegramConnection,
} from "./_lib/telegram.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const preferred = process.env.TELEGRAM_CHAT_ID?.trim();

  if (req.method === "GET") {
    if (!token) {
      return res.status(200).json({
        configured: false,
        error: "TELEGRAM_BOT_TOKEN не задан в Vercel",
      });
    }

    const knownChatIds = await getKnownChatIds(token);
    const candidates = buildChatCandidates(preferred, knownChatIds);

    return res.status(200).json({
      configured: true,
      preferredChatId: preferred ?? null,
      candidateChatIds: preferred ? expandChatIdCandidates(preferred) : [],
      knownChatIds,
      willTry: candidates,
    });
  }

  if (req.method === "POST") {
    const result = await testTelegramConnection();
    return res.status(result.ok ? 200 : 502).json(result);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
