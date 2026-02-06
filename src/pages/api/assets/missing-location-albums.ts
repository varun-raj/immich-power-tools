import { db } from "@/config/db";
import { IMissingLocationDatesResponse } from "@/handlers/api/asset.handler";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { assets, exif } from "@/schema";
import { albumsAssetsAssets } from "@/schema/albumAssetsAssets.schema";
import { albums } from "@/schema/albums.schema";
import { and, count, desc, eq, isNotNull, isNull, ne, sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { sortBy = "date", sortOrder = "desc" } = req.query;
    const currentUser = await getCurrentUser(req);
    if (!currentUser) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    const rows = await db
      .select({
        asset_count: desc(count(assets.id)),
        label: albums.albumName,
        value: albums.id,
      })
      .from(assets)
      .leftJoin(exif, eq(exif.assetId, assets.id))
      .leftJoin(albumsAssetsAssets, eq(albumsAssetsAssets.assetId, assets.id))
      .leftJoin(albums, eq(albums.id, albumsAssetsAssets.albumId))
      .where(
        and(
          isNull(exif.latitude),
          isNotNull(assets.createdAt),
          isNotNull(exif.dateTimeOriginal),
          eq(assets.ownerId, currentUser.id),
          eq(assets.visibility, "timeline"),
          isNotNull(albums.id)
      ))
      .groupBy(albums.id)
      .orderBy(desc(count(assets.id))) as IMissingLocationDatesResponse[];

  
    rows.sort((a, b) => {
      return sortOrder === "asc" ? a.asset_count - b.asset_count : b.asset_count - a.asset_count;
    });
    return res.status(200).json(rows);
  } catch (error: any) {
    res.status(500).json({
      error: error?.message,
    });
  }
}
