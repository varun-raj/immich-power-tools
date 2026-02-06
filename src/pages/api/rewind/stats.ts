import { NextApiRequest, NextApiResponse } from "next";

import { and, desc, gt, isNotNull, isNull, ne, sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { db } from "@/config/db";
import { count } from "drizzle-orm";
import { assets } from "@/schema/assets.schema";
import { assetFaces } from "@/schema/assetFaces.schema";
import { exif, person, users } from "@/schema";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { albums } from "@/schema/albums.schema";
import { albumsAssetsAssets } from "@/schema/albumAssetsAssets.schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { year = "2024" } = req.query as { year: string }; 

  const user = await getCurrentUser(req);

  if (!user) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const numberOfPhotos = await db.select({ count: count(assets.id) }).from(assets).where(and( 
    eq(assets.ownerId, user.id),
    eq(assets.visibility, "timeline"),
    eq(assets.status, "active"),
  ));

  // Get list of countries visited in the year
  const countriesInYear = await db
  .select({ name: exif.country, count: count(assets.id) })
  .from(exif)
  .leftJoin(assets, eq(assets.id, exif.assetId))
  .where(and(
    eq(sql`EXTRACT(YEAR FROM ${exif.dateTimeOriginal})`, year),
    eq(assets.ownerId, user.id),
    eq(assets.visibility, "timeline"),
    eq(assets.status, "active"),
  ))
  .groupBy(exif.country);

  const countries = countriesInYear.filter(country => !!country.name).map(country => country.name);

  const countOfCities = await db
  .select({ name: exif.city, count: count(assets.id) })
  .from(exif)
  .leftJoin(assets, eq(assets.id, exif.assetId))
  .where(and(
    eq(sql`EXTRACT(YEAR FROM ${exif.dateTimeOriginal})`, year),
    eq(assets.ownerId, user.id),
    eq(assets.visibility, "timeline"),
    eq(assets.status, "active"),
  ))
  .groupBy(exif.city);

  const cities = countOfCities.filter(city => !!city.name).map(city => city.name);

  const albumsWithMostPhotos = await db
  .select({ 
    name: albums.albumName, 
    count: count(assets.id),
    cover: albums.albumThumbnailAssetId
  })
  .from(albumsAssetsAssets)
  .leftJoin(albums, eq(albums.id, albumsAssetsAssets.albumId))
  .leftJoin(assets, eq(assets.id, albumsAssetsAssets.assetId))
  .leftJoin(exif, eq(exif.assetId, assets.id))
  .where(and(
    eq(sql`EXTRACT(YEAR FROM ${exif.dateTimeOriginal})`, year),
    eq(assets.ownerId, user.id),
    eq(assets.visibility, "timeline"),
    eq(assets.status, "active"),
  ))
  .orderBy(desc(count(assets.id)))
  .limit(4)
  .groupBy(albums.id);

  const peopleWithMostPhotos = await db
  .select({ 
    name: person.name, 
    count: count(assets.id),
    id: person.id,
    cover: person.faceAssetId
  })
  .from(assetFaces)
  .leftJoin(assets, eq(assets.id, assetFaces.assetId))
  .leftJoin(person, eq(person.id, assetFaces.personId))
  .leftJoin(exif, eq(exif.assetId, assets.id))
  .where(and(
    eq(sql`EXTRACT(YEAR FROM ${exif.dateTimeOriginal})`, year),
    eq(assets.ownerId, user.id),
    eq(assets.visibility, "timeline"),
    eq(assets.status, "active"),
    isNotNull(person.name),
  ))
  .orderBy(desc(count(assets.id)))
  .limit(2)
  .groupBy(person.id);

  const favoritedAssets = await db
  .select({ id: assets.id })
  .from(assets)
  .leftJoin(exif, eq(exif.assetId, assets.id))
  .where(and(
    eq(assets.visibility, "timeline"),
    eq(assets.isFavorite, true),
    eq(assets.status, "active"),
    eq(assets.ownerId, user.id),
    eq(sql`EXTRACT(YEAR FROM ${exif.dateTimeOriginal})`, year),
  ))
  .limit(4); 

  return res.status(200).json({
    name: user.name,
    numberOfPhotos: numberOfPhotos[0].count,
    countriesInYear: countries,
    countOfCities: cities.length,
    albumsWithMostPhotos,
    peopleWithMostPhotos: peopleWithMostPhotos,
    favoritedAssets: favoritedAssets.map(asset => asset.id)
  });
} 