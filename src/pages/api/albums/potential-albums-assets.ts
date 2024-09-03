// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CHART_COLORS } from "@/config/constants/chart.constant";
import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { exif } from "@/schema";
import { count, desc, isNotNull, ne, sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

const SELECT_ORPHAN_PHOTOS = (date: string, ownerId:  string) =>
  sql.raw(`
  SELECT 
      a."id",
      a."ownerId",
      a."deviceId",
      a."type",
      a."originalPath",
      a."previewPath",
      a."isFavorite",
      a."duration",
      a."thumbnailPath",
      a."encodedVideoPath",
      a."originalFileName",
      a."sidecarPath",
      a."thumbhash",
      a."deletedAt",
      a."localDateTime",
      e."exifImageWidth",
      e."exifImageHeight"
  FROM 
      assets a
  LEFT JOIN 
      albums_assets_assets aaa 
      ON a.id = aaa."assetsId"
  LEFT JOIN 
      exif e 
      ON a.id = e."assetId"
  WHERE 
      aaa."albumsId" IS NULL 
      AND a."ownerId" = '${ownerId}'
      AND a."localDateTime"::date = '${date}'
      AND a."previewPath" IS NOT NULL
`);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const currentUser = await getCurrentUser(req)
    const { startDate } = req.query as { startDate: string };
    const { rows } = await db.execute(SELECT_ORPHAN_PHOTOS(startDate, currentUser.id));
    return res.status(200).json(rows);
  } catch (error: any) {
    res.status(500).json({
      error: error?.message,
    });
  }
}
