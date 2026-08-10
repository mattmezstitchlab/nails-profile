/**
 * Générateur paramétrique du catalogue AIME® — L'ongle que l'on aime.
 *
 * Combine 30+ styles × 25 palettes × 8 formes × 1 studio = jusqu'à
 * 12 000 combinaisons uniques. Chaque item a un nom éditorial, une
 * description, des tags, des métriques réalistes, ET un identifiant
 * de motif visuel pour le rendu CSS.
 *
 * Le catalogue statique final vit dans src/data/catalog.ts.
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
  | "matte"
  | "baroque"
  | "cyberpunk"
  | "deco"
  | "op-art"
  | "streetwear"
  | "ethno"
  | "vaporwave"
  | "nineties"
  | "neo-gothic"
  | "memphis"
  | "monochrome"
  | "mosaic"
  | "watercolor"
  | "sculptural"
  | "futuristic"
  | "asiatique"
  | "botanical"
  | "rustic";

export const STYLES: CatalogStyle[] = [
  // Classiques AIME®
  "minimal", "french", "chrome", "luxury", "floral", "gothic", "kawaii",
  "y2k", "nature", "wedding", "art", "abstract", "tribal", "celestial",
  "tropical", "vintage", "geometric", "ombre", "glitter", "matte",
  // Nouveaux thèmes 2026
  "baroque", "cyberpunk", "deco", "op-art", "streetwear", "ethno",
  "vaporwave", "nineties", "neo-gothic", "memphis", "monochrome",
  "mosaic", "watercolor", "sculptural", "futuristic", "asiatique",
  "botanical", "rustic",
];

export type PatternKind =
  | "solid" // couleur unie
  | "gradient" // dégradé
  | "chevron" // zig-zag
  | "stripes" // rayures
  | "dots" // pois
  | "grid" // grille
  | "checker" // damier
  | "wave" // vagues
  | "diamond" // losanges
  | "tribal" // tribal lines
  | "florals" // fleurs stylisées
  | "starburst" // étoile/soleil
  | "constellation" // points + lignes
  | "marble" // effet marbre
  | "watercolor" // aquarelle tache
  | "halftone" // trame de points
  | "circuit" // circuits électroniques
  | "leopard" // taches
  | "honeycomb" // alvéoles
  | "herringbone" // arêtes de poisson
  | "psychedelic" // vagues psyché
  | "ascii" // grille de motifs
  | "splatter" // éclaboussures
  | "swirl" // tourbillon
  | "french-classic" // French traditionnelle
  | "french-modern" // French smile oblique
  | "french-double" // double ligne
  | "ombre-vertical" // ombre haut/bas
  | "ombre-horizontal" // ombre gauche/droite
  | "ombre-radial" // ombre ronde
  | "glitter-dust" // glitter fin
  | "glitter-chunky" // gros glitter
  | "chrome-mirror" // miroir pur
  | "chrome-holographic" // holo
  | "matte-velvet" // velours mat
  | "negative-space"; // espaces vides

export type PaletteName =
  | "noir" | "blanc" | "rouge" | "rose" | "corail" | "orange" | "jaune"
  | "dore" | "kaki" | "vert" | "menthe" | "turquoise" | "cyan" | "bleu"
  | "marine" | "lavande" | "violet" | "magenta" | "marron" | "beige"
  | "nude" | "bordeaux" | "bronze" | "argent" | "creme";

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
  { name: "argent", colors: ["#c0c0c0", "##888", "#e0e0e0"] },
  { name: "creme", colors: ["#fffdd0", "#e8e0b0", "#fefae0"] },
] as { name: PaletteName; colors: [string, string, string] }[];

export type Shape =
  | "natural" | "almond" | "oval" | "square" | "coffin"
  | "stiletto" | "round" | "ballerina";

export const SHAPES: Shape[] = [
  "natural", "almond", "oval", "square", "coffin", "stiletto", "round", "ballerina",
];

export const STUDIO = { name: "AIME® Studio", tone: "#e62e6b" } as const;

/* ---------- Mapping style → motifs éligibles ---------- */

