import { head, put } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const BLOB_PATH = "bookings.json";

type BookingLead = {
  name: string;
  phone: string;
  phoneAlt?: string;
  createdAt: string;
};

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

  if (process.env.BLOB_READ_WRITE_TOKEN) {
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

    return res.status(200).json({ ok: true });
  }

  console.log("[booking]", JSON.stringify(lead));
  return res.status(200).json({ ok: true, warning: "Blob not configured" });
}
