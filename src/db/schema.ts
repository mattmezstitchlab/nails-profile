import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  decimal,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";

// ── Enums ──────────────────────────────────────────────
export const fingerEnum = pgEnum("finger", [
  "thumb_left",
  "index_left",
  "middle_left",
  "ring_left",
  "pinky_left",
  "thumb_right",
  "index_right",
  "middle_right",
  "ring_right",
  "pinky_right",
]);

export const nailShapeEnum = pgEnum("nail_shape", [
  "natural",
  "almond",
  "oval",
  "square",
  "coffin",
  "stiletto",
  "round",
  "ballerina",
]);

export const finishEnum = pgEnum("finish", ["glossy", "matte", "chrome", "metallic"]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "in_production",
  "shipped",
  "delivered",
  "cancelled",
]);

export const visibilityEnum = pgEnum("visibility", ["private", "public", "creator"]);

export const collectionThemeEnum = pgEnum("collection_theme", [
  "wedding",
  "summer",
  "autumn",
  "christmas",
  "halloween",
  "luxury",
  "minimal",
  "french",
  "chrome",
  "floral",
  "art",
  "nature",
  "travel",
  "y2k",
  "gothic",
  "kawaii",
]);

// ── Users ──────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Nail Profile ───────────────────────────────────────
export const nailProfiles = pgTable("nail_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  scanMode: text("scan_mode").default("quick").notNull(), // quick | precision
  handImageUrl: text("hand_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Individual Nails ───────────────────────────────────
export const nails = pgTable("nails", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id")
    .references(() => nailProfiles.id, { onDelete: "cascade" })
    .notNull(),
  finger: fingerEnum("finger").notNull(),
  width: decimal("width", { precision: 6, scale: 2 }), // mm
  height: decimal("height", { precision: 6, scale: 2 }), // mm
  shape: nailShapeEnum("shape").default("natural"),
  confidence: integer("confidence").default(95), // 0-100
  orientation: decimal("orientation", { precision: 5, scale: 2 }), // degrees
  contourData: jsonb("contour_data"), // SVG path or point array
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Design Sets ────────────────────────────────────────
export const designSets = pgTable("design_sets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  promptText: text("prompt_text"),
  inspirationUrl: text("inspiration_url"),
  palette: jsonb("palette"), // array of hex colors
  style: text("style"),
  visibility: visibilityEnum("visibility").default("private").notNull(),
  isOptimized: boolean("is_optimized").default(false),
  fabricabilityScore: integer("fabricability_score"), // 0-100
  views: integer("views").default(0),
  tryOns: integer("try_ons").default(0),
  orders: integer("orders").default(0),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0"),
  price: decimal("price", { precision: 8, scale: 2 }),
  finish: finishEnum("finish").default("glossy"),
  nailShape: nailShapeEnum("nail_shape").default("natural"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Individual Designs (1 per nail per set) ────────────
export const designs = pgTable("designs", {
  id: uuid("id").primaryKey().defaultRandom(),
  designSetId: uuid("design_set_id")
    .references(() => designSets.id, { onDelete: "cascade" })
    .notNull(),
  finger: fingerEnum("finger").notNull(),
  imageUrl: text("image_url"),
  promptVariant: text("prompt_variant"),
  fabricabilityScore: integer("fabricability_score"),
  position: integer("position").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Orders ─────────────────────────────────────────────
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  designSetId: uuid("design_set_id").references(() => designSets.id, {
    onDelete: "set null",
  }),
  profileId: uuid("profile_id").references(() => nailProfiles.id),
  status: orderStatusEnum("status").default("pending").notNull(),
  finish: finishEnum("finish").default("glossy"),
  nailShape: nailShapeEnum("nail_shape").default("natural"),
  totalPrice: decimal("total_price", { precision: 8, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Favorites ──────────────────────────────────────────
export const favorites = pgTable("favorites", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  designSetId: uuid("design_set_id")
    .references(() => designSets.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Collections ────────────────────────────────────────
export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  theme: collectionThemeEnum("theme"),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  isDynamic: boolean("is_dynamic").default(false), // AI-generated
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const collectionDesigns = pgTable("collection_designs", {
  id: uuid("id").primaryKey().defaultRandom(),
  collectionId: uuid("collection_id")
    .references(() => collections.id, { onDelete: "cascade" })
    .notNull(),
  designSetId: uuid("design_set_id")
    .references(() => designSets.id, { onDelete: "cascade" })
    .notNull(),
});

// ── Inspirations (uploaded images) ────────────────────
export const inspirations = pgTable("inspirations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  imageUrl: text("image_url").notNull(),
  analyzedColors: jsonb("analyzed_colors"),
  analyzedStyle: text("analyzed_style"),
  analyzedMood: text("analyzed_mood"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
