import { NextApiRequest } from "next";

import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { NextApiResponse } from "next";
import { and, eq, isNotNull } from "drizzle-orm";
import { assets } from "@/schema/assets.schema";
import { albumsAssetsAssets } from "@/schema/albumAssetsAssets.schema";
import { assetFaces, exif, person } from "@/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const currentUser = await getCurrentUser(req);
  if (!currentUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { id, faceId, page = 1 } = req.query as { 
    id?: string, 
    faceId?: string, 
    page?: number 
  };

  if (!id) {
    return res.status(400).json({ error: "Album id is required" });
  }
  const dbAssets = await db.selectDistinctOn([assets.id], {
    id: assets.id,
    deviceId: assets.deviceId,
    type: assets.type,
    originalPath: assets.originalPath,
    isFavorite: assets.isFavorite,
    duration: assets.duration,
    encodedVideoPath: assets.encodedVideoPath,
    originalFileName: assets.originalFileName,
    sidecarPath: assets.sidecarPath,
    deletedAt: assets.deletedAt,
    localDateTime: assets.localDateTime,
    exifImageWidth: exif.exifImageWidth,
    exifImageHeight: exif.exifImageHeight,
    ownerId: assets.ownerId,
    dateTimeOriginal: exif.dateTimeOriginal,
  })
    .from(albumsAssetsAssets)
    .leftJoin(assets, eq(albumsAssetsAssets.assetsId, assets.id))
    .leftJoin(exif, eq(assets.id, exif.assetId))
    .leftJoin(assetFaces, eq(assets.id, assetFaces.assetId))
    .leftJoin(person, eq(assetFaces.personId, person.id))
    .where(and(
      eq(albumsAssetsAssets.albumsId, id), 
      eq(assets.isVisible, true),
      isNotNull(assets.isArchived),
      faceId ? eq(assetFaces.personId, faceId) : undefined,
    ))
    .limit(100)
    .offset(100 * (page - 1));

  res.status(200).json(dbAssets);
}