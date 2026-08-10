/**
 * Générateur paramétrique du catalogue Nail Profile.
 *
 * Combine 20 styles × 25 palettes × 8 formes × 6 créateurs = jusqu'à
 * 24 000 combinaisons uniques. Chaque combinaison produit un item
 * déterministe (même seed = même item) avec un nom éditorial,
 * une description, des tags et des métriques réalistes.
 *
 * NB : ce fichier est un *générateur* (utilisé par un script de seed
 * ou un build). Le catalogue statique final vit dans
 * src/data/catalog.ts et est importé par les pages.
 */

export type CatalogStyle =
  | "minimal"
  | "french"
  | "chrome"
  | "luxury"
  | "floral"
  | "gothic"
  | "kawaii"
  | "y2k"
  | "nature"
  | "wedding"
  | "art"
  | "abstract"
  | "tribal"
  | "celestial"
  | "tropical"
  | "vintage"
  | "geometric"
  | "ombre"
  | "glitter"
  | "matte";

export const STYLES: CatalogStyle[] = [
  "minimal", "french", "chrome", "luxury", "floral", "gothic", "kawaii",
  "y2k", "nature", "wedding", "art", "abstract", "tribal", "celestial",
  "tropical", "vintage", "geometric", "ombre", "glitter", "matte",
];

export type PaletteName =
  | "noir"
  | "blanc"
  | "rouge"
  | "rose"
  | "corail"
  | "orange"
  | "jaune"
  | "dore"
  | "kaki"
  | "vert"
  | "menthe"
  | "turquoise"
  | "cyan"
  | "bleu"
  | "marine"
  | "lavande"
  | "violet"
  | "magenta"
  | "marron"
  | "beige"
  | "nude"
  | "bordeaux"
  | "bronze"
  | "argent"
  | "creme";

export const PALETTES: { name: PaletteName; colors: [string, string, string] }[] = [
  { name: "noir", colors: ["#0a0a0a", "#1f1f1f", "#3a3a3a"] },
  { name: "blanc", colors: ["#fefefe", "#e8e8e8", "#cfcfcf"] },
  { name: "rouge", colors: ["#c8102e", "#8b0a1a", "#e5445f"] },
  { name: "rose", colors: ["#f7c7d7", "#e62e6b", "#ffd1dc"] },
  { name: "corail", colors: ["#ff7f50", "#d95f3a", "#ff9d7a"] },
  { name: "orange", colors: ["#ff8c00", "#cc6600", "#ffaa33"] },
  { name: "jaune", colors: ["#ffd700", "#d4a017", "#fff099"] },
  { name: "dore", colors: ["#d4af37", "#a17c1a", "#f4d77a"] },
  { name: "kaki", colors: ["#6b7c3a", "#4a5828", "#8fa354"] },
  { name: "vert", colors: ["#2d6a4f", "#1b4332", "#52b788"] },
  { name: "menthe", colors: ["#b8e6c8", "#7fc8a0", "#dff3e2"] },
  { name: "turquoise", colors: ["#40e0d0", "#20b2aa", "#7fffd4"] },
  { name: "cyan", colors: ["#00bcd4", "#0097a7", "#62d3e0"] },
  { name: "bleu", colors: ["#1e88e5", "#0d47a1", "#64b5f6"] },
  { name: "marine", colors: ["#0d1b2a", "#1b263b", "#415a77"] },
  { name: "lavande", colors: ["#b39ddb", "#7e57c2", "#d1c4e9"] },
  { name: "violet", colors: ["#6a0dad", "#4a148c", "#9c27b0"] },
  { name: "magenta", colors: ["#e91e63", "#ad1457", "#f48fb1"] },
  { name: "marron", colors: ["#5d4037", "#3e2723", "#8d6e63"] },
  { name: "beige", colors: ["#d7c4a3", "#a8956a", "#e8dcc0"] },
  { name: "nude", colors: ["#e8c4a0", "#c8a280", "#f0d5b8"] },
  { name: "bordeaux", colors: ["#7b1e3a", "#4a0e22", "#a14458"] },
  { name: "bronze", colors: ["#cd7f32", "#8b4513", "#e09b5a"] },
  { name: "argent", colors: ["#c0c0c0", "#888", "#e0e0e0"] },
  { name: "creme", colors: ["#fffdd0", "#e8e0b0", "#fefae0"] },
];

