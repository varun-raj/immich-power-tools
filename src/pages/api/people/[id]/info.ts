import { NextApiResponse } from "next";

import { and, desc, eq, isNotNull, sql } from "drizzle-orm";

import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { person } from "@/schema/person.schema";
import { NextApiRequest } from "next";
import { albums } from "@/schema/albums.schema";
import { assetFaces, assets, exif } from "@/schema";
import { albumsAssetsAssets } from "@/schema/albumAssetsAssets.schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const currentUser = await getCurrentUser(req);
  if (!currentUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const personRecords = await db
    .select()
    .from(person)
    .where(and(
      eq(person.personGroupId, id as string),
      eq(person.ownerId, currentUser.id),
    ))
    .limit(1);

  const personRecord = personRecords?.[0];
  if (!personRecord) {
    return res.status(404).json({
      error: "Person not found",
    });
  }

  const dbPersonAlbums = await db
  .select({
    id: albums.id,
    name: albums.albumName,
    thumbnail: albums.albumThumbnailAssetId,
    assetCount: sql<number>`count(${assets.id})`,
    lastAssetDate: sql<Date>`max(${exif.dateTimeOriginal})`,
  })
  .from(albums)
  .leftJoin(assetFaces, eq(assetFaces.personGroupId, personRecord.personGroupId))
  .leftJoin(assets, eq(assets.id, assetFaces.assetId))
  .leftJoin(exif, eq(exif.assetId, assets.id))
  .leftJoin(albumsAssetsAssets, eq(albumsAssetsAssets.assetId, assets.id))
    .where(eq(albumsAssetsAssets.albumId, albums.id))
    .groupBy(albums.id);
  

  const dbPersonCities = await db.select({
    city: exif.city,
    country: exif.country,
    count: sql<number>`count(${exif.assetId})`,
  }).from(exif)
  .leftJoin(assets, eq(assets.id, exif.assetId))
  .leftJoin(assetFaces, eq(assetFaces.assetId, assets.id))
  .where(and(
    eq(assetFaces.personGroupId, personRecord.personGroupId),
    isNotNull(exif.city),
    isNotNull(exif.country),
  ))
  .groupBy(exif.city, exif.country)
  .orderBy(desc(exif.city))

  
  return res.status(200).json({
    ...personRecord,
    // The Immich API identifies a person by its personGroupId
    id: personRecord.personGroupId,
    albums: dbPersonAlbums.sort((a, b) => b.assetCount - a.assetCount).map((album) => ({
      ...album,
      lastAssetYear: album.lastAssetDate ? new Date(album.lastAssetDate).getFullYear() : null,
    })),
    cities: dbPersonCities,
    citiesCount: dbPersonCities.length,
    countriesCount: dbPersonCities.map((city) => city.country).filter((country, index, self) => self.indexOf(country) === index).length,
  });
}
