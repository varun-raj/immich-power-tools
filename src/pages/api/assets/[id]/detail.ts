import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { NextApiRequest, NextApiResponse } from "next";
import { eq, and } from "drizzle-orm";
import { assets } from "@/schema/assets.schema";
import { exif } from "@/schema";
import { assetFaces } from "@/schema/assetFaces.schema";
import { person } from "@/schema/person.schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const currentUser = await getCurrentUser(req);
  if (!currentUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.query as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Asset ID is required" });
  }

  try {
    // Fetch asset + exif data
    const [assetRow] = await db
      .select({
        id: assets.id,
        type: assets.type,
        originalPath: assets.originalPath,
        originalFileName: assets.originalFileName,
        isFavorite: assets.isFavorite,
        duration: assets.duration,
        localDateTime: assets.localDateTime,
        fileCreatedAt: assets.fileCreatedAt,
        // EXIF fields
        make: exif.make,
        model: exif.model,
        lensModel: exif.lensModel,
        fNumber: exif.fNumber,
        focalLength: exif.focalLength,
        iso: exif.iso,
        exposureTime: exif.exposureTime,
        fileSizeInByte: exif.fileSizeInByte,
        exifImageWidth: exif.exifImageWidth,
        exifImageHeight: exif.exifImageHeight,
        orientation: exif.orientation,
        dateTimeOriginal: exif.dateTimeOriginal,
        timeZone: exif.timeZone,
        latitude: exif.latitude,
        longitude: exif.longitude,
        city: exif.city,
        state: exif.state,
        country: exif.country,
        description: exif.description,
        rating: exif.rating,
        fps: exif.fps,
        projectionType: exif.projectionType,
      })
      .from(assets)
      .leftJoin(exif, eq(assets.id, exif.assetId))
      .where(and(
        eq(assets.id, id),
        eq(assets.ownerId, currentUser.id),
      ))
      .limit(1);

    if (!assetRow) {
      return res.status(404).json({ message: "Asset not found" });
    }

    // Fetch people detected in this asset
    const faces = await db
      .select({
        personId: person.personGroupId,
        personName: person.name,
        thumbnailPath: person.thumbnailPath,
        isHidden: person.isHidden,
      })
      .from(assetFaces)
      .innerJoin(person, and(
        eq(assetFaces.personGroupId, person.personGroupId),
        eq(person.ownerId, currentUser.id),
      ))
      .where(eq(assetFaces.assetId, id));

    return res.status(200).json({
      ...assetRow,
      people: faces,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error?.message || "Internal server error" });
  }
}
