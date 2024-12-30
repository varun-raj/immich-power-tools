import { NextApiResponse } from "next";

import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { NextApiRequest } from "next";
import { assets, exif } from "@/schema";
import { and, eq, isNotNull } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const currentUser = await getCurrentUser(req);
  if (!currentUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const dbAssets = await db.select({
    assetId: assets.id,
    latitude: exif.latitude,
    longitude: exif.longitude,
  }).from(assets)
  .innerJoin(exif, eq(assets.id, exif.assetId))
  .where(
    and(
      eq(assets.ownerId, currentUser.id),
      isNotNull(exif.latitude),
      isNotNull(exif.longitude)
    )
  );
  const heatmapData = dbAssets.map((asset) => [
    asset.longitude,
    asset.latitude,
  ]);
  res.status(200).json(heatmapData); 
}
