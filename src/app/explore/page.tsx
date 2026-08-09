"use client";

import { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";

const marketplaceItems = [
  { id: "set1", name: "Sunset Ocean", creator: "Camille Dubois", style: "Luxury", price: "49,90 €", orders: 89, views: 1240, tone: "#a7475c", image: visualAssets.editorialHands, tags: ["luxury", "ocean", "sunset"] },
  { id: "set2", name: "Wedding Pearl", creator: "Léa Moreau", style: "Wedding", price: "59,90 €", orders: 56, views: 890, tone: "#e4c9c3", image: visualAssets.weddingHands, tags: ["wedding", "pearl", "romantic"] },
  { id: "set3", name: "Chrome Noir", creator: "Sofia Chen", style: "Chrome", price: "54,90 €", orders: 134, views: 2100, tone: "#242424", image: visualAssets.blackNails, tags: ["chrome", "minimal", "black"] },
  { id: "set4", name: "Cherry Blossom", creator: "Camille Dubois", style: "Floral", price: "44,90 €", orders: 42, views: 760, tone: "#e5a8b9", image: visualAssets.artHands, tags: ["floral", "spring", "pink"] },
  { id: "set5", name: "Gothic Velvet", creator: "Camille Dubois", style: "Gothic", price: "52,90 €", orders: 78, views: 1450, tone: "#3d2139", image: visualAssets.blackNails, tags: ["gothic", "velvet", "dark"] },
  { id: "set6", name: "Y2K Pop", creator: "Sofia Chen", style: "Y2K", price: "39,90 €", orders: 210, views: 3200, tone: "#6fc2c7", image: visualAssets.blueNails, tags: ["y2k", "pop", "holographic"] },
];

const collections = [
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

export default function ExplorePage() {
  const [activeCollection, setActiveCollection] = useState("Tendances");
  const collectionTags: Record<string, string[]> = {
    Mariage: ["wedding"],
    Minimal: ["minimal"],
    Chrome: ["chrome"],
    Art: ["art"],
    Festival: ["festival", "y2k"],
    Nature: ["nature"],
    Gothic: ["gothic"],
    Y2K: ["y2k"],
    Saisons: ["spring", "autumn", "summer"],
  };
  const visibleItems =
    activeCollection === "Tendances"
      ? marketplaceItems
      : marketplaceItems.filter((item) =>
          collectionTags[activeCollection]?.some((tag) => item.tags.includes(tag))
        );

  return (
    <AppShell>
      <PageHero
        eyebrow="EXPLORE / 01"
        title="Des créations qui peuvent devenir les tiennes."
        description="Découvre des sets imaginés par la communauté, puis essaie-les directement sur tes mains et ton format."
        image={visualAssets.blackNails}
        imageAlt="Manucure noire éditoriale en gros plan"
        label="Marketplace paramétrique"
        meta="Des designs adaptables"
      />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs text-rose font-semibold uppercase tracking-widest">Marketplace</p>
          <h1 className="text-2xl font-bold text-ink">Explorer les créations</h1>
        </div>

        {/* Collections scroll */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 -mx-6 px-6 scrollbar-none">
          {collections.map((col) => (
            <button
              key={col.name}
              onClick={() => setActiveCollection(col.name)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeCollection === col.name
                  ? "bg-rose text-white shadow-md shadow-rose/15"
                  : "bg-white border border-soft-gray/80 text-ink-light/60 hover:border-ink/15"
              }`}
            >
              <col.icon className="w-3.5 h-3.5" />
              {col.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {visibleItems.map((item) => (
            <Link
              key={item.id}
              href={`/explore/${item.id}`}
              className="group rounded-3xl bg-white border border-soft-gray/50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Design Preview */}
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={item.image}
                  alt={`${item.name}, création portée sur des mains`}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <button className="w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors">
                    <Heart className="w-3.5 h-3.5 text-ink-light" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-white/80 backdrop-blur text-xs font-medium text-ink">
                    {item.price}
                  </span>
                  <div className="flex items-center gap-3 text-white/90 text-xs">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {item.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" /> {item.orders}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-ink mb-1 group-hover:text-rose transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-ink-light/40">par {item.creator}</p>
                <div className="flex gap-1.5 mt-3">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-soft-gray/50 text-[10px] text-ink-light/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
        {visibleItems.length === 0 && (
          <div className="rounded-3xl border border-dashed border-soft-gray bg-white px-6 py-14 text-center mb-8">
            <PanelsTopLeft className="w-8 h-8 text-rose mx-auto mb-3" />
            <p className="font-medium text-ink">Cette collection se construit encore.</p>
            <p className="text-sm text-ink-light/40 mt-1">Crée le premier design de cette catégorie.</p>
            <Link href="/create" className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 bg-ink text-white rounded-xl text-sm font-medium">
              Créer un design
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Trending creators */}
        <div className="rounded-3xl bg-white border border-soft-gray/50 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Créateurs en vue</h3>
            <TrendingUp className="w-4 h-4 text-rose" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {[
              { name: "Camille D.", sets: 12, tone: "#e62e6b" },
              { name: "Sofia C.", sets: 8, tone: "#67618f" },
              { name: "Léa M.", sets: 5, tone: "#b38a4b" },
            ].map((creator) => (
              <div
                key={creator.name}
                className="flex items-center gap-3 p-3 rounded-2xl bg-soft-gray/30 min-w-[180px]"
              >
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0"
                  style={{ background: creator.tone }}
                />
                <div>
                  <p className="text-sm font-medium">{creator.name}</p>
                  <p className="text-xs text-ink-light/40">{creator.sets} créations</p>
                </div>
              </div>
            ))}
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
