import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { NextApiRequest, NextApiResponse } from "next";
import { eq, and } from "drizzle-orm";
import { assets } from "@/schema/assets.schema";

/**
 * Find a asset by its checksum
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const currentUser = await getCurrentUser(req);

  if (!currentUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { checksum } = req.query as { checksum?: string };

  if (!checksum) {
    return res.status(400).json({ message: "Missing checksum parameter" });
  }

  const checksumBuffer = Buffer.from(checksum, "hex");

  const result = await db
    .select({ id: assets.id, checksum: assets.checksum, deletedAt: assets.deletedAt })
    .from(assets)
    .where(
		and(
			eq(assets.ownerId, currentUser.id),
			eq(assets.checksum, checksumBuffer)
		)
    )
    .limit(1);

  if (result.length > 0) {
    const { checksum, ...response } = result[0]
    return res.status(200).json(response);
  } else {
    return res.status(200).json({ id: null });
  }

}