export type Shape =
  | "natural"
  | "almond"
  | "oval"
  | "square"
  | "coffin"
  | "stiletto"
  | "round"
  | "ballerina";

export const SHAPES: Shape[] = [
  "natural", "almond", "oval", "square", "coffin", "stiletto", "round", "ballerina",
];

export const CREATORS: { name: string; tone: string }[] = [
  { name: "Camille Dubois", tone: "#e62e6b" },
  { name: "Léa Moreau", tone: "#b38a4b" },
  { name: "Sofia Chen", tone: "#67618f" },
  { name: "Yuki Tanaka", tone: "#1e88e5" },
  { name: "Aïcha Bensaïd", tone: "#d4af37" },
  { name: "Ines Vargas", tone: "#2d6a4f" },
];

/* ---------- Préfixes et suffixes par style pour générer des noms ---------- */

const NAME_PARTS: Record<CatalogStyle, { prefix: string[]; suffix: string[] }> = {
  minimal: {
    prefix: ["Pure", "Nude", "Linen", "Clarity", "Soft", "Whisper", "Echo", "Silently"],
    suffix: ["Lines", "Dot", "Stroke", "Veil", "Trace", "Form"],
  },
  french: {
    prefix: ["Parisian", "Riviera", "Maison", "Bistrot", "Atelier", "Café", "Bouquet"],
    suffix: ["Tip", "Smile", "Edge", "Curve", "Classic", "Bordeaux"],
  },
  chrome: {
    prefix: ["Liquid", "Mirror", "Mirage", "Liquid", "Solar", "Mercury", "Polaris"],
    suffix: ["Chrome", "Steel", "Reflection", "Powder", "Pulse", "Spectrum"],
  },
  luxury: {
    prefix: ["Maison", "Gilded", "Royal", "Imperial", "Atelier", "Versailles", "Heritage"],
    suffix: ["Gold", "Velvet", "Jewel", "Crown", "Opulence", "Reserve"],
  },
  floral: {
    prefix: ["Botanical", "Spring", "Garden", "Bloom", "Meadow", "Cherry", "Wildflower"],
    suffix: ["Petal", "Bloom", "Stem", "Leaf", "Pollen", "Vine"],
  },
  gothic: {
    prefix: ["Dark", "Velvet", "Raven", "Twilight", "Nocturne", "Shadow", "Phantom"],
    suffix: ["Velvet", "Oxblood", "Spire", "Ritual", "Mourning", "Crypt"],
  },
  kawaii: {
    prefix: ["Sweet", "Marshmallow", "Bubble", "Sugar", "Cloud", "Pixie", "Strawberry"],
    suffix: ["Heart", "Bow", "Cloud", "Sakura", "Bunny", "Charm"],
  },
  y2k: {
    prefix: ["Holographic", "Cyber", "Vapor", "Pop", "Glitter", "Galaxy", "Plasma"],
    suffix: ["Dream", "Beam", "Spark", "Pop", "Flash", "Holo"],
  },
  nature: {
    prefix: ["Mossy", "Forest", "Earth", "Botanical", "River", "Stone", "Cedar"],
    suffix: ["Pebble", "Fern", "Branch", "Bark", "Root", "Moss"],
  },
  wedding: {
    prefix: ["Bridal", "Pearl", "Ivory", "Lace", "Bouquet", "Heirloom", "Veil"],
    suffix: ["Promise", "Aisle", "Pearl", "Glow", "Eternal", "Cherish"],
  },
  art: {
    prefix: ["Gallery", "Studio", "Brushstroke", "Abstract", "Modern", "Canvas", "Composed"],
    suffix: ["Composition", "Stroke", "Form", "Canvas", "Palette", "Sketch"],
  },
  abstract: {
    prefix: ["Geometric", "Cubist", "Modernist", "Block", "Fragment", "Constructed", "Bauhaus"],
    suffix: ["Form", "Block", "Composition", "Plane", "Figure", "Shape"],
  },
  tribal: {
    prefix: ["Saharan", "Tribal", "Ancestral", "Desert", "Aztec", "Maya", "Bohemian"],
    suffix: ["Mark", "Glyph", "Pattern", "Lineage", "Totem", "Sign"],
  },
  celestial: {
    prefix: ["Lunar", "Solar", "Stellar", "Cosmic", "Astral", "Nebula", "Aurora"],
    suffix: ["Constellation", "Glow", "Phase", "Beam", "Sphere", "Halo"],
  },
  tropical: {
    prefix: ["Tropical", "Island", "Bali", "Sunkissed", "Coconut", "Mango", "Hibiscus"],
    suffix: ["Paradise", "Bloom", "Wave", "Shore", "Reef", "Sun"],
  },
  vintage: {
    prefix: ["Vintage", "Retro", "Heritage", "Classic", "Heirloom", "Belle", "Antique"],
    suffix: ["Lace", "Rose", "Memory", "Ink", "Letter", "Frame"],
  },
  geometric: {
    prefix: ["Angular", "Polygon", "Prism", "Lattice", "Matrix", "Vector", "Tessellated"],
    suffix: ["Grid", "Triangle", "Hex", "Line", "Plane", "Frame"],
  },
  ombre: {
    prefix: ["Soft", "Dawn", "Dusk", "Gradient", "Misty", "Flowing", "Fading"],
    suffix: ["Fade", "Drift", "Veil", "Wash", "Blend", "Mist"],
  },
  glitter: {
    prefix: ["Glittering", "Sparkle", "Shimmer", "Twinkling", "Bling", "Stardust", "Confetti"],
    suffix: ["Dazzle", "Glow", "Dust", "Beam", "Wave", "Rain"],
  },
  matte: {
    prefix: ["Matte", "Velvet", "Suede", "Soft", "Cashmere", "Mat", "Stone"],
    suffix: ["Finish", "Touch", "Surface", "Plane", "Sheen", "Mute"],
  },
};

