import { relations } from "drizzle-orm";
import {
  users,
  nailProfiles,
  nails,
  designSets,
  designs,
  orders,
  favorites,
  collections,
  collectionDesigns,
  inspirations,
} from "./schema";

export const usersRelations = relations(users, ({ one, many }) => ({
  nailProfile: one(nailProfiles, {
    fields: [users.id],
    references: [nailProfiles.userId],
  }),
  designSets: many(designSets),
  orders: many(orders),
  favorites: many(favorites),
  inspirations: many(inspirations),
}));

export const nailProfilesRelations = relations(nailProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [nailProfiles.userId],
    references: [users.id],
  }),
  nails: many(nails),
  orders: many(orders),
}));

export const nailsRelations = relations(nails, ({ one }) => ({
  profile: one(nailProfiles, {
    fields: [nails.profileId],
    references: [nailProfiles.id],
  }),
}));

export const designSetsRelations = relations(designSets, ({ one, many }) => ({
  user: one(users, {
    fields: [designSets.userId],
    references: [users.id],
  }),
  designs: many(designs),
  orders: many(orders),
  favorites: many(favorites),
  collectionDesigns: many(collectionDesigns),
}));

export const designsRelations = relations(designs, ({ one }) => ({
  designSet: one(designSets, {
    fields: [designs.designSetId],
    references: [designSets.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  designSet: one(designSets, {
    fields: [orders.designSetId],
    references: [designSets.id],
  }),
  profile: one(nailProfiles, {
    fields: [orders.profileId],
    references: [nailProfiles.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  designSet: one(designSets, {
    fields: [favorites.designSetId],
    references: [designSets.id],
  }),
}));

export const collectionsRelations = relations(collections, ({ many }) => ({
  collectionDesigns: many(collectionDesigns),
}));

export const collectionDesignsRelations = relations(collectionDesigns, ({ one }) => ({
  collection: one(collections, {
    fields: [collectionDesigns.collectionId],
    references: [collections.id],
  }),
  designSet: one(designSets, {
    fields: [collectionDesigns.designSetId],
    references: [designSets.id],
  }),
}));

export const inspirationsRelations = relations(inspirations, ({ one }) => ({
  user: one(users, {
    fields: [inspirations.userId],
    references: [users.id],
  }),
}));
