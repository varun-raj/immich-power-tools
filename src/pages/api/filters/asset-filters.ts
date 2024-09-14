// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { assets, exif } from "@/schema";
import { IExifColumns } from "@/schema/exif.schema";
import { IUser } from "@/types/user";
import { and, eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

const FIELDS: IExifColumns[] = [
  "make",
  "model",
  "lensModel",
  "city",
  "state",
  "country",
  "projectionType",
  "colorspace",
  "bitsPerSample",
  "rating",
];

const getFilters = async (currentUser: IUser) => {
  const filters: {
    [key in IExifColumns]?: (string | number | Date)[]; 
  } = {};
  for (const field of FIELDS) {
    const values = (await db.selectDistinct({
      [field]: exif[field],
    })
      .from(exif)
      .leftJoin(assets, eq(exif.assetId, assets.id))
      .where(
        and(
          eq(assets.ownerId, currentUser.id),
        )
      )
    ).map((value) => value[field]).filter((value) => value !== null);
    
      filters[field] = values;
  }
  return filters;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  try {
    const currentUser = await getCurrentUser(req);
    if (!currentUser) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    const filters = await getFilters(currentUser);
    return res.status(200).json({ filters });
  } catch (error: any) {
    res.status(500).json({
      error: error?.message,
    });
  }
}