const PATTERNS_BY_STYLE: Record<CatalogStyle, PatternKind[]> = {
  // Classiques
  minimal: ["solid", "negative-space", "gradient"],
  french: ["french-classic", "french-modern", "french-double"],
  chrome: ["chrome-mirror", "chrome-holographic", "solid"],
  luxury: ["solid", "stripes", "chevron"],
  floral: ["florals", "solid", "watercolor"],
  gothic: ["solid", "stripes", "diamond"],
  kawaii: ["dots", "stripes", "florals", "starburst"],
  y2k: ["chrome-holographic", "starburst", "halftone", "checker"],
  nature: ["florals", "watercolor", "marble"],
  wedding: ["solid", "florals", "gradient"],
  art: ["swirl", "splatter", "stripes", "wave"],
  abstract: ["swirl", "wave", "halftone", "diamond"],
  tribal: ["tribal", "chevron", "diamond", "stripes"],
  celestial: ["constellation", "starburst", "solid", "wave"],
  tropical: ["florals", "wave", "stripes"],
  vintage: ["florals", "stripes", "dots"],
  geometric: ["grid", "diamond", "honeycomb", "checker", "chevron"],
  ombre: ["ombre-vertical", "ombre-horizontal", "ombre-radial"],
  glitter: ["glitter-dust", "glitter-chunky", "solid"],
  matte: ["matte-velvet", "solid"],
  // Nouveaux
  baroque: ["swirl", "florals", "diamond", "stripes"],
  cyberpunk: ["circuit", "grid", "chrome-mirror", "ascii"],
  deco: ["chevron", "diamond", "stripes", "starburst"],
  "op-art": ["wave", "checker", "diamond", "halftone"],
  streetwear: ["halftone", "checker", "stripes", "ascii"],
  ethno: ["tribal", "diamond", "honeycomb", "herringbone"],
  vaporwave: ["gradient", "grid", "halftone", "checker"],
  nineties: ["dots", "stripes", "halftone", "chrome-holographic"],
  "neo-gothic": ["swirl", "diamond", "stripes"],
  memphis: ["dots", "stripes", "diamond", "halftone"],
  monochrome: ["solid", "stripes", "dots", "grid"],
  mosaic: ["honeycomb", "diamond", "grid"],
  watercolor: ["watercolor", "splatter", "wave"],
  sculptural: ["solid", "gradient", "swirl"],
  futuristic: ["circuit", "grid", "chrome-mirror"],
  asiatique: ["florals", "wave", "diamond"],
  botanical: ["florals", "leopard"],
  rustic: ["marble", "herringbone", "solid"],
};

// Wait, "argent" has a typo — let me fix
PALETTES.find((p) => p.name === "argent")!.colors = ["#c0c0c0", "#888888", "#e0e0e0"];

