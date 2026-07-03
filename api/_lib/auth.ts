import type { VercelRequest } from "@vercel/node";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "armenia2024";
}

export function isAuthorized(req: VercelRequest): boolean {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return false;
  const token = header.slice(7);
  return token === getAdminPassword();
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
