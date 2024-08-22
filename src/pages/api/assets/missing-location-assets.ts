// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { parseDate } from "@/helpers/date.helper";
import { assets, exif } from "@/schema";
import { addDays } from "date-fns";
import { and, count, desc, eq, gte, isNotNull, isNull, lte, ne, sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { startDate } = req.query as {
    startDate: string;
  };

  const currentUser = await getCurrentUser();

  if (!startDate) {
    return res.status(400).json({
      error: "startDate and endDate are required",
    });
  }

  const startDateDate = parseDate(startDate, "yyyy-MM-dd");
  const endDateDate = addDays(parseDate(startDate, "yyyy-MM-dd"), 1);

  try {
    const rows = await db
      .select({
        id: assets.id,
        deviceId: assets.deviceId,
        type: assets.type,
        originalPath: assets.originalPath,
        previewPath: assets.previewPath,
        isFavorite: assets.isFavorite,
        duration: assets.duration,
        thumbnailPath: assets.thumbnailPath,
        encodedVideoPath: assets.encodedVideoPath,
        originalFileName: assets.originalFileName,
        sidecarPath: assets.sidecarPath,
        deletedAt: assets.deletedAt,
        localDateTime: assets.localDateTime,
        exifImageWidth: exif.exifImageWidth,
        exifImageHeight: exif.exifImageHeight,
        ownerId: assets.ownerId,
      })
      .from(assets)
      .leftJoin(exif, eq(exif.assetId, assets.id))
      .where(and(
        isNull(exif.latitude),
        isNotNull(assets.createdAt),
        gte(exif.dateTimeOriginal, startDateDate),
        lte(exif.dateTimeOriginal, endDateDate),
        eq(assets.ownerId, currentUser.id), 
      ));

    return res.status(200).json(rows);
  } catch (error: any) {
    res.status(500).json({
      error: error?.message,
    });
  }
}
