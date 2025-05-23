import { NextApiRequest } from "next";

import { db } from "@/config/db";
import { NextApiResponse } from "next";
import { albums } from "@/schema/albums.schema";
import { count, eq, min, max, sql, and } from "drizzle-orm";
import { assets } from "@/schema/assets.schema";
import { albumsAssetsAssets } from "@/schema/albumAssetsAssets.schema";
import { assetFaces, exif, person } from "@/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { id } = req.query as { id: string };

  const dbAlbums = await db.selectDistinctOn([albums.id], {
    id: albums.id,
    albumName: albums.albumName,
    createdAt: albums.createdAt,
    updatedAt: albums.updatedAt,
    albumThumbnailAssetId: albums.albumThumbnailAssetId,
    assetCount: count(assets.id),
    firstPhotoDate: min(exif.dateTimeOriginal),
    lastPhotoDate: max(exif.dateTimeOriginal),
    faceCount: count(sql<string>`DISTINCT ${person.id}`), // Ensure unique personId
  })
    .from(albums)
    .leftJoin(albumsAssetsAssets, eq(albums.id, albumsAssetsAssets.albumsId))
    .leftJoin(assets, eq(albumsAssetsAssets.assetsId, assets.id))
    .leftJoin(exif, and(eq(assets.id, exif.assetId), eq(assets.visibility, "timeline")))
    .leftJoin(assetFaces, eq(assets.id, assetFaces.assetId))
    .leftJoin(person, and(eq(assetFaces.personId, person.id), eq(person.isHidden, false)))
    .where(and(eq(albums.id, id)))
    .groupBy(albums.id)
    .limit(1);
  
  if (dbAlbums.length === 0) {
    return res.status(404).json({ error: "Album not found" });
  }
  res.status(200).json(dbAlbums[0]);
}