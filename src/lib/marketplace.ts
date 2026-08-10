import { visualAssets } from "@/components/PageHero";
import { CATALOG, type GeneratedItem } from "@/data/catalog";

/**
 * Catalogue de la marketplace AIME® — L'ongle que l'on aime.
 *
 * Combine 6 items fondateurs (mis en avant en haut de la grille) et
 * 950+ items générés paramétriquement par src/data/catalog.ts.
 *
 * Chaque item peut avoir une image éditoriale pré-générée dans
 * public/catalog/{id}.jpg. Si absente, on retombe sur le gradient
 * dérivé de la palette + le motif SVG (DesignPattern).
 */

export type MarketplaceItem = GeneratedItem & { imagePath?: string };

/* Mapping ID → image éditoriale pré-générée. Le path est résolu
   côté serveur (Next.js public/) et servi en /catalog/{file}. */

const FEATURED_IMAGE: Record<string, string> = {
  "featured-sunset-ocean": "/catalog/featured-sunset-ocean.jpg",
  "featured-wedding-pearl": "/catalog/featured-wedding-pearl.jpg",
  "featured-chrome-noir": "/catalog/featured-chrome-noir.jpg",
  "featured-cherry-blossom": "/catalog/featured-cherry-blossom.jpg",
  "featured-gothic-velvet": "/catalog/featured-gothic-velvet.jpg",
  "featured-y2k-pop": "/catalog/featured-y2k-pop.jpg",
};

/* Mapping style → image éditoriale de fallback (les 8 visuels existants).
   Utilisé quand un item généré n'a pas encore sa propre image. */
const STYLE_FALLBACK: Record<string, string> = {
  minimal: visualAssets.editorialHands,
  french: visualAssets.editorialHands,
  chrome: visualAssets.blackNails,
  luxury: visualAssets.editorialHands,
  floral: visualAssets.artHands,
  gothic: visualAssets.blackNails,
  kawaii: visualAssets.festiveHands,
  y2k: visualAssets.blueNails,
  nature: visualAssets.yellowHand,
  wedding: visualAssets.weddingHands,
  art: visualAssets.artHands,
  abstract: visualAssets.artHands,
  tribal: visualAssets.blackNails,
  celestial: visualAssets.blueNails,
  tropical: visualAssets.festiveHands,
  vintage: visualAssets.weddingHands,
  geometric: visualAssets.artHands,
  ombre: visualAssets.festiveHands,
  glitter: visualAssets.blueNails,
  matte: visualAssets.blackNails,
  baroque: visualAssets.editorialHands,
  cyberpunk: visualAssets.blackNails,
  deco: visualAssets.editorialHands,
  "op-art": visualAssets.artHands,
  streetwear: visualAssets.festiveHands,
  ethno: visualAssets.editorialHands,
  vaporwave: visualAssets.blueNails,
  nineties: visualAssets.festiveHands,
  "neo-gothic": visualAssets.blackNails,
  memphis: visualAssets.festiveHands,
  monochrome: visualAssets.editorialHands,
  mosaic: visualAssets.festiveHands,
  watercolor: visualAssets.yellowHand,
  sculptural: visualAssets.editorialHands,
  futuristic: visualAssets.blackNails,
  asiatique: visualAssets.yellowHand,
  botanical: visualAssets.yellowHand,
  rustic: visualAssets.editorialHands,
};