const NAME_PARTS: Record<CatalogStyle, { prefix: string[]; suffix: string[] }> = {
  minimal: { prefix: ["Pure", "Nude", "Linen", "Clarity", "Soft", "Whisper"], suffix: ["Lines", "Veil", "Trace", "Form"] },
  french: { prefix: ["Parisian", "Riviera", "Atelier", "Café", "Bouquet"], suffix: ["Tip", "Smile", "Edge", "Classic"] },
  chrome: { prefix: ["Liquid", "Mirror", "Solar", "Mercury", "Polaris"], suffix: ["Chrome", "Reflection", "Pulse"] },
  luxury: { prefix: ["Maison", "Gilded", "Royal", "Heritage"], suffix: ["Gold", "Velvet", "Crown", "Reserve"] },
  floral: { prefix: ["Botanical", "Spring", "Bloom", "Meadow", "Cherry"], suffix: ["Petal", "Bloom", "Vine"] },
  gothic: { prefix: ["Dark", "Velvet", "Raven", "Nocturne", "Phantom"], suffix: ["Velvet", "Oxblood", "Crypt"] },
  kawaii: { prefix: ["Sweet", "Marshmallow", "Bubble", "Cloud", "Pixie"], suffix: ["Heart", "Bow", "Charm"] },
  y2k: { prefix: ["Holographic", "Cyber", "Vapor", "Galaxy", "Plasma"], suffix: ["Dream", "Beam", "Pop", "Holo"] },
  nature: { prefix: ["Mossy", "Forest", "Earth", "River", "Cedar"], suffix: ["Pebble", "Fern", "Bark", "Moss"] },
  wedding: { prefix: ["Bridal", "Pearl", "Ivory", "Lace", "Veil"], suffix: ["Promise", "Pearl", "Eternal"] },
  art: { prefix: ["Gallery", "Studio", "Modern", "Canvas"], suffix: ["Composition", "Stroke", "Sketch"] },
  abstract: { prefix: ["Geometric", "Cubist", "Modernist", "Bauhaus"], suffix: ["Form", "Block", "Plane"] },
  tribal: { prefix: ["Saharan", "Tribal", "Aztec", "Maya"], suffix: ["Mark", "Glyph", "Pattern", "Totem"] },
  celestial: { prefix: ["Lunar", "Solar", "Stellar", "Cosmic", "Aurora"], suffix: ["Constellation", "Glow", "Halo"] },
  tropical: { prefix: ["Tropical", "Island", "Bali", "Mango", "Hibiscus"], suffix: ["Paradise", "Bloom", "Reef"] },
  vintage: { prefix: ["Vintage", "Retro", "Heritage", "Belle"], suffix: ["Lace", "Rose", "Ink", "Letter"] },
  geometric: { prefix: ["Angular", "Polygon", "Prism", "Lattice", "Tessellated"], suffix: ["Grid", "Triangle", "Frame"] },
  ombre: { prefix: ["Soft", "Dawn", "Dusk", "Misty", "Flowing"], suffix: ["Fade", "Drift", "Wash", "Blend"] },
  glitter: { prefix: ["Glittering", "Sparkle", "Shimmer", "Twinkling"], suffix: ["Dazzle", "Glow", "Beam"] },
  matte: { prefix: ["Matte", "Velvet", "Suede", "Cashmere"], suffix: ["Finish", "Surface", "Plane"] },
  // Nouveaux
  baroque: { prefix: ["Ornate", "Gilded", "Baroque", "Opulent"], suffix: ["Ornament", "Scroll", "Filigree"] },
  cyberpunk: { prefix: ["Neon", "Cyber", "Glitch", "Chrome"], suffix: ["Circuit", "Pulse", "Static"] },
  deco: { prefix: ["Deco", "Geometric", "Streamline"], suffix: ["Fan", "Sunburst", "Arc"] },
  "op-art": { prefix: ["Op", "Optical", "Hypnotic"], suffix: ["Wave", "Illusion", "Drift"] },
  streetwear: { prefix: ["Street", "Urban", "Graffiti"], suffix: ["Tag", "Mark", "Drop"] },
  ethno: { prefix: ["Saharan", "Berber", "Maya", "Inca"], suffix: ["Weave", "Knot", "Tribe"] },
  vaporwave: { prefix: ["Vapor", "Aesthetic", "Neon"], suffix: ["Wave", "Grid", "Glitch"] },
  nineties: { prefix: ["Retro", "90s", "Vintage"], suffix: ["Pop", "Beats", "Rewind"] },
  "neo-gothic": { prefix: ["Neo", "Twilight", "Mourning"], suffix: ["Spire", "Shade", "Wing"] },
  memphis: { prefix: ["Memphis", "Postmodern", "Pop"], suffix: ["Squiggle", "Dot", "Pop"] },
  monochrome: { prefix: ["Mono", "Pure", "Single"], suffix: ["Line", "Block", "Form"] },
  mosaic: { prefix: ["Mosaic", "Tessera", "Tiled"], suffix: ["Tile", "Piece", "Fragment"] },
  watercolor: { prefix: ["Water", "Aquarelle", "Wash"], suffix: ["Bleed", "Stain", "Flow"] },
  sculptural: { prefix: ["Sculpted", "Carved", "Embossed"], suffix: ["Relief", "Form", "Volume"] },
  futuristic: { prefix: ["Future", "Hyper", "Neo"], suffix: ["Drive", "Tech", "Plex"] },
  asiatique: { prefix: ["Sakura", "Zen", "Hanami", "Ukiyo"], suffix: ["Branch", "Petal", "Wave"] },
  botanical: { prefix: ["Verdant", "Botanical", "Wild"], suffix: ["Garden", "Leaf", "Fern"] },
  rustic: { prefix: ["Rustic", "Cabin", "Earthy"], suffix: ["Wood", "Bark", "Stone"] },
};

