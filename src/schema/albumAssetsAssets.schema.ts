import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';

export const albumsAssetsAssets = pgTable('album_asset', {
  albumsId: uuid('albumsId').notNull(),
  assetsId: uuid('assetsId').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
});