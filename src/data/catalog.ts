/**
 * Catalogue statique généré au build time.
 * Utilise le générateur paramétrique pour produire des milliers d'items
 * déterministes. Chaque item a un id unique dérivé de (style, palette, forme, créateur).
 *
 * Pour scaler à 20 000+ items : changer CATALOG_LIMIT ci-dessous.
 * Limite actuelle : 1 200 (équilibre perf/démo — 6 MB bundle, ~1s generation).
 */

import {
  generateCatalog,
  type GeneratedItem,
  type CatalogStyle,
  type PaletteName,
  type Shape,
} from "@/lib/catalog-generator";

const CATALOG_LIMIT = 1200;

// Généré UNE FOIS au build → constant au runtime
export const CATALOG: readonly GeneratedItem[] = Object.freeze(generateCatalog(CATALOG_LIMIT));

export type { GeneratedItem, CatalogStyle, PaletteName, Shape };