const DESCRIPTION_BY_STYLE: Record<CatalogStyle, string[]> = {
  minimal: ["Lignes épurées sur base nude. Le design se voit à peine — et c'est le but.", "Negative space assumé, un seul trait fin par ongle.", "Sheer nude avec une touche de contraste."],
  french: ["French revisitée : smile line douce, base sheer, finition brillante.", "Un classique modernisé : tip plus net, base plus nude.", "French contemporaine, sobre et élégante."],
  chrome: ["Effet miroir liquide, finition chrome powder. Audacieux et futuriste.", "Chrome sur base noire, reflet argenté changeant selon la lumière.", "Finition miroir haute brillance."],
  luxury: ["Or foil sur fond noir profond. Look joaillier, finition glossy.", "Détails dorés à la feuille sur base bordeaux.", "Velours et accents métalliques."],
  floral: ["Pétales peintes à la main sur base poudrée.", "Fleurs délicates aquarellées, rendu doux et romantique.", "Motif floral saisonnier, finition satinée."],
  gothic: ["Velours mat bordeaux avec accents noirs.", "Noir oxblood, finition mate.", "Profondeur et mystère, palette nocturne."],
  kawaii: ["Pastel doux avec petits motifs.", "Détails miniatures sur base rose pâle.", "Cute mais pas enfantin."],
  y2k: ["Holographique et pop. Hommage aux années 2000.", "Glitter arc-en-ciel sur base cyan.", "Couleurs saturées et reflets multiples."],
  nature: ["Inspirations minérales et végétales.", "Palette terre, finition mate.", "Bois, mousse, pierre."],
  wedding: ["Manucure de mariée : sheer, lumineuse, délicate.", "Base perle iridescente avec accents floraux blancs.", "Finition lumineuse, presque translucide."],
  art: ["Composition contemporaine, couleurs primaires.", "Chaque ongle est un fragment d'œuvre abstraite.", "Pigment pur, geste brut."],
  abstract: ["Formes géométriques asymétriques, palette primaire.", "Composition abstraite construite bloc par bloc.", "Pas de symétrie, pas de règle."],
  tribal: ["Motifs tribaux géométriques sur base contrastée.", "Signes et glyphes inspirés des cultures ancestrales.", "Lignes affirmées, symbolisme fort."],
  celestial: ["Reflets lunaires, base sombre avec accents étoilés.", "Aurores boréales capturées sur 10 ongles.", "Phase lunaire, constellation, halo."],
  tropical: ["Couleurs saturées, inspirations caraïbes.", "Fleurs tropicales, bleus lagune.", "Évasion immédiate, finition brillante."],
  vintage: ["Inspiration années 50, dentelle et rose poudré.", "Camée, dentelle, lettres anciennes.", "Romantisme rétro, finition satinée."],
  geometric: ["Triangles, losanges, lignes droites.", "Motifs géométriques précis, palette contrastée.", "Lignes nettes, formes assumées."],
  ombre: ["Dégradé doux d'une couleur à l'autre.", "Fade maîtrisé : du clair au foncé.", "Ombre progressive sur 5 doigts."],
  glitter: ["Paillettes densément packées, finition miroir scintillant.", "Glitter holographic, base nude.", "Sparkle intense, finition brillante."],
  matte: ["Finition mate pure, sans brillance.", "Mat sur mat, texture velours.", "Aucune brillance, juste la couleur."],
  // Nouveaux
  baroque: ["Ornements dorés, volutes sculptées, opulence assumée.", "Filigranes baroques sur fond profond, toucher royal.", "Courbes ornementales, dentelles revisitées."],
  cyberpunk: ["Néons glitchés, circuits imprimés, esthétique futuriste underground.", "Chrome liquide et pixels cassés.", "Hacker nails : décodé, fragmenté, électrifié."],
  deco: ["Lignes épurées Art Déco, éventails stylisés, or et noir.", "Géométrie Streamline Moderne des années 30.", "Symétrie radiale, soleil levant en opacité."],
  "op-art": ["Illusions d'optique en noir et blanc, vagues vibrantes.", "Vasarely revisited : cercles hypnotiques.", "Vibrations visuelles qui bougent au regard."],
  streetwear: ["Graffiti abstrait, tags stylisés, couleurs primaires.", "Esthétique urbaine brute, clins d'œil BD.", "Drop culture : éditions limitées en mode nail."],
  ethno: ["Tissages ethniques, motifs berbères, géométrie ancestrale.", "Trames amérindiennes, points touareg.", "Heritage culturel en pattern d'ongle."],
  vaporwave: ["Treillis perspectif, dégradés néon, esthétique A E S T H E T I C.", "Pâle rose et cyan, palmiers pixelisés.", "Nostalgie numérique, glitch chromatique."],
  nineties: ["Bling-bling, couleurs primaires, MTV.", "Boy band meets rave culture.", "CD-ROM, tamagotchis, Macarena : retour 1995."],
  "neo-gothic": ["Crochets modernes, dentelles noires, finition mate.", "Wicca contemporaine, ombres allongées.", "Cathédrale revisitée en version minimal."],
  memphis: ["Squiggles, pois, couleurs primaires 80s.", "Postmodernisme italien, formes ludiques.", "Confetti graphique sur fond pastel."],
  monochrome: ["Une seule couleur déclinée, 10 nuances.", "Total look noir, beige ou marine.", "Minimalisme chromatique assumé."],
  mosaic: ["Carreaux colorés, émaux italiens, pigments variés.", "Tesselles byzantines revisitées.", "Patchwork pigmentaire, joyau de doigts."],
  watercolor: ["Taches aquarellées, pigments dilués, finition soft.", "Lavis colorés qui se répondent.", "Pinceau trempé dans l'eau, pas dans l'ongle."],
  sculptural: ["Effet 3D, relief, matière qui sort du plat.", "Sculpture miniature, geste architectural.", "Texture tactile, ombres et lumières."],
  futuristic: ["Holographie, transparence, lignes de code.", "Y2K du futur : chrome et néon.", "UX de l'ongle, design system de la main."],
  asiatique: ["Sakura en fleur, vagues Hokusai, esthétique zen.", "Minimal japonais, encre noire, papier de riz.", "Hanami sur les ongles : cerisier en fête."],
  botanical: ["Herbier séché, fougères, eucalyptus.", "Jardin d'hiver en motif d'ongle.", "Végétal réel, scellé sous glossy."],
  rustic: ["Bois brut, pierre naturelle, cuir patiné.", "Cabin in the woods, mains de bûcheron.", "Texture organique, finition cire d'abeille."],
};

