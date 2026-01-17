import { NextApiRequest, NextApiResponse } from "next";
import { ENV } from "@/config/environment";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const currentUser = await getCurrentUser(req);
    if (!currentUser) return res.status(401).json({ message: "Unauthorized" });

    const busboy = (await import("busboy")).default;
    const bb = busboy({ headers: req.headers });

    let fileBuffer: Buffer | null = null;
    let fileName = "";
    let mimeType = "";

    await new Promise<void>((resolve, reject) => {
      bb.on("file", (_fieldname, file, info) => {
        const chunks: Uint8Array[] = [];
        fileName = info.filename;
        mimeType = info.mimeType;

        file.on("data", (chunk: Uint8Array<ArrayBufferLike>) => chunks.push(chunk));
        file.on("end", () => {
          fileBuffer = Buffer.concat(chunks);
          resolve();
        });
      });

      bb.on("error", reject);
	  bb.on("finish", resolve);
      req.pipe(bb);
    });

    if (!fileBuffer) {
      return res.status(400).json({ error: "No file received" });
    }

    const form = new FormData();
    form.append("assetData", new Blob([fileBuffer], { type: mimeType }), fileName);
    form.append("deviceAssetId", fileName);
    form.append("deviceId", "immich-power-tools");
    form.append("fileCreatedAt", new Date().toISOString());
    form.append("fileModifiedAt", new Date().toISOString());

    const uploadRes = await fetch(`${ENV.IMMICH_URL}/api/assets`, {
      method: "POST",
      headers: {
        "x-api-key": ENV.IMMICH_API_KEY,
      },
      body: form,
    });

    if (!uploadRes.ok) {
      return res.status(500).json({
        error: "Immich upload failed",
        details: await uploadRes.text(),
      });
    }

    const immichResponse = await uploadRes.json()
    return res.status(200).json({
      success: true,
      ...immichResponse,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: err.message || "Upload failed" });
  }
}
