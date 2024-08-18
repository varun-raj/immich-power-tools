// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/config/db";
import { assets } from "@/schema";
import { count } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const assetsFromDB = await db.select({
      count: count()
    }).from(assets).groupBy(assets.createdAt);
    res.status(200).json(assetsFromDB);
  } catch (error) {
    res.status(500).json({
      name: "Error",
    });
  }
}
