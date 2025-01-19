import { pgTable, uuid, varchar, timestamp, boolean, date, pgEnum } from "drizzle-orm/pg-core";


export const person = pgTable("person", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
  ownerId: uuid("ownerId").notNull(),
  name: varchar("name").notNull().default(''),
  thumbnailPath: varchar("thumbnailPath").notNull().default(''),
  isHidden: boolean("isHidden").notNull().default(false),
  birthDate: date("birthDate", { mode: "date" }),
  faceAssetId: uuid("faceAssetId"),
});

export type Person = typeof person.$inferSelect;