"use client";

import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import PageHero, { visualAssets } from "@/components/PageHero";
import {
  Heart,
  Eye,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  ScanLine,
  Gem,
  Minus,
  Orbit,
  PenTool,
  PanelsTopLeft,
  Leaf,
  Moon,
  Radio,
  CalendarDays,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  ALL_ITEMS,
  FEATURED_ITEMS,
  getAllCreators,
  type MarketplaceItem,
} from "@/lib/marketplace";
import {
  filterCatalog,
  sortCatalog,
  STYLES,
  PALETTES,
  SHAPES,
  type CatalogStyle,
  type PaletteName,
  type Shape,
} from "@/lib/catalog-generator";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 36;

const COLLECTION_TAGS: Record<string, string[]> = {
  Tendances: [],
  Mariage: ["wedding"],
  Minimal: ["minimal"],
  Chrome: ["chrome"],
  Art: ["art"],
  Festival: ["glitter", "y2k"],
  Nature: ["nature"],
  Gothic: ["gothic"],
  Y2K: ["y2k"],
  Saisons: ["tropical", "celestial"],
};

const COLLECTIONS: { name: string; icon: typeof TrendingUp }[] = [
  { name: "Tendances", icon: TrendingUp },
  { name: "Mariage", icon: Gem },
  { name: "Minimal", icon: Minus },
  { name: "Chrome", icon: Orbit },
  { name: "Art", icon: PenTool },
  { name: "Festival", icon: Radio },
  { name: "Nature", icon: Leaf },
  { name: "Gothic", icon: Moon },
  { name: "Y2K", icon: PanelsTopLeft },
  { name: "Saisons", icon: CalendarDays },
];

const FINISHES = ["glossy", "matte", "satin", "chrome", "glitter"] as const;