const DESCRIPTION_BY_STYLE: Record<CatalogStyle, string[]> = {
  minimal: [
    "Lignes épurées sur base nude. Le design se voit à peine — et c'est le but.",
    "Negative space assumé, un seul trait fin par ongle. Le moins est le plus.",
    "Sheer nude avec une touche de contraste. Discret, intemporel, portable.",
  ],
  french: [
    "French revisitée : smile line douce, base sheer, finition brillante.",
    "Un classique modernisé : tip plus net, base plus nude, rendu très propre.",
    "French contemporaine. Idéale pour les occasions sobres et élégantes.",
  ],
  chrome: [
    "Effet miroir liquide, finition chrome powder. Audacieux et futuriste.",
    "Chrome sur base noire, reflet argenté changeant selon la lumière.",
    "Finition miroir haute brillance. Pour les looks statement.",
  ],
  luxury: [
    "Or foil sur fond noir profond. Look joaillier, finition glossy.",
    "Détails dorés à la feuille sur base bordeaux. Luxe discret.",
    "Velours et accents métalliques. Pour celles qui veulent briller sans en faire trop.",
  ],
  floral: [
    "Pétales peintes à la main sur base poudrée. Inspiration botanique.",
    "Fleurs délicates aquarellées, rendu doux et romantique.",
    "Motif floral saisonnier, finition satinée.",
  ],
  gothic: [
    "Velours mat bordeaux avec accents noirs. Esthétique sombre et raffinée.",
    "Noir oxblood, finition mate. Pour les âmes romantiques ténébreuses.",
    "Profondeur et mystère, palette nocturne.",
  ],
  kawaii: [
    "Pastel doux avec petits motifs. Adorable et léger.",
    "Détails miniatures sur base rose pâle. Kawaii assumé.",
    "Cute mais pas enfantin : un kawaii mature et bien dosé.",
  ],
  y2k: [
    "Holographique et pop. Hommage aux années 2000 sans tomber dans le kitsch.",
    "Glitter arc-en-ciel sur base cyan. Y2K réinventé.",
    "Couleurs saturées et reflets multiples. Fun et audacieux.",
  ],
  nature: [
    "Inspirations minérales et végétales. Texture brute et authentique.",
    "Palette terre, finition mate. Pour une allure organique.",
    "Bois, mousse, pierre. La nature comme source d'inspiration directe.",
  ],
  wedding: [
    "Manucure de mariée : sheer, lumineuse, délicate. Conçue pour le grand jour.",
    "Base perle iridescente avec accents floraux blancs. Élégance pure.",
    "Finition lumineuse, presque translucide. Idéale mariée et demoiselles d'honneur.",
  ],
  art: [
    "Composition contemporaine, couleurs primaires, coups de pinceaux assumés.",
    "Chaque ongle est un fragment d'œuvre abstraite. Set galerie d'art.",
    "Pigment pur, geste brut. Nail art comme moyen d'expression.",
  ],
  abstract: [
    "Formes géométriques asymétriques, palette primaire. Bauhaus sur ongles.",
    "Composition abstraite construite bloc par bloc.",
    "Pas de symétrie, pas de règle. Beauté par la composition.",
  ],
  tribal: [
    "Motifs tribaux géométriques sur base contrastée. Hommage aux arts ancestraux.",
    "Signes et glyphes inspirés des cultures amérindiennes et africaines.",
    "Lignes affirmées, symbolisme fort. Tribal contemporain.",
  ],
  celestial: [
    "Reflets lunaires, base sombre avec accents étoilés. Cosmique et apaisant.",
    "Aurores boréales capturées sur 10 ongles. Magie céleste.",
    "Phase lunaire, constellation, halo. Set qui fait rêver.",
  ],
  tropical: [
    "Couleurs saturées, inspirations caraïbes. Pour l'été toute l'année.",
    "Fleurs tropicales, bleus lagune, couchers de soleil hawaïens.",
    "Évasion immédiate, finition brillante pour capturer la lumière.",
  ],
  vintage: [
    "Inspiration années 50, dentelle et rose poudré. Charme suranné.",
    "Camée, dentelle, lettres anciennes. Vintage soigné.",
    "Romantisme rétro, finition satinée. Élégance d'un autre temps.",
  ],
  geometric: [
    "Triangles, losanges, lignes droites. Architecture sur les ongles.",
    "Motifs géométriques précis, palette contrastée.",
    "Lignes nettes, formes assumées. Mathématiques appliquées au style.",
  ],
  ombre: [
    "Dégradé doux d'une couleur à l'autre, finition satinée.",
    "Fade maîtrisé : du clair au foncé, en passant par le milieu.",
    "Ombre progressive sur 5 doigts. Effet waouh garanti.",
  ],
  glitter: [
    "Paillettes densément packées, finition miroir scintillant.",
    "Glitter holographic, base nude. Festif mais portable.",
    "Sparkle intense, finition brillante. Pour les grandes occasions.",
  ],
  matte: [
    "Finition mate pure, sans brillance. Look contemporain et audacieux.",
    "Mat sur mat, texture velours. Pour les minimalistes assumés.",
    "Aucune brillance, juste la couleur. Le mat comme statement.",
  ],
};

