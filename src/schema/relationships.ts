import { relations } from "drizzle-orm";
import { assetFaces } from "./assetFaces.schema";
import { assets } from "./assets.schema";
import { person } from "./person.schema";
import { users } from "./users.schema";
import { faceSearch } from "./faceSearch.schema";

// Assuming there are relations to be defined with `assets` and `person`
export const assetFacesRelations = relations(assetFaces, ({ one }) => ({
  asset: one(assets, {
      fields: [assetFaces.assetId],
      references: [assets.id],
  }),
  person: one(person, {
      fields: [assetFaces.personId],
      references: [person.id],
  }),
}));


// Assuming there are relations to be defined with `users` and `asset_faces`
export const personRelations = relations(person, ({ one }) => ({
  owner: one(users, {
      fields: [person.ownerId],
      references: [users.id],
  }),
  faceAsset: one(assetFaces, {
      fields: [person.faceAssetId],
      references: [assetFaces.id],
  }),
}));


// Assuming there are relations to be defined with `asset_faces`
export const faceSearchRelations = relations(faceSearch, ({ one }) => ({
  face: one(assetFaces, {
      fields: [faceSearch.faceId],
      references: [assetFaces.id],
  }),
}));
