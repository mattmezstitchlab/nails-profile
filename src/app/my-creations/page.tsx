"use client";

import AppShell from "@/components/AppShell";
import PageHero, { visualAssets } from "@/components/PageHero";
import { ScanLine, ArrowRight, Clock, Copy, ShoppingBag, Eye, Globe, Lock } from "lucide-react";
import Link from "next/link";

const myDesigns = [
  {
    id: "1",
    name: "Sunset Ocean",
    date: "9 août 2026",
    tone: "#a7475c",
    visibility: "public",
    orders: 89,
    views: 1240,
  },
  {
    id: "2",
    name: "Wedding Pearl",
    date: "14 août 2026",
    tone: "#e4c9c3",
    visibility: "public",
    orders: 56,
    views: 890,
  },
  {
    id: "3",
    name: "Chrome Noir",
    date: "18 août 2026",
    tone: "#242424",
    visibility: "private",
    orders: 0,
    views: 0,
  },
  {
    id: "4",
    name: "Cherry Blossom",
    date: "22 août 2026",
    tone: "#e5a8b9",
    visibility: "public",
    orders: 42,
    views: 760,
  },
];

export default function MyCreationsPage() {
  return (
    <AppShell>
      <PageHero
        eyebrow="LIBRARY / 01"
        title="Tout ce que tu as imaginé."
        description="Retrouve tes sets, duplique-les, ajuste-les ou publie-les. Ton historique créatif reste toujours à portée de main."
        image={visualAssets.blueNails}
        imageAlt="Manucure bleue graphique sur une main"
        label="Ta galerie personnelle"
        meta="Réutilisable à tout moment"
        compact
      />
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-rose font-semibold uppercase tracking-widest">Mes créations</p>
            <h1 className="text-2xl font-bold text-ink">Galerie personnelle</h1>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-2 px-4 py-2.5 bg-rose text-white rounded-xl text-sm font-semibold hover:bg-rose-dark transition-all shadow-md shadow-rose/15"
          >
            <ScanLine className="w-4 h-4" />
            Nouveau design
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {myDesigns.map((design) => (
            <div
              key={design.id}
              className="rounded-3xl bg-white border border-soft-gray/50 overflow-hidden group hover:shadow-lg transition-all"
            >
              <div className="aspect-[4/3] relative" style={{ background: design.tone }}>
                <div className="absolute top-3 right-3">
                  {design.visibility === "public" ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur text-xs text-ink">
                      <Globe className="w-3 h-3" /> Public
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur text-xs text-ink">
                      <Lock className="w-3 h-3" /> Privé
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{design.name}</h3>
                    <p className="text-xs text-ink-light/40 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {design.date}
                    </p>
                  </div>
                </div>
                {design.visibility === "public" && (
                  <div className="flex gap-4 text-xs text-ink-light/40 mb-3">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {design.views}</span>
                    <span className="flex items-center gap-1"><ShoppingBag className="w-3 h-3" /> {design.orders}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <Link
                    href={`/create/result`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-soft-gray/50 rounded-xl text-xs font-medium hover:bg-soft-gray transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Voir
                  </Link>
                  <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-soft-gray/50 rounded-xl text-xs font-medium hover:bg-soft-gray transition-colors">
                    <Copy className="w-3.5 h-3.5" />
                    Dupliquer
                  </button>
                  {design.visibility === "private" && (
                    <Link
                      href="/create/publish"
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-rose text-white rounded-xl text-xs font-medium hover:bg-rose-dark transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Publier
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
