import { db } from "@/config/db";
import { IMissingLocationDatesResponse } from "@/handlers/api/asset.handler";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { parseDate } from "@/helpers/date.helper";
import { assets, exif } from "@/schema";
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
        label: sql`DATE(${exif.dateTimeOriginal})`,
        value: sql`DATE(${exif.dateTimeOriginal})`,
      })
      .from(assets)
      .leftJoin(exif, eq(exif.assetId, assets.id))
      .where(and(
        isNull(exif.latitude),
        isNotNull(assets.createdAt),
        isNotNull(exif.dateTimeOriginal),
        eq(assets.ownerId, currentUser.id),
        eq(assets.isVisible, true),
        eq(assets.isArchived, false),
        isNull(assets.deletedAt),
      ))
      .groupBy(sql`DATE(${exif.dateTimeOriginal})`)
      .orderBy(desc(count(assets.id))) as IMissingLocationDatesResponse[];

    if (sortBy === "date") {
      rows.sort((a, b) => {
        const aDate = parseDate(a.label, "yyyy-MM-dd");
        const bDate = parseDate(b.label, "yyyy-MM-dd");
        return sortOrder === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
      });
    } else if (sortBy === "asset_count") {
      rows.sort((a, b) => {
        return sortOrder === "asc" ? a.asset_count - b.asset_count : b.asset_count - a.asset_count;
      });
    }
    return res.status(200).json(rows);
  } catch (error: any) {
    res.status(500).json({
      error: error?.message,
    });
  }
}
