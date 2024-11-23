// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CHART_COLORS } from "@/config/constants/chart.constant";
import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { assets, exif } from "@/schema";
import { and, count, desc, eq, isNotNull, ne } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    try {
        const currentUser = await getCurrentUser(req);
        const dataFromDB = await db.select({
            value: count(),
        })
            .from(assets)
            .where(and(
                eq(assets.ownerId, currentUser.id),
                isNotNull(assets.livePhotoVideoId))
            );
        return res.status(200).json(dataFromDB);
    } catch (error: any) {
        res.status(500).json({
            error: error?.message,
        });
    }
}
