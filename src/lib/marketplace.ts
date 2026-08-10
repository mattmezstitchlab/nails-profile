import { visualAssets } from "@/components/PageHero";

/**
 * Catalogue de la marketplace.
 * Pour l'instant : 6 items fondateurs. Sera étendu à 1000+ via
 * une approche paramétrique (style × palette × forme × créateur).
 */

export type MarketplaceItem = {
  id: string;
  name: string;
  creator: string;
  style: string;
  price: string; // formaté FR "49,90 €"
  orders: number;
  views: number;
  tone: string; // couleur primaire hex
  image: string; // visuel éditorial
  description: string;
  tags: string[];
  palette: string[]; // 3 couleurs hex
  finish: "glossy" | "matte" | "satin" | "chrome" | "glitter";
};

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: "set1",
    name: "Sunset Ocean",
    creator: "Camille Dubois",
    style: "Luxury",
    price: "49,90 €",
    orders: 89,
    views: 1240,
    tone: "#a7475c",
    image: visualAssets.editorialHands,
    description:
      "Inspiré d'un coucher de soleil sur la mer, élégant, bleu nuit, corail et quelques détails dorés. Les cinq designs sont différents mais appartiennent au même univers visuel.",
    tags: ["luxury", "ocean", "sunset"],
    palette: ["#a7475c", "#22304a", "#c4545f"],
    finish: "satin",
  },
  {
    id: "set2",
    name: "Wedding Pearl",
    creator: "Léa Moreau",
    style: "Wedding",
    price: "59,90 €",
    orders: 56,
    views: 890,
    tone: "#e4c9c3",
    image: visualAssets.weddingHands,
    description:
      "Manucure de mariage en perle sheer, base nude laiteuse avec shimmer délicat. Idéal pour les mariées et demoiselles d'honneur.",
    tags: ["wedding", "pearl", "romantic"],
    palette: ["#e4c9c3", "#f7e8e1", "#d4a89a"],
    finish: "satin",
  },
  {
    id: "set3",
    name: "Chrome Noir",
    creator: "Sofia Chen",
    style: "Chrome",
    price: "54,90 €",
    orders: 134,
    views: 2100,
    tone: "#242424",
    image: visualAssets.blackNails,
    description:
      "Chrome noir miroir sur base glossy, finition futuriste et minimaliste. Pour celles qui veulent un look avant-gardiste.",
    tags: ["chrome", "minimal", "black"],
    palette: ["#242424", "#0a0a0a", "#3a3a3a"],
    finish: "chrome",
  },
  {
    id: "set4",
    name: "Cherry Blossom",
    creator: "Camille Dubois",
    style: "Floral",
    price: "44,90 €",
    orders: 42,
    views: 760,
    tone: "#e5a8b9",
    image: visualAssets.artHands,
    description:
      "Fleurs de cerisier peintes à la main sur base rose poudrée. Inspiration botanique et printanière.",
    tags: ["floral", "spring", "pink"],
    palette: ["#e5a8b9", "#f3d3c4", "#c4545f"],
    finish: "glossy",
  },
  {
    id: "set5",
    name: "Gothic Velvet",
    creator: "Camille Dubois",
    style: "Gothic",
    price: "52,90 €",
    orders: 78,
    views: 1450,
    tone: "#3d2139",
    image: visualAssets.blackNails,
    description:
      "Velours mat bordeaux profond avec accents noirs oxblood. Esthétique sombre et romantique.",
    tags: ["gothic", "velvet", "dark"],
    palette: ["#3d2139", "#1a0f1a", "#5a2d4a"],
    finish: "matte",
  },
  {
    id: "set6",
    name: "Y2K Pop",
    creator: "Sofia Chen",
    style: "Y2K",
    price: "39,90 €",
    orders: 210,
    views: 3200,
    tone: "#6fc2c7",
    image: visualAssets.blueNails,
    description:
      "Holographique cyan et magenta, glitter Y2K et motifs papillons. Retour vers 2000 avec une twist moderne.",
    tags: ["y2k", "pop", "holographic"],
    palette: ["#6fc2c7", "#e62e6b", "#9b59ff"],
    finish: "glitter",
  },
];

export function getMarketplaceItem(id: string): MarketplaceItem | null {
  return MARKETPLACE_ITEMS.find((item) => item.id === id) ?? null;
}

export function getCreatorItems(creator: string): MarketplaceItem[] {
  return MARKETPLACE_ITEMS.filter((item) => item.creator === creator);
}

export const CREATORS = Array.from(
  new Set(MARKETPLACE_ITEMS.map((item) => item.creator))
).map((name) => {
  const items = getCreatorItems(name);
  return {
    name,
    initials: name
      .split(" ")
      .map((n) => n[0])
      .join(""),
    sets: items.length,
    tone: items[0]?.tone ?? "#888",
    items,
  };
});
