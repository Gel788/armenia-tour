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

type Update = { message?: { chat?: { id: number; type?: string; username?: string } } };

/** Все chat_id из сообщений боту (после /start) */
export async function getKnownChatIds(token: string): Promise<string[]> {
  type Updates = { ok: boolean; result?: Update[] };
  const data = await tgApi<Updates>(token, "getUpdates", { limit: 50 });
  if (!data.ok || !data.result?.length) return [];

  const ids = new Set<string>();
  for (const u of data.result) {
    const id = u.message?.chat?.id;
    if (id != null) ids.add(String(id));
  }
  return [...ids];
}

/** Предпочитаем чат из getUpdates; env — запасной вариант */
export async function resolveChatId(token: string, preferred?: string): Promise<string | null> {
  const fromUpdates = await getKnownChatIds(token);
  if (fromUpdates.length) return fromUpdates[fromUpdates.length - 1];

  const pref = preferred?.trim();
  return pref || null;
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
  const preferredChat = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!token) {
    return { ok: false, error: "TELEGRAM_BOT_TOKEN не задан" };
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
  const text = lines.join("\n");

  const candidates = await getKnownChatIds(token);
  if (preferredChat && !candidates.includes(preferredChat)) {
    candidates.unshift(preferredChat);
  }

  if (!candidates.length) {
    return {
      ok: false,
      error:
        "Открой t.me/armenians_school_bot и нажми Start — без этого бот не может писать в чат.",
    };
  }

  for (const chatId of candidates) {
    const sent = await sendToChat(token, chatId, text);
    if (sent.ok) return { ok: true, chatId };
  }

  return {
    ok: false,
    error: `Не удалось отправить. Проверь Start у @armenians_school_bot. Chat ID: ${candidates.join(", ")}`,
  };
}

export async function testTelegramConnection(): Promise<{
  ok: boolean;
  chatId?: string;
  knownChatIds?: string[];
  error?: string;
}> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) return { ok: false, error: "TELEGRAM_BOT_TOKEN не задан" };

  const knownChatIds = await getKnownChatIds(token);
  const preferred = process.env.TELEGRAM_CHAT_ID?.trim();
  const chatId = await resolveChatId(token, preferred);

  if (!chatId && !knownChatIds.length) {
    return {
      ok: false,
      knownChatIds: [],
      error: "Нет чата. Открой t.me/armenians_school_bot и нажми Start.",
    };
  }

  const candidates = [...knownChatIds];
  if (preferred && !candidates.includes(preferred)) candidates.unshift(preferred);

  for (const id of candidates) {
    const sent = await sendToChat(
      token,
      id,
      "✅ Бот подключён к сайту Armenia Tour. Заявки будут приходить сюда.",
    );
    if (sent.ok) return { ok: true, chatId: id, knownChatIds };
  }

  return {
    ok: false,
    chatId: candidates[0],
    knownChatIds,
    error: "chat not found — нажми Start у @armenians_school_bot",
  };
}