const FINISH_BY_STYLE: Record<CatalogStyle, "glossy" | "matte" | "satin" | "chrome" | "glitter"> = {
  minimal: "glossy", french: "glossy", chrome: "chrome", luxury: "satin",
  floral: "glossy", gothic: "matte", kawaii: "glossy", y2k: "glitter",
  nature: "matte", wedding: "satin", art: "satin", abstract: "glossy",
  tribal: "matte", celestial: "glossy", tropical: "glossy", vintage: "satin",
  geometric: "satin", ombre: "satin", glitter: "glitter", matte: "matte",
  baroque: "satin", cyberpunk: "chrome", deco: "glossy", "op-art": "glossy",
  streetwear: "matte", ethno: "matte", vaporwave: "glossy", nineties: "glitter",
  "neo-gothic": "matte", memphis: "glossy", monochrome: "matte", mosaic: "satin",
  watercolor: "glossy", sculptural: "matte", futuristic: "chrome",
  asiatique: "satin", botanical: "matte", rustic: "matte",
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
  baroque: ["baroque", "ornate", "gold"],
  cyberpunk: ["cyberpunk", "neon", "glitch"],
  deco: ["deco", "artdeco", "gilded"],
  "op-art": ["op-art", "optical", "illusion"],
  streetwear: ["streetwear", "urban", "graffiti"],
  ethno: ["ethno", "tribal", "weave"],
  vaporwave: ["vaporwave", "neon", "aesthetic"],
  nineties: ["nineties", "retro", "pop"],
  "neo-gothic": ["neo-gothic", "dark", "lace"],
  memphis: ["memphis", "postmodern", "pop"],
  monochrome: ["monochrome", "single-color", "minimal"],
  mosaic: ["mosaic", "tile", "patchwork"],
  watercolor: ["watercolor", "wash", "fluid"],
  sculptural: ["sculptural", "3d", "relief"],
  futuristic: ["futuristic", "neon", "tech"],
  asiatique: ["asiatique", "japan", "zen"],
  botanical: ["botanical", "green", "fresh"],
  rustic: ["rustic", "wood", "earthy"],
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
  baroque: ["almond", "coffin", "oval"],
  cyberpunk: ["coffin", "ballerina", "stiletto"],
  deco: ["square", "almond", "coffin"],
  "op-art": ["square", "coffin", "ballerina"],
  streetwear: ["coffin", "ballerina", "square"],
  ethno: ["almond", "coffin", "oval"],
  vaporwave: ["almond", "coffin", "oval"],
  nineties: ["coffin", "square", "ballerina"],
  "neo-gothic": ["coffin", "stiletto", "almond"],
  memphis: ["square", "coffin", "almond"],
  monochrome: ["almond", "coffin", "square", "oval"],
  mosaic: ["square", "coffin", "almond"],
  watercolor: ["almond", "oval", "round"],
  sculptural: ["coffin", "square", "ballerina"],
  futuristic: ["coffin", "ballerina", "stiletto"],
  asiatique: ["almond", "oval", "round"],
  botanical: ["almond", "oval", "round"],
  rustic: ["almond", "natural", "oval", "round"],
};

