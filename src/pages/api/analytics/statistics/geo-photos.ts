// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { assets, exif } from "@/schema";
import { and, count, eq, isNotNull, isNull, sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const currentUser = await getCurrentUser(req);
        
        // Count photos with geo data (latitude and longitude not null)
        const withGeo = await db.select({
            value: count(),
        })
        .from(assets)
        .innerJoin(exif, eq(assets.id, exif.assetId))
        .where(and(
            eq(assets.ownerId, currentUser.id),
            isNotNull(exif.latitude),
            isNotNull(exif.longitude)
        ));

        // Count photos without geo data (latitude or longitude is null)
        const withoutGeo = await db.select({
            value: count(),
        })
        .from(assets)
        .leftJoin(exif, eq(assets.id, exif.assetId))
        .where(and(
            eq(assets.ownerId, currentUser.id),
            sql`(${exif.latitude} IS NULL OR ${exif.longitude} IS NULL)`
        ));

        return res.status(200).json([
            { label: "With Geo Data", value: withGeo[0]?.value || 0 },
            { label: "Without Geo Data", value: withoutGeo[0]?.value || 0 }
        ]);
    } catch (error: any) {
        res.status(500).json({
            error: error?.message,
        });
    }
}
