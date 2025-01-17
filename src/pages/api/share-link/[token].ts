import { db } from "@/config/db";
import { ENV } from "@/config/environment";
import { desc, gte, lte } from "drizzle-orm";
import { eq, inArray } from "drizzle-orm";
import { assetFaces, assets, exif } from "@/schema";
import { and } from "drizzle-orm";
import { sign, verify } from "jsonwebtoken";
import { NextApiResponse } from "next";

import { NextApiRequest } from "next";
import { albums } from "@/schema/albums.schema";
import { albumsAssetsAssets } from "@/schema/albumAssetsAssets.schema";
import { cleanUpAsset, cleanUpAssets, cleanUpShareAsset, isFlipped } from "@/helpers/asset.helper";
import { IAsset } from "@/types/asset";
import { parseDate } from "@/helpers/date.helper";

interface ShareLinkFilters {
  personIds: string[];
  albumIds: string[];
  startDate: string;
  endDate: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;
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

  const dbAssets = await db.select({
    id: assets.id,
    deviceId: assets.deviceId,
    type: assets.type,
    originalPath: assets.originalPath,
    isFavorite: assets.isFavorite,
    duration: assets.duration,
    encodedVideoPath: assets.encodedVideoPath,
    originalFileName: assets.originalFileName,
    sidecarPath: assets.sidecarPath,
    deletedAt: assets.deletedAt,
    localDateTime: assets.localDateTime,
    exifImageWidth: exif.exifImageWidth,
    exifImageHeight: exif.exifImageHeight,
    ownerId: assets.ownerId,
    dateTimeOriginal: exif.dateTimeOriginal,
    url: assets.id,
    previewUrl: assets.id,
    videoURL: assets.id,
    orientation: exif.orientation,
  }).from(assets)
  .innerJoin(assetFaces, eq(assets.id, assetFaces.assetId))
  .innerJoin(albumsAssetsAssets, eq(assets.id, albumsAssetsAssets.assetsId))
  .innerJoin(albums, eq(albumsAssetsAssets.albumsId, albums.id))
  .innerJoin(exif, eq(exif.assetId, assets.id))
  .where(and(
    personIds?.length > 0 ? inArray(assetFaces.personId, personIds) : undefined,
    albumIds?.length > 0 ? inArray(albums.id, albumIds) : undefined,
    startDate ? gte(assets.createdAt, new Date(startDate)) : undefined,
    endDate ? lte(assets.createdAt, new Date(endDate)) : undefined,
    eq(assets.isArchived, false),
    eq(assets.isVisible, true),
    eq(assets.isOffline, false),
  ))
  .orderBy(desc(assets.createdAt));

  const cleanedAssets = dbAssets.map((asset) => {
    return {
      ...asset,
      localDateTime: new Date(asset.localDateTime),
      duration: asset.duration ? parseInt(asset.duration) : 0,
      exifImageWidth: (isFlipped(asset.orientation) ? asset.exifImageHeight : asset.exifImageWidth) ?? 0,
      exifImageHeight: (isFlipped(asset.orientation) ? asset.exifImageWidth : asset.exifImageHeight) ?? 0,
      dateTimeOriginal: new Date(asset.dateTimeOriginal || new Date()).toISOString(),
    }
  }).map((asset) => cleanUpShareAsset(asset, newPreviewToken as string));
  
  return res.status(200).json(cleanedAssets);
}