/* ---------- Génération ---------- */

export type GeneratedItem = {
  id: string;
  name: string;
  creator: string;
  style: CatalogStyle;
  palette: PaletteName;
  shape: Shape;
  pattern: PatternKind;
  price: string;
  orders: number;
  views: number;
  tone: string;
  palette3: [string, string, string];
  description: string;
  tags: string[];
  finish: "glossy" | "matte" | "satin" | "chrome" | "glitter";
  createdAt: string;
};

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
  if (rng() < 0.3) {
    const cap = palette.charAt(0).toUpperCase() + palette.slice(1);
    return `${pre} ${cap} ${suf}`;
  }
  return `${pre} ${suf}`;
}

function generatePrice(rng: () => number): string {
  const buckets = [29.9, 34.9, 39.9, 44.9, 49.9, 54.9, 59.9, 64.9, 69.9, 74.9, 79.9];
  const p = buckets[Math.floor(rng() * buckets.length)]!;
  return `${p.toFixed(2).replace(".", ",")} €`;
}

function generateMetrics(rng: () => number, popularity: number) {
  const base = 10 + Math.floor(rng() * 200 * popularity);
  const views = base * (5 + Math.floor(rng() * 10));
  return { orders: base, views };
}

function generateDate(rng: () => number): string {
  const now = Date.now();
  const past = now - 1000 * 60 * 60 * 24 * 180;
  const t = past + Math.floor(rng() * (now - past));
  return new Date(t).toISOString();
}

