// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { assets, albumsAssetsAssets } from "@/schema";
import { and, count, eq, sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const currentUser = await getCurrentUser(req);
        
        // Count photos that are in albums
        const inAlbums = await db.select({
            value: count(sql`DISTINCT ${assets.id}`),
        })
        .from(assets)
        .innerJoin(albumsAssetsAssets, eq(assets.id, albumsAssetsAssets.assetId))
        .where(eq(assets.ownerId, currentUser.id));

        // Count total photos
        const totalPhotos = await db.select({
            value: count(),
        })
        .from(assets)
        .where(eq(assets.ownerId, currentUser.id));

        const inAlbumsCount = inAlbums[0]?.value || 0;
        const totalCount = totalPhotos[0]?.value || 0;
        const notInAlbumsCount = totalCount - inAlbumsCount;

        return res.status(200).json([
            { label: "In Albums", value: inAlbumsCount },
            { label: "Not in Albums", value: notInAlbumsCount }
        ]);
    } catch (error: any) {
        res.status(500).json({
            error: error?.message,
        });
    }
}
