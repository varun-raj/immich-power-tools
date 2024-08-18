import { pgTable, uuid, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const assets = pgTable('assets', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  deviceAssetId: varchar('deviceAssetId').notNull(),
  // ownerId: uuid('ownerId').notNull().references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  deviceId: varchar('deviceId').notNull(),
  type: varchar('type').notNull(),
  originalPath: varchar('originalPath').notNull(),
  previewPath: varchar('previewPath'),
  fileCreatedAt: timestamp('fileCreatedAt', { withTimezone: true }).notNull(),
  fileModifiedAt: timestamp('fileModifiedAt', { withTimezone: true }).notNull(),
  isFavorite: boolean('isFavorite').default(false).notNull(),
  duration: varchar('duration'),
  thumbnailPath: varchar('thumbnailPath').default(''),
  encodedVideoPath: varchar('encodedVideoPath').default(''),
  // checksum: bytea('checksum').notNull(),
  isVisible: boolean('isVisible').default(true).notNull(),
  livePhotoVideoId: uuid('livePhotoVideoId').references((): any => assets.id, { onDelete: 'set null', onUpdate: 'cascade' }),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  isArchived: boolean('isArchived').default(false).notNull(),
  originalFileName: varchar('originalFileName').notNull(),
  sidecarPath: varchar('sidecarPath'),
  // thumbhash: bytea('thumbhash'),
  isOffline: boolean('isOffline').default(false).notNull(),
  // libraryId: uuid('libraryId').references(() => libraries.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  isExternal: boolean('isExternal').default(false).notNull(),
  deletedAt: timestamp('deletedAt', { withTimezone: true }),
  localDateTime: timestamp('localDateTime', { withTimezone: true }).notNull(),
  // stackId: uuid('stackId').references(() => assetStack.id, { onDelete: 'set null', onUpdate: 'cascade' }),
  duplicateId: uuid('duplicateId'),
});

// // Note: You'll need to define these referenced tables as well
// export const users = pgTable('users', {
//   id: uuid('id').primaryKey(),
//   // ... other columns
// });

// export const libraries = pgTable('libraries', {
//   id: uuid('id').primaryKey(),
//   // ... other columns
// });

// export const assetStack = pgTable('asset_stack', {
//   id: uuid('id').primaryKey(),
//   // ... other columns
// });