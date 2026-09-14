import { pgTable, uuid, varchar, timestamp, boolean, date, primaryKey } from "drizzle-orm/pg-core";


export const person = pgTable("person", {
  personGroupId: uuid("personGroupId").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
  ownerId: uuid("ownerId").notNull(),
  name: varchar("name").notNull().default(''),
  thumbnailPath: varchar("thumbnailPath").notNull().default(''),
  isHidden: boolean("isHidden").notNull().default(false),
  birthDate: date("birthDate", { mode: "date" }),
  faceAssetId: uuid("faceAssetId"),
}, (table) => ({
  pk: primaryKey({ columns: [table.ownerId, table.personGroupId] }),
}));

export type Person = typeof person.$inferSelect;