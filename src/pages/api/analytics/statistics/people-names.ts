// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { person } from "@/schema";
import { and, count, eq, ne, sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const currentUser = await getCurrentUser(req);
        
        // Count people with names (non-empty names)
        const withNames = await db.select({
            value: count(),
        })
        .from(person)
        .where(and(
            eq(person.ownerId, currentUser.id),
            ne(person.name, ''),
            ne(person.name, 'Unknown')
        ));

        // Count people without names (empty or 'Unknown' names)
        const withoutNames = await db.select({
            value: count(),
        })
        .from(person)
        .where(and(
            eq(person.ownerId, currentUser.id),
            sql`(${person.name} = '' OR ${person.name} = 'Unknown')`
        ));

        return res.status(200).json([
            { label: "With Names", value: withNames[0]?.value || 0 },
            { label: "Without Names", value: withoutNames[0]?.value || 0 }
        ]);
    } catch (error: any) {
        res.status(500).json({
            error: error?.message,
        });
    }
}
