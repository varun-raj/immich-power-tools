// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { assets, exif } from "@/schema";
import { and, count, desc, eq, gte, isNotNull, ne, sql, } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date) {
    return date.toISOString().split('T')[0];
}

function fillMissingDates(data: any[]) {
    const today = new Date();

    // Set the start date as one year ago, excluding the current month in the previous year
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth() + 1, 1); // First day of the next month last year

    const existingDates = new Set(data.map(item => item.date));

    const filledData = [];

    // Iterate from today to one year ago, but skip the current month from last year
    for (let d = new Date(today); d >= oneYearAgo; d.setDate(d.getDate() - 1)) {
        const dateStr = formatDate(d);

        // Skip dates in the current month of the previous year
        if (d.getFullYear() === today.getFullYear() - 1 && d.getMonth() === today.getMonth()) {
            continue;
        }

        if (existingDates.has(dateStr)) {
            filledData.push(data.find(item => item.date === dateStr));
        } else {
            filledData.push({ date: dateStr, count: 0 });
        }
    }

    // Sort the filled data in descending order
    filledData.sort((a, b) => a.date.localeCompare(b.date));
    return filledData;
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    try {
        const currentUser = await getCurrentUser(req);
        const dataFromDB = await db.select({
            date: sql`DATE(${assets.fileCreatedAt})`.as('date'),
            count: count(),
        })
            .from(assets)
            .where(
                and(
                    eq(assets.ownerId, currentUser.id),
                    gte(assets.fileCreatedAt, sql`CURRENT_DATE - INTERVAL '1 YEAR'`))
            )
            .groupBy(sql`DATE(${assets.fileCreatedAt})`)
            .orderBy(sql`DATE(${assets.fileCreatedAt}) DESC`)
        const updatedData = fillMissingDates(dataFromDB);
        return res.status(200).json(updatedData);
    } catch (error: any) {
        res.status(500).json({
            error: error?.message,
        });
    }
}