export const FEATURED_ITEMS: MarketplaceItem[] = [
  {
    id: "featured-sunset-ocean",
    name: "Sunset Ocean",
    creator: "AIME® Studio",
    style: "luxury" as const,
    palette: "bordeaux" as const,
    shape: "almond" as const,
    pattern: "ombre-vertical" as const,
    price: "49,90 €",
    orders: 89,
    views: 1240,
    tone: "#a7475c",
    palette3: ["#a7475c", "#22304a", "#c4545f"],
    description:
      "Inspiré d'un coucher de soleil sur la mer, élégant, bleu nuit, corail et quelques détails dorés. Les cinq designs sont différents mais appartiennent au même univers visuel.",
    tags: ["luxury", "ocean", "sunset"],
    finish: "satin" as const,
    createdAt: "2026-05-15T10:00:00.000Z",
    imagePath: FEATURED_IMAGE["featured-sunset-ocean"],
  },
  {
    id: "featured-wedding-pearl",
    name: "Wedding Pearl",
    creator: "AIME® Studio",
    style: "wedding" as const,
    palette: "nude" as const,
    shape: "oval" as const,
    pattern: "florals" as const,
    price: "59,90 €",
    orders: 56,
    views: 890,
    tone: "#e4c9c3",
    palette3: ["#e4c9c3", "#f7e8e1", "#d4a89a"],
    description:
      "Manucure de mariage en perle sheer, base nude laiteuse avec shimmer délicat. Idéal pour les mariées et demoiselles d'honneur.",
    tags: ["wedding", "pearl", "romantic"],
    finish: "satin" as const,
    createdAt: "2026-06-01T10:00:00.000Z",
    imagePath: FEATURED_IMAGE["featured-wedding-pearl"],
  },
  {
    id: "featured-chrome-noir",
    name: "Chrome Noir",
    creator: "AIME® Studio",
    style: "chrome" as const,
    palette: "noir" as const,
    shape: "coffin" as const,
    pattern: "chrome-mirror" as const,
    price: "54,90 €",
    orders: 134,
    views: 2100,
    tone: "#242424",
    palette3: ["#242424", "#0a0a0a", "#3a3a3a"],
    description:
      "Chrome noir miroir sur base glossy, finition futuriste et minimaliste. Pour celles qui veulent un look avant-gardiste.",
    tags: ["chrome", "minimal", "black"],
    finish: "chrome" as const,
    createdAt: "2026-04-10T10:00:00.000Z",
    imagePath: FEATURED_IMAGE["featured-chrome-noir"],
  },
  {
    id: "featured-cherry-blossom",
    name: "Cherry Blossom",
    creator: "AIME® Studio",
    style: "floral" as const,
    palette: "rose" as const,
    shape: "oval" as const,
    pattern: "florals" as const,
    price: "44,90 €",
    orders: 42,
    views: 760,
    tone: "#e5a8b9",
    palette3: ["#e5a8b9", "#f3d3c4", "#c4545f"],
    description:
      "Fleurs de cerisier peintes à la main sur base rose poudrée. Inspiration botanique et printanière.",
    tags: ["floral", "spring", "pink"],
    finish: "glossy" as const,
    createdAt: "2026-03-20T10:00:00.000Z",
    imagePath: FEATURED_IMAGE["featured-cherry-blossom"],
  },
  {
    id: "featured-gothic-velvet",
    name: "Gothic Velvet",
    creator: "AIME® Studio",
    style: "gothic" as const,
    palette: "bordeaux" as const,
    shape: "coffin" as const,
    pattern: "matte-velvet" as const,
    price: "52,90 €",
    orders: 78,
    views: 1450,
    tone: "#3d2139",
    palette3: ["#3d2139", "#1a0f1a", "#5a2d4a"],
    description:
      "Velours mat bordeaux profond avec accents noirs oxblood. Esthétique sombre et romantique.",
    tags: ["gothic", "velvet", "dark"],
    finish: "matte" as const,
    createdAt: "2026-02-15T10:00:00.000Z",
    imagePath: FEATURED_IMAGE["featured-gothic-velvet"],
  },
  {
    id: "featured-y2k-pop",
    name: "Y2K Pop",
    creator: "AIME® Studio",
    style: "y2k" as const,
    palette: "cyan" as const,
    shape: "ballerina" as const,
    pattern: "chrome-holographic" as const,
    price: "39,90 €",
    orders: 210,
    views: 3200,
    tone: "#6fc2c7",
    palette3: ["#6fc2c7", "#e62e6b", "#9b59ff"],
    description:
      "Holographique cyan et magenta, glitter Y2K et motifs papillons. Retour vers 2000 avec une twist moderne.",
    tags: ["y2k", "pop", "holographic"],
    finish: "glitter" as const,
    createdAt: "2026-01-05T10:00:00.000Z",
    imagePath: FEATURED_IMAGE["featured-y2k-pop"],
  },
];

export const ALL_ITEMS: MarketplaceItem[] = [
  ...FEATURED_ITEMS,
  ...CATALOG.map((item) => ({
    ...item,
    imagePath: STYLE_FALLBACK[item.style] ?? visualAssets.editorialHands,
  })),
];

export function getMarketplaceItem(id: string): MarketplaceItem | null {
  return ALL_ITEMS.find((item) => item.id === id) ?? null;
}

export function getCreatorItems(creator: string): MarketplaceItem[] {
  return ALL_ITEMS.filter((item) => item.creator === creator);
}
