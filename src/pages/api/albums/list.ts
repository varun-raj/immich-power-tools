import { NextApiRequest } from "next";

import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { NextApiResponse } from "next";
import { albums } from "@/schema/albums.schema";
import { count, desc, eq, min, max, sql, and } from "drizzle-orm";
import { assets } from "@/schema/assets.schema";
import { albumsAssetsAssets } from "@/schema/albumAssetsAssets.schema";
import { users } from "@/schema/users.schema";
import { assetFaces, exif, person } from "@/schema";
import { IAlbum } from "@/types/album";


const sortAlbums = (albums: IAlbum[], sortBy: string, sortOrder: string) => {
  if (sortBy === 'createdAt') {
    return albums.sort((a, b) => sortOrder === 'asc' ? a.createdAt.getTime() - b.createdAt.getTime() : b.createdAt.getTime() - a.createdAt.getTime());
  }
  if (sortBy === 'updatedAt') {
    return albums.sort((a, b) => sortOrder === 'asc' ? a.updatedAt.getTime() - b.updatedAt.getTime() : b.updatedAt.getTime() - a.updatedAt.getTime());
  }
  if (sortBy === 'firstPhotoDate') {
    return albums.sort((a, b) => sortOrder === 'asc' ? a.firstPhotoDate.getTime() - b.firstPhotoDate.getTime() : b.firstPhotoDate.getTime() - a.firstPhotoDate.getTime());
  }
  if (sortBy === 'lastPhotoDate') {
    return albums.sort((a, b) => sortOrder === 'asc' ? a.lastPhotoDate.getTime() - b.lastPhotoDate.getTime() : b.lastPhotoDate.getTime() - a.lastPhotoDate.getTime());
  }
  if (sortBy === 'assetCount') {
    return albums.sort((a, b) => sortOrder === 'asc' ? a.assetCount - b.assetCount : b.assetCount - a.assetCount);
  }
  return albums;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const currentUser = await getCurrentUser(req);
  if (!currentUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { sortBy = 'lastPhotoDate', sortOrder = 'desc' } = req.query as { sortBy: string, sortOrder: string };

  const dbAlbums = await db.select({
    id: albums.id,
    albumName: albums.albumName,
    createdAt: albums.createdAt,
    updatedAt: albums.updatedAt,
    albumThumbnailAssetId: albums.albumThumbnailAssetId,
    assetCount: count(assets.id),
    firstPhotoDate: min(exif.dateTimeOriginal),
    lastPhotoDate: max(exif.dateTimeOriginal),
    faceCount: count(sql<string>`DISTINCT ${assetFaces.personId}`), // Ensure unique personId
  })
    .from(albums)
    .leftJoin(albumsAssetsAssets, eq(albums.id, albumsAssetsAssets.albumsId))
    .leftJoin(assets, eq(albumsAssetsAssets.assetsId, assets.id))
    .leftJoin(exif, eq(assets.id, exif.assetId))
    .leftJoin(assetFaces, eq(assets.id, assetFaces.assetId))
    .leftJoin(person, and(eq(assetFaces.personId, person.id), eq(person.isHidden, false)))
    .where(eq(albums.ownerId, currentUser.id))
    .groupBy(albums.id)
    .orderBy(desc(albums.createdAt));
  
  const sortedAlbums = sortAlbums(dbAlbums as IAlbum[], sortBy, sortOrder);
  res.status(200).json(dbAlbums);
}