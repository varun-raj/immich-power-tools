// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CHART_COLORS } from "@/config/constants/chart.constant";
import { db } from "@/config/db";
import { exif } from "@/schema";
import { count, desc, isNotNull, ne, sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

const SELECT_ORPHAN_PHOTOS = sql`
SELECT 
    DATE(a."localDateTime") AS "date",
    COUNT(a."id") AS "asset_count"
FROM 
    "assets" a
LEFT JOIN 
    "albums_assets_assets" aaa ON a."id" = aaa."assetsId"
WHERE 
    aaa."albumsId" IS NULL
GROUP BY 
    DATE(a."localDateTime")
ORDER BY 
    "asset_count" DESC;
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { rows } = await db.execute(SELECT_ORPHAN_PHOTOS);
    return res.status(200).json(rows);
  } catch (error: any) {
    res.status(500).json({
      error: error?.message,
    });
  }
}
