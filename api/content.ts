import { head, put } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readFileSync } from "fs";
import { join } from "path";
import { isAuthorized } from "./_lib/auth.js";

const BLOB_PATH = "site-content.json";

function fallbackContent() {
  try {
    const file = join(process.cwd(), "public/data/site-content.json");
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    try {
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const meta = await head(BLOB_PATH);
        if (meta?.url) {
          const remote = await fetch(meta.url);
          if (remote.ok) {
            return res.status(200).json(await remote.json());
          }
        }
      }
    } catch {
      /* blob missing */
    }

    const local = fallbackContent();
    if (local) return res.status(200).json(local);
    return res.status(404).json({ error: "Content not found" });
  }

  if (req.method === "PUT") {
    if (!isAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const body = req.body;
    if (!body?.sections || !Array.isArray(body.sections)) {
      return res.status(400).json({ error: "Invalid content payload" });
    }

    const stamped = {
      ...body,
      version: 1,
      updatedAt: new Date().toISOString(),
    };

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(BLOB_PATH, JSON.stringify(stamped), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
      });
      return res.status(200).json({ ...stamped, blobUrl: blob.url });
    }

    return res.status(200).json({
      ...stamped,
      warning: "Blob storage not configured — saved locally on client only",
    });
  }

  res.setHeader("Allow", "GET, PUT");
  return res.status(405).json({ error: "Method not allowed" });
}
