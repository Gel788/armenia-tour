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

type Update = {
  message?: { chat?: { id: number; type?: string; title?: string } };
  my_chat_member?: { chat?: { id: number; type?: string; title?: string } };
};

/** PEER ID из клиента → варианты chat_id для Bot API (группы = минус / -100) */
export function expandChatIdCandidates(raw: string): string[] {
  const id = raw.trim();
  if (!id) return [];

  if (id.startsWith("-")) return [id];

  const digits = id.replace(/\D/g, "");
  if (!digits) return [];

  return [`-100${digits}`, `-${digits}`, digits];
}

/** Chat ID из getUpdates (сообщения в группе, /start и т.д.) */
export async function getKnownChatIds(token: string): Promise<string[]> {
  type Updates = { ok: boolean; result?: Update[] };
  const data = await tgApi<Updates>(token, "getUpdates", { limit: 100 });
  if (!data.ok || !data.result?.length) return [];

  const ids = new Set<string>();
  for (const u of data.result) {
    const chat = u.message?.chat ?? u.my_chat_member?.chat;
    const chatId = chat?.id;
    if (chatId != null) ids.add(String(chatId));
  }
  return [...ids];
}

export function buildChatCandidates(preferred?: string, fromUpdates: string[] = []): string[] {
  const out: string[] = [];
  const add = (id: string) => {
    if (id && !out.includes(id)) out.push(id);
  };

  for (const id of fromUpdates) add(id);
  if (preferred) {
    for (const variant of expandChatIdCandidates(preferred)) add(variant);
  }

  return out;
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

  const fromUpdates = await getKnownChatIds(token);
  const candidates = buildChatCandidates(preferredChat, fromUpdates);

  if (!candidates.length) {
    return { ok: false, error: "TELEGRAM_CHAT_ID не задан" };
  }

  let lastError = "";
  for (const chatId of candidates) {
    const sent = await sendToChat(token, chatId, text);
    if (sent.ok) return { ok: true, chatId };
    lastError = sent.error ?? lastError;
  }

  return {
    ok: false,
    error: lastError || `Не удалось отправить в чат. Пробовали: ${candidates.join(", ")}`,
  };
}

export async function testTelegramConnection(): Promise<{
  ok: boolean;
  chatId?: string;
  triedChatIds?: string[];
  knownChatIds?: string[];
  error?: string;
}> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) return { ok: false, error: "TELEGRAM_BOT_TOKEN не задан" };

  const knownChatIds = await getKnownChatIds(token);
  const preferred = process.env.TELEGRAM_CHAT_ID?.trim();
  const candidates = buildChatCandidates(preferred, knownChatIds);

  if (!candidates.length) {
    return { ok: false, error: "TELEGRAM_CHAT_ID не задан" };
  }

  let lastError = "";
  for (const id of candidates) {
    const sent = await sendToChat(
      token,
      id,
      "✅ Бот подключён к сайту Armenia Tour. Заявки будут приходить сюда.",
    );
    if (sent.ok) {
      return { ok: true, chatId: id, triedChatIds: candidates, knownChatIds };
    }
    lastError = sent.error ?? lastError;
  }

  return {
    ok: false,
    triedChatIds: candidates,
    knownChatIds,
    error: lastError,
  };
}
