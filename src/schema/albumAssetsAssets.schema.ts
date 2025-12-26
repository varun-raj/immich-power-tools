import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';

export const albumsAssetsAssets = pgTable('album_asset', {
  albumsId: uuid('albumId').notNull(),
  assetsId: uuid('assetId').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
});