const FINISH_BY_STYLE: Record<CatalogStyle, "glossy" | "matte" | "satin" | "chrome" | "glitter"> = {
  minimal: "glossy",
  french: "glossy",
  chrome: "chrome",
  luxury: "satin",
  floral: "glossy",
  gothic: "matte",
  kawaii: "glossy",
  y2k: "glitter",
  nature: "matte",
  wedding: "satin",
  art: "satin",
  abstract: "glossy",
  tribal: "matte",
  celestial: "glossy",
  tropical: "glossy",
  vintage: "satin",
  geometric: "satin",
  ombre: "satin",
  glitter: "glitter",
  matte: "matte",
};

const TAGS_BY_STYLE: Record<CatalogStyle, string[]> = {
  minimal: ["minimal", "nude", "negative-space"],
  french: ["french", "classic", "smile-line"],
  chrome: ["chrome", "mirror", "metallic"],
  luxury: ["luxury", "gold", "premium"],
  floral: ["floral", "botanical", "spring"],
  gothic: ["gothic", "dark", "velvet"],
  kawaii: ["kawaii", "cute", "pastel"],
  y2k: ["y2k", "holographic", "glitter"],
  nature: ["nature", "earth", "organic"],
  wedding: ["wedding", "pearl", "bridal"],
  art: ["art", "abstract", "brushstroke"],
  abstract: ["abstract", "geometric", "bauhaus"],
  tribal: ["tribal", "ethnic", "pattern"],
  celestial: ["celestial", "moon", "stars"],
  tropical: ["tropical", "summer", "exotic"],
  vintage: ["vintage", "retro", "lace"],
  geometric: ["geometric", "pattern", "structured"],
  ombre: ["ombre", "gradient", "fade"],
  glitter: ["glitter", "sparkle", "party"],
  matte: ["matte", "velvet", "modern"],
};