export function generateItem(
  style: CatalogStyle,
  paletteName: PaletteName,
  shape: Shape,
  pattern: PatternKind,
  popularity: number
): GeneratedItem {
  const seed = hash(`${style}|${paletteName}|${shape}|${pattern}`);
  const rng = mulberry32(seed);

  const paletteEntry = PALETTES.find((p) => p.name === paletteName)!;
  const { orders, views } = generateMetrics(rng, popularity);
  const description = pick(DESCRIPTION_BY_STYLE[style], rng);
  const tags = TAGS_BY_STYLE[style];

  const id = `${style}-${paletteName}-${shape}-${pattern}`.replace(/[^a-z0-9-]/gi, "");

  return {
    id,
    name: generateName(style, paletteName, rng),
    creator: STUDIO.name,
    style,
    palette: paletteName,
    shape,
    pattern,
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
 * Pour chaque (style, palette, shape), on pioche 1-2 motifs dans la liste éligible du style.
 * 38 styles × 25 palettes × 2 formes × 1.5 motifs ≈ 2850 combinaisons uniques
 * (avant la limite CATALOG_LIMIT).
 */
export function generateCatalog(limit?: number): GeneratedItem[] {
  const items: GeneratedItem[] = [];

  for (const style of STYLES) {
    const allowedShapes = SHAPE_BY_STYLE[style];
    const allowedPatterns = PATTERNS_BY_STYLE[style];
    // 2 premières formes du style (variété sans explosion)
    const shapesToUse = allowedShapes.slice(0, 2);

    for (const paletteEntry of PALETTES) {
      for (const shape of shapesToUse) {
        // 1 ou 2 motifs par (style, palette, shape) pour rester varié
        const patternsToUse = allowedPatterns.slice(0, 1 + (allowedPatterns.length > 4 ? 1 : 0));
        for (const pattern of patternsToUse) {
          const popSeed = hash(`${style}|${paletteEntry.name}|${shape}|${pattern}`);
          const popularity = 0.3 + (popSeed % 100) / 150;
          items.push(generateItem(style, paletteEntry.name, shape, pattern, popularity));
          if (limit && items.length >= limit) return items;
        }
      }
    }
  }
  return items;
}

/* ---------- Recherche et filtres ---------- */

export type FilterOptions = {
  styles?: CatalogStyle[];
  palettes?: PaletteName[];
  shapes?: Shape[];
  patterns?: PatternKind[];
  finishes?: ("glossy" | "matte" | "satin" | "chrome" | "glitter")[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
};

function priceToNumber(p: string): number {
  return parseFloat(p.replace(",", ".").replace("€", "").trim());
}

export function filterCatalog(items: GeneratedItem[], filters: FilterOptions): GeneratedItem[] {
  return items.filter((item) => {
    if (filters.styles?.length && !filters.styles.includes(item.style)) return false;
    if (filters.palettes?.length && !filters.palettes.includes(item.palette)) return false;
    if (filters.shapes?.length && !filters.shapes.includes(item.shape)) return false;
    if (filters.patterns?.length && !filters.patterns.includes(item.pattern)) return false;
    if (filters.finishes?.length && !filters.finishes.includes(item.finish)) return false;
    const price = priceToNumber(item.price);
    if (filters.minPrice !== undefined && price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack = `${item.name} ${item.style} ${item.palette} ${item.shape} ${item.pattern} ${item.tags.join(" ")}`.toLowerCase();
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
