import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminPassword } from "./_lib/auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password } = req.body ?? {};
  if (password === getAdminPassword()) {
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ error: "Invalid password" });
}
