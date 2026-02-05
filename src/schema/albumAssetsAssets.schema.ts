import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';

export const albumsAssetsAssets = pgTable('album_asset', {
  albumId: uuid("albumId").notNull(),
  assetId: uuid("assetId").notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
});