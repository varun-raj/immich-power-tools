// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/config/db";
import { IPotentialAlbumsDatesResponse } from "@/handlers/api/album.handler";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { parseDate } from "@/helpers/date.helper";
import { albumsAssetsAssets } from "@/schema/albumAssetsAssets.schema";
import { albums } from "@/schema/albums.schema";
import { assets } from "@/schema/assets.schema";
import { exif } from "@/schema/exif.schema";
import { and, count, desc, eq, gte, isNotNull, isNull, sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { number } from "zod";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { sortBy = "date", sortOrder = "desc", minAssets = 1 } = req.query as any;
    const currentUser = await getCurrentUser(req)
    const rows = await db.select({
      date: sql`DATE(${exif.dateTimeOriginal})`,
      asset_count: desc(count(assets.id)),
    }).from(assets)
      .leftJoin(albumsAssetsAssets, eq(assets.id, albumsAssetsAssets.assetsId))
      .leftJoin(exif, eq(assets.id, exif.assetId))
      .where(and  (
        eq(assets.ownerId, currentUser.id),
        eq(assets.isVisible, true),
        isNull(albumsAssetsAssets.albumsId),
        isNotNull(exif.dateTimeOriginal),

      ))
      .groupBy(sql`DATE(${exif.dateTimeOriginal})`) as IPotentialAlbumsDatesResponse[];
  

    const filteredRows = rows.filter((row) => Number(row.asset_count) >= Number(minAssets));
    if (sortBy === "date") {
      filteredRows.sort((a, b) => {
        const aDate = parseDate(a.date as string, "yyyy-MM-dd");
        const bDate = parseDate(b.date as string, "yyyy-MM-dd");
        return sortOrder === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
      });
    } else if (sortBy === "asset_count") {
      filteredRows.sort((a, b) => sortOrder === "asc" ? a.asset_count - b.asset_count : b.asset_count - a.asset_count);
    }
    return res.status(200).json(filteredRows);
  } catch (error: any) {
    res.status(500).json({
      error: error?.message,
    });
  }
}
