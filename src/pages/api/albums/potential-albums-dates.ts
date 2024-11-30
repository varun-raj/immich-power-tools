// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/config/db";
import { IPotentialAlbumsDatesResponse } from "@/handlers/api/album.handler";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { parseDate } from "@/helpers/date.helper";
import { sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

const SELECT_ORPHAN_PHOTOS = (ownerId: string) => sql`
SELECT 
    DATE(e."dateTimeOriginal") AS "date",
    COUNT(a."id") AS "asset_count"
FROM 
    "assets" a
LEFT JOIN 
    "albums_assets_assets" aaa ON a."id" = aaa."assetsId"
LEFT JOIN
    "exif" e ON a."id" = e."assetId"
WHERE 
    aaa."albumsId" IS NULL
    AND a."ownerId" = ${ownerId}
    AND a."isVisible" = true
    AND e."dateTimeOriginal" IS NOT NULL
GROUP BY
    DATE(e."dateTimeOriginal")
ORDER BY 
    "asset_count" DESC;
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { sortBy = "date", sortOrder = "desc" } = req.query;
    const currentUser = await getCurrentUser(req)
    const data = await db.execute(SELECT_ORPHAN_PHOTOS(currentUser.id)) as any;
    const rows = data.rows as IPotentialAlbumsDatesResponse[];
  
    if (sortBy === "date") {
      rows.sort((a, b) => {
        const aDate = parseDate(a.date, "yyyy-MM-dd");
        const bDate = parseDate(b.date, "yyyy-MM-dd");
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
