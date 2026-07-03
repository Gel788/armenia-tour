import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthorized } from "./_lib/auth.js";
import { groupChatIdFromEnv, testTelegramConnection } from "./_lib/telegram.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const preferred = process.env.TELEGRAM_CHAT_ID?.trim();
  const groupChatId = groupChatIdFromEnv(preferred);

  if (req.method === "GET") {
    return res.status(200).json({
      configured: Boolean(token && groupChatId),
      envChatId: preferred ?? null,
      groupChatId,
      note: "Заявки идут только в группу, не в личку бота",
    });
  }

  if (req.method === "POST") {
    const result = await testTelegramConnection();
    return res.status(result.ok ? 200 : 502).json(result);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
