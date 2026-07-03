import { head, put } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const BLOB_PATH = "bookings.json";

type BookingLead = {
  name: string;
  phone: string;
  phoneAlt?: string;
  createdAt: string;
};

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function sendTelegram(lead: BookingLead): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

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

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join("\n"),
        parse_mode: "HTML",
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function saveToBlob(lead: BookingLead): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;

  let existing: BookingLead[] = [];
  try {
    const meta = await head(BLOB_PATH);
    if (meta?.url) {
      const remote = await fetch(meta.url);
      if (remote.ok) {
        const data = await remote.json();
        if (Array.isArray(data)) existing = data;
      }
    }
  } catch {
    /* first lead */
  }

  const updated = [lead, ...existing].slice(0, 500);
  await put(BLOB_PATH, JSON.stringify(updated, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, phone, phoneAlt } = req.body ?? {};

  if (!name?.trim() || !phone?.trim()) {
    return res.status(400).json({ error: "Имя и телефон обязательны" });
  }

  const digits = String(phone).replace(/\D/g, "");
  if (digits.length < 10) {
    return res.status(400).json({ error: "Некорректный номер телефона" });
  }

  const lead: BookingLead = {
    name: String(name).trim(),
    phone: String(phone).trim(),
    phoneAlt: phoneAlt?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  const [telegramOk, blobOk] = await Promise.all([
    sendTelegram(lead),
    saveToBlob(lead),
  ]);

  if (!telegramOk && !blobOk) {
    console.log("[booking]", JSON.stringify(lead));
  }

  return res.status(200).json({ ok: true, telegram: telegramOk, stored: blobOk });
}
