type TelegramResult = { ok: true } | { ok: false; error: string };

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

/** Берём chat_id из последнего сообщения боту (после /start) */
export async function resolveChatId(token: string, preferred?: string): Promise<string | null> {
  if (preferred?.trim()) return preferred.trim();

  type Updates = {
    ok: boolean;
    result?: Array<{ message?: { chat?: { id: number } } }>;
  };

  const data = await tgApi<Updates>(token, "getUpdates", { limit: 20 });
  if (!data.ok || !data.result?.length) return null;

  for (let i = data.result.length - 1; i >= 0; i--) {
    const id = data.result[i].message?.chat?.id;
    if (id) return String(id);
  }
  return null;
}

export async function sendBookingToTelegram(
  lead: { name: string; phone: string; phoneAlt?: string; createdAt: string },
): Promise<TelegramResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const preferredChat = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!token) {
    return { ok: false, error: "TELEGRAM_BOT_TOKEN не задан" };
  }

  const chatId = await resolveChatId(token, preferredChat);
  if (!chatId) {
    return {
      ok: false,
      error:
        "Chat не найден. Открой t.me/armenians_school_bot и нажми Start, затем отправь любое сообщение.",
    };
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

  type SendResult = { ok: boolean; description?: string };

  const result = await tgApi<SendResult>(token, "sendMessage", {
    chat_id: chatId,
    text: lines.join("\n"),
    parse_mode: "HTML",
  });

  if (result.ok) return { ok: true };

  return {
    ok: false,
    error: result.description ?? "Telegram API error",
  };
}

export async function testTelegramConnection(): Promise<{
  ok: boolean;
  chatId?: string;
  error?: string;
}> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) return { ok: false, error: "TELEGRAM_BOT_TOKEN не задан" };

  const chatId = await resolveChatId(token, process.env.TELEGRAM_CHAT_ID?.trim());
  if (!chatId) {
    return {
      ok: false,
      error: "Нет чата. Нажми Start у @armenians_school_bot",
    };
  }

  type SendResult = { ok: boolean; description?: string };
  const result = await tgApi<SendResult>(token, "sendMessage", {
    chat_id: chatId,
    text: "✅ Бот подключён к сайту Armenia Tour. Заявки будут приходить сюда.",
  });

  if (result.ok) return { ok: true, chatId };
  return { ok: false, chatId, error: result.description };
}