export default function ExplorePage() {
  const [activeCollection, setActiveCollection] = useState("Tendances");
  const [sortBy, setSortBy] = useState<"populaire" | "recent" | "prix-asc" | "prix-desc" | "alpha">("populaire");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Filtres avancés
  const [styleFilter, setStyleFilter] = useState<CatalogStyle | null>(null);
  const [paletteFilter, setPaletteFilter] = useState<PaletteName | null>(null);
  const [shapeFilter, setShapeFilter] = useState<Shape | null>(null);
  const [creatorFilter, setCreatorFilter] = useState<string | null>(null);
  const [finishFilter, setFinishFilter] = useState<typeof FINISHES[number] | null>(null);

  const allCreators = useMemo(() => getAllCreators(), []);

  const filtered = useMemo(() => {
    let items: MarketplaceItem[] = ALL_ITEMS;

    // Filtre par collection (équivalent à un tag preset)
    if (activeCollection !== "Tendances") {
      const tags = COLLECTION_TAGS[activeCollection] ?? [];
      if (tags.length > 0) {
        items = items.filter((i) => tags.includes(i.style as string));
      }
    }

    // Filtres avancés
    items = filterCatalog(items, {
      styles: styleFilter ? [styleFilter] : undefined,
      palettes: paletteFilter ? [paletteFilter] : undefined,
      shapes: shapeFilter ? [shapeFilter] : undefined,
      creators: creatorFilter ? [creatorFilter] : undefined,
      finishes: finishFilter ? [finishFilter] : undefined,
      search: search.trim() || undefined,
    });

    return sortCatalog(items, sortBy);
  }, [activeCollection, sortBy, search, styleFilter, paletteFilter, shapeFilter, creatorFilter, finishFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const clearFilters = () => {
    setStyleFilter(null);
    setPaletteFilter(null);
    setShapeFilter(null);
    setCreatorFilter(null);
    setFinishFilter(null);
    setSearch("");
    setActiveCollection("Tendances");
    setPage(1);
  };

  const hasActiveFilters = styleFilter || paletteFilter || shapeFilter || creatorFilter || finishFilter || search;

  return (
    <AppShell>
      <PageHero
        eyebrow={`EXPLORE / ${ALL_ITEMS.length.toLocaleString("fr-FR")} designs`}
        title="Des créations qui peuvent devenir les tiennes."
        description="Découvre des sets imaginés par la communauté, puis essaie-les directement sur tes mains et ton format."
        image={visualAssets.blackNails}
        imageAlt="Manucure noire éditoriale en gros plan"
        label="Marketplace paramétrique"
        meta="Des designs adaptables"
      />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header + search */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs text-rose font-semibold uppercase tracking-widest">Marketplace</p>
            <h1 className="text-2xl font-bold text-ink">Explorer les créations</h1>
            <p className="text-sm text-ink-light/40 mt-1">
              {filtered.length.toLocaleString("fr-FR")} designs disponibles
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="ml-2 inline-flex items-center gap-1 text-rose hover:underline"
                >
                  <X className="w-3 h-3" />
                  Réinitialiser les filtres
                </button>
              )}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-light/30" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Chercher un design, un créateur, un style…"
              className="w-full pl-10 pr-3 py-2.5 rounded-full border border-soft-gray/80 bg-white text-sm placeholder:text-ink-light/30 focus:outline-none focus:border-rose/30 focus:ring-4 focus:ring-rose/5"
            />
          </div>
        </div>

        {/* Collections */}
        <div className="mb-4 -mx-1 flex flex-wrap items-center gap-2 px-1">
          {COLLECTIONS.map((col) => (
            <button
              key={col.name}
              onClick={() => {
                setActiveCollection(col.name);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCollection === col.name
                  ? "bg-rose text-white shadow-md shadow-rose/15"
                  : "bg-white border border-soft-gray/80 text-ink-light/60 hover:border-ink/15"
              }`}
            >
              <col.icon className="h-3.5 w-3.5" />
              {col.name}
            </button>
          ))}
        </div>

        {/* Advanced filters + sort */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <FilterSelect
            label="Style"
            value={styleFilter}
            options={STYLES.map((s) => ({ value: s, label: s }))}
            onChange={(v) => { setStyleFilter(v as CatalogStyle | null); setPage(1); }}
          />
          <FilterSelect
            label="Couleur"
            value={paletteFilter}
            options={PALETTES.map((p) => ({ value: p.name, label: p.name }))}
            onChange={(v) => { setPaletteFilter(v as PaletteName | null); setPage(1); }}
            renderOption={(opt) => {
              const palette = PALETTES.find((p) => p.name === opt.value);
              return (
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full border border-ink/10"
                    style={{ background: palette?.colors[0] }}
                  />
                  {opt.label}
                </span>
              );
            }}
          />
          <FilterSelect
            label="Forme"
            value={shapeFilter}
            options={SHAPES.map((s) => ({ value: s, label: s }))}
            onChange={(v) => { setShapeFilter(v as Shape | null); setPage(1); }}
          />
          <FilterSelect
            label="Créateur"
            value={creatorFilter}
            options={allCreators.map((c) => ({ value: c, label: c }))}
            onChange={(v) => { setCreatorFilter(v); setPage(1); }}
          />
          <FilterSelect
            label="Finition"
            value={finishFilter}
            options={FINISHES.map((f) => ({ value: f, label: f }))}
            onChange={(v) => { setFinishFilter(v as typeof FINISHES[number] | null); setPage(1); }}
          />

          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="sort-by" className="text-xs font-medium text-ink-light/50">
              Trier par
            </label>
            <div className="relative">
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as typeof sortBy);
                  setPage(1);
                }}
                className="appearance-none rounded-full border border-soft-gray/80 bg-white py-2 pl-4 pr-9 text-sm font-medium text-ink focus:border-rose focus:outline-none"
              >
                <option value="populaire">Les plus populaires</option>
                <option value="recent">Récents</option>
                <option value="alpha">Alphabétique</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light/40" />
            </div>
          </div>
        </div>

        {/* Featured (uniquement page 1, sans filtres) */}
        {safePage === 1 && !hasActiveFilters && activeCollection === "Tendances" && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-ink-light/50 uppercase tracking-wider mb-3">
              En vedette cette semaine
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURED_ITEMS.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
            <div className="my-10 flex items-center gap-4 text-xs text-ink-light/30 uppercase tracking-widest">
              <div className="flex-1 h-px bg-soft-gray/60" />
              <span>Catalogue complet · {(ALL_ITEMS.length - FEATURED_ITEMS.length).toLocaleString("fr-FR")} designs</span>
              <div className="flex-1 h-px bg-soft-gray/60" />
            </div>
          </section>
        )}

        {/* Grid */}
        {pageItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-4">
            {pageItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-soft-gray bg-white px-6 py-14 text-center mb-8">
            <PanelsTopLeft className="w-8 h-8 text-rose mx-auto mb-3" />
            <p className="font-medium text-ink">Aucun design ne correspond à vos critères.</p>
            <p className="text-sm text-ink-light/40 mt-1">Essayez d'élargir vos filtres ou créez le vôtre.</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 bg-ink text-white rounded-xl text-sm font-medium"
            >
              Réinitialiser
            </button>
          </div>
        )}

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={(p) => {
            setPage(p);
            if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />

        {/* Trending creators */}
        <div className="rounded-3xl bg-white border border-soft-gray/50 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Créateurs en vue</h3>
            <TrendingUp className="w-4 h-4 text-rose" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {allCreators.slice(0, 6).map((name) => {
              const item = ALL_ITEMS.find((i) => i.creator === name);
              const count = ALL_ITEMS.filter((i) => i.creator === name).length;
              return (
                <button
                  key={name}
                  onClick={() => {
                    setCreatorFilter(name);
                    setPage(1);
                  }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-soft-gray/30 min-w-[200px] hover:bg-soft-gray/50 transition-colors text-left"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                    style={{ background: item?.tone ?? "#888" }}
                  >
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{name}</p>
                    <p className="text-xs text-ink-light/40">{count} créations</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Become a creator CTA */}
        <Link
          href="/create"
          className="block rounded-3xl bg-ink p-8 text-center text-white hover:bg-ink-light transition-colors"
        >
          <ScanLine className="w-8 h-8 mx-auto mb-3 text-rose-light" />
          <h3 className="text-xl font-bold mb-1">Crée et publie tes designs</h3>
          <p className="text-sm text-white/50 mb-4">
            Deviens créateur·rice et partage tes créations avec la communauté
          </p>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-ink rounded-xl text-sm font-semibold hover:bg-ivory transition-colors">
            Publier une création
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </AppShell>
  );
}

type FilterSelectProps<T extends string> = {
  label: string;
  value: T | null;
  options: { value: T; label: string }[];
  onChange: (v: T | null) => void;
  renderOption?: (opt: { value: T; label: string }) => React.ReactNode;
};

function FilterSelect<T extends string>({ label, value, options, onChange, renderOption }: FilterSelectProps<T>) {
  return (
    <div className="relative">
      <select
        value={value ?? ""}
        onChange={(e) => onChange((e.target.value || null) as T | null)}
        className={`appearance-none rounded-full border bg-white py-2 pl-3 pr-7 text-xs font-medium transition-colors cursor-pointer ${
          value
            ? "border-rose text-rose"
            : "border-soft-gray/80 text-ink-light/60 hover:border-ink/15"
        }`}
        aria-label={label}
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-ink-light/40" />
    </div>
  );
}

function ItemCard({ item }: { item: MarketplaceItem }) {
  return (
    <Link
      href={`/explore/${item.id}`}
      className="group rounded-3xl bg-white border border-soft-gray/50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div
        className="aspect-[4/3] relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${item.palette3[0]} 0%, ${item.palette3[1]} 50%, ${item.palette3[2]} 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-0.5 rounded-full bg-white/85 backdrop-blur text-[10px] font-semibold uppercase tracking-wider text-ink">
            {item.style}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
            aria-label="Ajouter aux favoris"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="w-3.5 h-3.5 text-ink-light" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-white/85 backdrop-blur text-xs font-medium text-ink">
            {item.price}
          </span>
          <div className="flex items-center gap-3 text-white/95 text-xs">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" /> {item.views > 1000 ? `${(item.views / 1000).toFixed(1)}k` : item.views}
            </span>
            <span className="flex items-center gap-1">
              <ShoppingBag className="w-3 h-3" /> {item.orders}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-ink mb-1 group-hover:text-rose transition-colors line-clamp-1">
          {item.name}
        </h3>
        <p className="text-xs text-ink-light/40">par {item.creator}</p>
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-soft-gray/50 text-[10px] text-ink-light/40"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