const SHAPE_BY_STYLE: Record<CatalogStyle, Shape[]> = {
  minimal: ["almond", "round", "oval", "natural"],
  french: ["almond", "oval", "square"],
  chrome: ["coffin", "ballerina", "square"],
  luxury: ["almond", "coffin", "oval"],
  floral: ["oval", "almond", "round"],
  gothic: ["coffin", "stiletto", "square"],
  kawaii: ["round", "square", "almond"],
  y2k: ["coffin", "ballerina", "square"],
  nature: ["almond", "oval", "natural", "round"],
  wedding: ["oval", "almond", "round"],
  art: ["square", "coffin", "almond"],
  abstract: ["square", "coffin", "ballerina"],
  tribal: ["stiletto", "coffin", "almond"],
  celestial: ["almond", "oval", "coffin"],
  tropical: ["almond", "oval", "round"],
  vintage: ["oval", "almond", "round"],
  geometric: ["square", "coffin", "ballerina"],
  ombre: ["almond", "coffin", "oval"],
  glitter: ["coffin", "ballerina", "almond"],
  matte: ["square", "coffin", "almond"],
};

/* ---------- Génération ---------- */

export type GeneratedItem = {
  id: string;
  name: string;
  creator: string;
  style: CatalogStyle;
  palette: PaletteName;
  shape: Shape;
  price: string;
  orders: number;
  views: number;
  tone: string;
  palette3: [string, string, string];
  description: string;
  tags: string[];
  finish: "glossy" | "matte" | "satin" | "chrome" | "glitter";
  createdAt: string; // ISO date
};

/**
 * Hash déterministe (mulberry32) — même seed = même résultat.
 */
