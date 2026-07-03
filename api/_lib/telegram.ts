type TelegramResult = { ok: true; chatId: string } | { ok: false; error: string };

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function tgApi<T>(token: string, method: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json() as Promise<T>;
}

/** PEER ID группы → chat_id для Bot API. Только группы (отрицательный id). */
export function groupChatIdFromEnv(raw?: string): string | null {
  const id = raw?.trim();
  if (!id) return null;
  if (id.startsWith("-")) return id;

  const digits = id.replace(/\D/g, "");
  if (!digits) return null;

  // PEER ID 5350043255 → группа «ЗАявки тура» = -5350043255
  return `-${digits}`;
}

async function sendToChat(
  token: string,
  chatId: string,
  text: string,
): Promise<{ ok: boolean; error?: string }> {
  type SendResult = { ok: boolean; description?: string };
  const result = await tgApi<SendResult>(token, "sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  });
  return result.ok ? { ok: true } : { ok: false, error: result.description };
}

export async function sendBookingToTelegram(
  lead: { name: string; phone: string; phoneAlt?: string; createdAt: string },
): Promise<TelegramResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = groupChatIdFromEnv(process.env.TELEGRAM_CHAT_ID);

  if (!token) {
    return { ok: false, error: "TELEGRAM_BOT_TOKEN не задан" };
  }
  if (!chatId) {
    return { ok: false, error: "TELEGRAM_CHAT_ID не задан" };
  }

  const lines = [
    "🆕 <b>Новая заявка на тур</b>",
    "",
    `👤 Имя: <b>${escapeHtml(lead.name)}</b>`,
    `📞 Телефон: <code>${escapeHtml(lead.phone)}</code>`,
  ];
  if (lead.phoneAlt) {
    lines.push(`📱 Доп. телефон: <code>${escapeHtml(lead.phoneAlt)}</code>`);
  }
  lines.push(
    "",
    `🕐 ${new Date(lead.createdAt).toLocaleString("ru-RU", { timeZone: "Asia/Yerevan" })} (Ереван)`,
  );

  const sent = await sendToChat(token, chatId, lines.join("\n"));
  if (sent.ok) return { ok: true, chatId };

  return {
    ok: false,
    error: sent.error ?? `Не удалось отправить в группу ${chatId}`,
  };
}

export async function testTelegramConnection(): Promise<{
  ok: boolean;
  chatId?: string;
  error?: string;
}> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = groupChatIdFromEnv(process.env.TELEGRAM_CHAT_ID);

  if (!token) return { ok: false, error: "TELEGRAM_BOT_TOKEN не задан" };
  if (!chatId) return { ok: false, error: "TELEGRAM_CHAT_ID не задан" };

  const sent = await sendToChat(
    token,
    chatId,
    "✅ Бот подключён к сайту Armenia Tour. Заявки будут приходить в эту группу.",
  );

  if (sent.ok) return { ok: true, chatId };
  return { ok: false, chatId, error: sent.error };
}
