import { put } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthorized } from "./_lib/auth";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(503).json({
      error: "Blob storage not configured. Add Vercel Blob to the project.",
    });
  }

  const contentType = req.headers["content-type"] || "application/octet-stream";
  const filename =
    (req.headers["x-filename"] as string) ||
    `upload-${Date.now()}.${contentType.includes("png") ? "png" : "jpg"}`;

  const buffer = await readBody(req);
  if (!buffer.length) {
    return res.status(400).json({ error: "Empty file" });
  }

  const blob = await put(`uploads/${filename}`, buffer, {
    access: "public",
    contentType,
  });

  return res.status(200).json({ url: blob.url });
}
