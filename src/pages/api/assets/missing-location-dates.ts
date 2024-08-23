// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CHART_COLORS } from "@/config/constants/chart.constant";
import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { assets, exif } from "@/schema";
import { and, count, desc, eq, isNotNull, isNull, ne, sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const currentUser = await getCurrentUser();
    const rows = await db
      .select({
        asset_count: desc(count(assets.id)),
        date: sql`DATE(${exif.dateTimeOriginal})`,
      })
      .from(assets)
      .leftJoin(exif, eq(exif.assetId, assets.id))
      .where(and(
        isNull(exif.latitude),
        eq(assets.type, "VIDEO"),
        eq(assets.ownerId, currentUser.id), 
      ))
      .groupBy(sql`DATE(${exif.dateTimeOriginal})`)
      .orderBy(desc(count(assets.id)));
    return res.status(200).json(rows);
  } catch (error: any) {
    res.status(500).json({
      error: error?.message,
    });
  }
}
