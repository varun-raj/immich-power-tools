import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { humanizeBytes } from "@/helpers/string.helper";
import { assets, exif, users } from "@/schema";
import { Value } from "@radix-ui/react-select";
import { desc, eq } from "drizzle-orm";
import { sum } from "drizzle-orm";
import { NextApiResponse } from "next";

import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const currentUser = await getCurrentUser(req);
  if (!currentUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const dbStorage = await db.select({
    label: users.name,
    value: sum(exif.fileSizeInByte)
  })
  .from(assets)
  .leftJoin(exif, eq(assets.id, exif.assetId))
  .leftJoin(users, eq(assets.ownerId, users.id))
  .orderBy(desc(sum(exif.fileSizeInByte)))
  .groupBy(assets.ownerId, users.name)

  const cleanedData = dbStorage.map((item) => ({
    label: item.label,
    value: Math.round((parseInt(item.value ?? "0") / 1000000)),
    valueLabel: humanizeBytes(parseInt(item.value ?? "0")),
  }));
  res.status(200).json(cleanedData);
} 