function hash(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

function generateName(style: CatalogStyle, palette: PaletteName, rng: () => number): string {
  const { prefix, suffix } = NAME_PARTS[style];
  const pre = pick(prefix, rng);
  const suf = pick(suffix, rng);
  // 30% du temps on ajoute la couleur dans le nom
  if (rng() < 0.3) {
    const cap = palette.charAt(0).toUpperCase() + palette.slice(1);
    return `${pre} ${cap} ${suf}`;
  }
  return `${pre} ${suf}`;
}

function generatePrice(rng: () => number): string {
  // Prix entre 29,90€ et 79,90€, arrondi à 5
  const buckets = [29.9, 34.9, 39.9, 44.9, 49.9, 54.9, 59.9, 64.9, 69.9, 74.9, 79.9];
  const p = buckets[Math.floor(rng() * buckets.length)]!;
  return `${p.toFixed(2).replace(".", ",")} €`;
}

function generateMetrics(rng: () => number, popularity: number): { orders: number; views: number } {
  // Plus la popularité est haute, plus les chiffres sont gros
  const base = 10 + Math.floor(rng() * 200 * popularity);
  const views = base * (5 + Math.floor(rng() * 10));
  return { orders: base, views };
}

function generateDate(rng: () => number): string {
  // Date entre il y a 6 mois et aujourd'hui
  const now = Date.now();
  const past = now - 1000 * 60 * 60 * 24 * 180;
  const t = past + Math.floor(rng() * (now - past));
  return new Date(t).toISOString();
}

export function generateItem(
  style: CatalogStyle,
  paletteName: PaletteName,
  shape: Shape,
  creator: { name: string; tone: string },
  popularity: number
): GeneratedItem {
  const seed = hash(`${style}|${paletteName}|${shape}|${creator.name}`);
  const rng = mulberry32(seed);

  const paletteEntry = PALETTES.find((p) => p.name === paletteName)!;
  const { orders, views } = generateMetrics(rng, popularity);
  const description = pick(DESCRIPTION_BY_STYLE[style], rng);
  const tags = TAGS_BY_STYLE[style];

  // Pour la stabilité, on encode style + palette + shape dans l'ID
  const id = `${style}-${paletteName}-${shape}-${creator.name.toLowerCase().replace(/\s+/g, "-")}`;

  return {
    id,
    name: generateName(style, paletteName, rng),
    creator: creator.name,
    style,
    palette: paletteName,
    shape,
    price: generatePrice(rng),
    orders,
    views,
    tone: paletteEntry.colors[0],
    palette3: paletteEntry.colors,
    description,
    tags,
    finish: FINISH_BY_STYLE[style],
    createdAt: generateDate(rng),
  };
}

/**
 * Génère le catalogue complet.
 * Limit appliqué pour éviter de faire exploser la mémoire en test.
 */
export function generateCatalog(limit?: number): GeneratedItem[] {
  const items: GeneratedItem[] = [];
  let count = 0;

  for (const style of STYLES) {
    const allowedShapes = SHAPE_BY_STYLE[style];
    for (const paletteEntry of PALETTES) {
      // Limite à 2 formes par (style, palette) pour rester varié sans exploser
      const shapesToUse = allowedShapes.slice(0, 2);
      for (const shape of shapesToUse) {
        // 1-2 créateurs par combinaison
        for (let ci = 0; ci < 2; ci++) {
          const creator = CREATORS[(count + ci) % CREATORS.length]!;
          // Popularité déterministe selon la combinaison
          const popSeed = hash(`${style}|${paletteEntry.name}|${ci}`);
          const popularity = 0.3 + (popSeed % 100) / 150; // 0.3 - 0.97
          items.push(generateItem(style, paletteEntry.name, shape, creator, popularity));
          count++;
          if (limit && items.length >= limit) return items;
        }
      }
    }
  }
  return items;
}

/**
 * Calcule la popularité d'un item (0-1) à partir de ses metrics.
 * Utilisé pour le tri dans la marketplace.
 */
export function popularityOf(item: GeneratedItem): number {
  return Math.log10(item.views + 1) / 5;
}

/* ---------- Recherche et filtres ---------- */

export type FilterOptions = {
  styles?: CatalogStyle[];
  palettes?: PaletteName[];
  shapes?: Shape[];
  creators?: string[];
  finishes?: ("glossy" | "matte" | "satin" | "chrome" | "glitter")[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
};

function priceToNumber(p: string): number {
  return parseFloat(p.replace(",", ".").replace("€", "").trim());
}

export function filterCatalog(
  items: GeneratedItem[],
  filters: FilterOptions
): GeneratedItem[] {
  return items.filter((item) => {
    if (filters.styles?.length && !filters.styles.includes(item.style)) return false;
    if (filters.palettes?.length && !filters.palettes.includes(item.palette)) return false;
    if (filters.shapes?.length && !filters.shapes.includes(item.shape)) return false;
    if (filters.creators?.length && !filters.creators.includes(item.creator)) return false;
    if (filters.finishes?.length && !filters.finishes.includes(item.finish)) return false;
    const price = priceToNumber(item.price);
    if (filters.minPrice !== undefined && price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack = `${item.name} ${item.creator} ${item.style} ${item.palette} ${item.shape} ${item.tags.join(" ")}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function sortCatalog(
  items: GeneratedItem[],
  sort: "populaire" | "recent" | "prix-asc" | "prix-desc" | "alpha"
): GeneratedItem[] {
  const copy = items.slice();
  switch (sort) {
    case "populaire":
      return copy.sort((a, b) => b.views - a.views);
    case "recent":
      return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case "prix-asc":
      return copy.sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price));
    case "prix-desc":
      return copy.sort((a, b) => priceToNumber(b.price) - priceToNumber(a.price));
    case "alpha":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
  }
}
