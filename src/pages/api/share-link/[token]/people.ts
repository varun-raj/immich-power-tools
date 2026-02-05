import { db } from "@/config/db";
import { ENV } from "@/config/environment";
import { count, desc, gte, isNotNull, lte, ne } from "drizzle-orm";
import { eq, inArray } from "drizzle-orm";
import { assetFaces, assets, exif, person } from "@/schema";
import { and } from "drizzle-orm";
import { JsonWebTokenError, sign, verify } from "jsonwebtoken";
import { NextApiResponse } from "next";

import { NextApiRequest } from "next";
import { albums } from "@/schema/albums.schema";
import { albumsAssetsAssets } from "@/schema/albumAssetsAssets.schema";
import { ASSET_SHARE_THUMBNAIL_PATH } from "@/config/routes";

interface ShareLinkFilters {
  personIds: string[];
  albumIds: string[];
  startDate: string;
  endDate: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;
  try {
    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }

    const decoded = verify(token as string, ENV.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newPreviewToken = sign({ token: token }, ENV.JWT_SECRET, {
      expiresIn: "2m"
    });
    const { personIds, albumIds, startDate, endDate } = decoded as ShareLinkFilters;

    const dbPeople = await db.select({
      id: person.id,
      name: person.name,
      thumbnailAssetId: person.faceAssetId,
      assetCount: count(assets.id),
    }).from(assets)
      .innerJoin(assetFaces, eq(assets.id, assetFaces.assetId))
      .innerJoin(albumsAssetsAssets, eq(assets.id, albumsAssetsAssets.assetId))
      .innerJoin(person, eq(assetFaces.personId, person.id))
      .innerJoin(albums, eq(albumsAssetsAssets.albumId, albums.id))
      .innerJoin(exif, eq(exif.assetId, assets.id))
      .where(and(
        personIds?.length > 0 ? inArray(assetFaces.personId, personIds) : undefined,
        albumIds?.length > 0 ? inArray(albums.id, albumIds) : undefined,
        startDate ? gte(assets.createdAt, new Date(startDate)) : undefined,
        endDate ? lte(assets.createdAt, new Date(endDate)) : undefined,
        eq(assets.status, "active"),
        eq(assets.visibility, "timeline"),
        eq(assets.isOffline, false),
        isNotNull(person.id),
        ne(person.name, "")
      ))
      .groupBy(person.id)
      .orderBy(desc(count(assets.id)));

    const cleanedPeople = dbPeople.map((person) => {
      return {
        ...person,
        thumbnailPath: person.thumbnailAssetId ? ASSET_SHARE_THUMBNAIL_PATH({ id: person.id, size: "thumbnail", token: newPreviewToken, isPeople: true }) : null
      }
    })

    return res.status(200).json(cleanedPeople);
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({ message: "Please check your link and try again. Looks like it's expired." });
    }
    return res.status(500).json({ message: (error as Error).message });
  }
}