import { db, pool } from "./index";
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
} from "./schema";
import { v4 as uuidv4 } from "uuid";

// Generate fixed UUIDs
const userId1 = uuidv4();
const userId2 = uuidv4();
const userId3 = uuidv4();
const profileId = uuidv4();

async function seed() {
  console.log("🌱 Seeding database...");

  // ── Users ──────────────────────────────────────────
  await db.insert(users).values([
    { id: userId1, name: "Camille Dubois", email: "camille@nailprofile.com", avatarUrl: null, bio: "Nail artist & creator" },
    { id: userId2, name: "Léa Moreau", email: "lea@nailprofile.com", avatarUrl: null, bio: "Passionnée de nail art" },
    { id: userId3, name: "Sofia Chen", email: "sofia@nailprofile.com", avatarUrl: null, bio: "Créatrice de designs minimalistes" },
  ]);

  // ── Nail Profile ───────────────────────────────────
  await db.insert(nailProfiles).values({
    id: profileId,
    userId: userId1,
    scanMode: "precision",
    handImageUrl: null,
  });

  const fingers = [
    "thumb_left", "index_left", "middle_left", "ring_left", "pinky_left",
    "thumb_right", "index_right", "middle_right", "ring_right", "pinky_right",
  ] as const;

  const nailData = [
    { w: "14.20", h: "18.70", s: "almond" as const, c: 98 },
    { w: "12.80", h: "16.40", s: "oval" as const, c: 97 },
    { w: "13.10", h: "17.20", s: "oval" as const, c: 96 },
    { w: "11.50", h: "15.80", s: "round" as const, c: 95 },
    { w: "10.20", h: "14.10", s: "round" as const, c: 94 },
    { w: "14.50", h: "19.00", s: "almond" as const, c: 97 },
    { w: "13.00", h: "16.60", s: "oval" as const, c: 96 },
    { w: "13.30", h: "17.40", s: "oval" as const, c: 95 },
    { w: "11.70", h: "16.00", s: "round" as const, c: 94 },
    { w: "10.40", h: "14.30", s: "round" as const, c: 93 },
  ];

  for (let i = 0; i < fingers.length; i++) {
    await db.insert(nails).values({
      profileId,
      finger: fingers[i],
      width: nailData[i].w,
      height: nailData[i].h,
      shape: nailData[i].s,
      confidence: nailData[i].c,
      orientation: "0",
      contourData: null,
    });
  }

  // ── Design Sets ────────────────────────────────────
  const set1Id = uuidv4();
  const set2Id = uuidv4();
  const set3Id = uuidv4();
  const set4Id = uuidv4();
  const set5Id = uuidv4();
  const set6Id = uuidv4();

  await db.insert(designSets).values([
    {
      id: set1Id, userId: userId1, name: "Sunset Ocean",
      description: "Inspiré d'un coucher de soleil sur la mer, élégant, bleu nuit, corail et quelques détails dorés.",
      promptText: "Je veux un design inspiré d'un coucher de soleil sur la mer, élégant, bleu nuit, corail et quelques détails dorés.",
      palette: ["#1a1a2e", "#e94560", "#f5c842", "#16213e", "#ff6b6b"],
      style: "luxury", visibility: "public" as const, price: "49.90",
      views: 1240, tryOns: 342, orders: 89, revenue: "4441.10",
      fabricabilityScore: 92, finish: "glossy" as const, nailShape: "almond" as const,
    },
    {
      id: set2Id, userId: userId2, name: "Wedding Pearl",
      description: "Délicat et romantique, perles nacrées sur fond blanc crème.",
      promptText: "Un design de mariage délicat avec des perles nacrées, fond blanc crème.",
      palette: ["#fef9ef", "#f7d1d1", "#e8b4b8", "#d4a5a5", "#c9a96e"],
      style: "wedding", visibility: "public" as const, price: "59.90",
      views: 890, tryOns: 234, orders: 56, revenue: "3354.40",
      fabricabilityScore: 95, finish: "glossy" as const, nailShape: "oval" as const,
    },
    {
      id: set3Id, userId: userId3, name: "Chrome Noir",
      description: "Minimal et puissant, chrome noir miroir avec lignes architecturales.",
      promptText: "Design minimaliste chrome noir miroir, lignes architecturales fines.",
      palette: ["#0d0d0d", "#1a1a1a", "#333333", "#666666", "#c0c0c0"],
      style: "chrome", visibility: "public" as const, price: "54.90",
      views: 2100, tryOns: 567, orders: 134, revenue: "7356.60",
      fabricabilityScore: 88, finish: "chrome" as const, nailShape: "coffin" as const,
    },
    {
      id: set4Id, userId: userId1, name: "Cherry Blossom",
      description: "Printemps japonais, fleurs de cerisier sur fond nude transparent.",
      promptText: "Design inspiré des fleurs de cerisier japonaises.",
      palette: ["#fce4ec", "#f8bbd0", "#f48fb1", "#e91e63", "#fff9c4"],
      style: "floral", visibility: "public" as const, price: "44.90",
      views: 760, tryOns: 189, orders: 42, revenue: "1885.80",
      fabricabilityScore: 90, finish: "glossy" as const, nailShape: "round" as const,
    },
    {
      id: set5Id, userId: userId1, name: "Gothic Velvet",
      description: "Noir profond, velours pourpre, dentelle gothique élégante.",
      promptText: "Design gothique élégant, noir profond, touches de velours pourpre.",
      palette: ["#1a001a", "#2d002d", "#4a004a", "#800020", "#d4af37"],
      style: "gothic", visibility: "public" as const, price: "52.90",
      views: 1450, tryOns: 412, orders: 78, revenue: "4126.20",
      fabricabilityScore: 85, finish: "matte" as const, nailShape: "stiletto" as const,
    },
    {
      id: set6Id, userId: userId3, name: "Y2K Pop",
      description: "Nostalgie années 2000, couleurs pop, paillettes holographiques.",
      promptText: "Design Y2K vibrant, couleurs pop, paillettes holographiques.",
      palette: ["#ff6bff", "#00f5ff", "#ffdd00", "#ff1493", "#7b68ee"],
      style: "y2k", visibility: "public" as const, price: "39.90",
      views: 3200, tryOns: 890, orders: 210, revenue: "8379.00",
      fabricabilityScore: 91, finish: "chrome" as const, nailShape: "square" as const,
    },
  ]);

  // ── Individual Designs ─────────────────────────────
  const allSets = [set1Id, set2Id, set3Id, set4Id, set5Id, set6Id];
  const fabricScores = [92, 95, 88, 90, 85, 91];
  for (let s = 0; s < allSets.length; s++) {
    for (let i = 0; i < 10; i++) {
      await db.insert(designs).values({
        designSetId: allSets[s],
        finger: fingers[i],
        position: i,
        fabricabilityScore: Math.min(100, Math.max(70, fabricScores[s] + Math.floor(Math.random() * 10) - 5)),
      });
    }
  }

  // ── Orders ─────────────────────────────────────────
  await db.insert(orders).values([
    { userId: userId1, designSetId: set1Id, profileId, status: "delivered" as const, finish: "glossy" as const, nailShape: "almond" as const, totalPrice: "49.90" },
    { userId: userId1, designSetId: set3Id, profileId, status: "in_production" as const, finish: "chrome" as const, nailShape: "coffin" as const, totalPrice: "54.90" },
    { userId: userId2, designSetId: set6Id, profileId: null, status: "shipped" as const, finish: "chrome" as const, nailShape: "square" as const, totalPrice: "39.90" },
  ]);

  // ── Favorites ──────────────────────────────────────
  await db.insert(favorites).values([
    { userId: userId1, designSetId: set2Id },
    { userId: userId1, designSetId: set5Id },
    { userId: userId1, designSetId: set6Id },
  ]);

  // ── Collections ────────────────────────────────────
  const collIds = Array.from({ length: 12 }, () => uuidv4());
  await db.insert(collections).values([
    { id: collIds[0], name: "Wedding", theme: "wedding" as const, description: "Designs pour le plus beau jour" },
    { id: collIds[1], name: "Summer Vibes", theme: "summer" as const, description: "Chaleur et couleurs solaires" },
    { id: collIds[2], name: "Autumn Leaves", theme: "autumn" as const, description: "Tons chauds et cosy" },
    { id: collIds[3], name: "Christmas Magic", theme: "christmas" as const, description: "Féerie de Noël" },
    { id: collIds[4], name: "Luxury Edition", theme: "luxury" as const, description: "Luxe absolu" },
    { id: collIds[5], name: "Minimal Purity", theme: "minimal" as const, description: "Moins c'est plus" },
    { id: collIds[6], name: "French Classic", theme: "french" as const, description: "L'élégance intemporelle" },
    { id: collIds[7], name: "Chrome Collection", theme: "chrome" as const, description: "Miroir et reflets" },
    { id: collIds[8], name: "Floral Dreams", theme: "floral" as const, description: "Jardin enchanté" },
    { id: collIds[9], name: "Gothic Romance", theme: "gothic" as const, description: "Dark & elegant" },
    { id: collIds[10], name: "Y2K Forever", theme: "y2k" as const, description: "Nostalgie pop" },
    { id: collIds[11], name: "Art Gallery", theme: "art" as const, description: "L'ongle comme toile" },
  ]);

  await db.insert(collectionDesigns).values([
    { collectionId: collIds[0], designSetId: set2Id },
    { collectionId: collIds[4], designSetId: set1Id },
    { collectionId: collIds[4], designSetId: set5Id },
    { collectionId: collIds[7], designSetId: set3Id },
    { collectionId: collIds[8], designSetId: set4Id },
    { collectionId: collIds[10], designSetId: set6Id },
  ]);

  console.log("✅ Seed complete!");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
