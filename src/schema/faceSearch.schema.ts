import { pgTable, uuid, vector } from "drizzle-orm/pg-core";

export const faceSearch = pgTable("face_search", {
    faceId: uuid("faceId").notNull(),
    embedding: vector("embedding", {
      dimensions: 512,
    }).notNull(),
});

