import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthorized } from "./_lib/auth.js";
import { resolveChatId, testTelegramConnection } from "./_lib/telegram.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
    if (!token) {
      return res.status(200).json({
        configured: false,
        error: "TELEGRAM_BOT_TOKEN не задан в Vercel",
      });
    }

    const preferred = process.env.TELEGRAM_CHAT_ID?.trim();
    const resolved = await resolveChatId(token, preferred);
    const test = resolved ? await testTelegramConnection() : null;

    return res.status(200).json({
      configured: true,
      preferredChatId: preferred ?? null,
      resolvedChatId: resolved,
      test,
    });
  }

  if (req.method === "POST") {
    const result = await testTelegramConnection();
    return res.status(result.ok ? 200 : 502).json(result);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
