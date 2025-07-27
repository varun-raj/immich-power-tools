import { pgTable, uuid, varchar, timestamp, boolean, bigint } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email").notNull(),
    password: varchar("password").notNull().default(''),
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
    profileImagePath: varchar("profileImagePath").notNull().default(''),
    isAdmin: boolean("isAdmin").notNull().default(false),
    shouldChangePassword: boolean("shouldChangePassword").notNull().default(true),
    deletedAt: timestamp("deletedAt", { withTimezone: true }),
    oauthId: varchar("oauthId").notNull().default(''),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
    storageLabel: varchar("storageLabel"),
    name: varchar("name").notNull().default(''),
    quotaSizeInBytes: bigint("quotaSizeInBytes", {
      mode: 'bigint'
    }),
    quotaUsageInBytes: bigint("quotaUsageInBytes", {
      mode: 'bigint'
    }).notNull(),
    status: varchar("status").notNull().default('active'),
});
