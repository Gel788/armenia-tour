import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthorized } from "./_lib/auth.js";
import { getKnownChatIds, resolveChatId, testTelegramConnection } from "./_lib/telegram.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();

  if (req.method === "GET") {
    if (!token) {
      return res.status(200).json({
        configured: false,
        error: "TELEGRAM_BOT_TOKEN не задан в Vercel",
      });
    }

    const knownChatIds = await getKnownChatIds(token);
    const preferred = process.env.TELEGRAM_CHAT_ID?.trim();
    const resolved = await resolveChatId(token, preferred);

    return res.status(200).json({
      configured: true,
      preferredChatId: preferred ?? null,
      knownChatIds,
      resolvedChatId: resolved,
      hint:
        knownChatIds.length === 0
          ? "Открой t.me/armenians_school_bot и нажми Start"
          : "Chat найден — можно тестировать POST",
    });
  }

  if (req.method === "POST") {
    const result = await testTelegramConnection();
    return res.status(result.ok ? 200 : 502).json(result);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
