"use client";

import AppShell from "@/components/AppShell";
import PageHero, { visualAssets } from "@/components/PageHero";
import { Eye, ShoppingBag, ScanLine, TrendingUp, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Créations", value: "12", icon: ScanLine, change: "+3 ce mois" },
  { label: "Vues", value: "5 420", icon: Eye, change: "+24%" },
  { label: "Commandes", value: "267", icon: ShoppingBag, change: "+18%" },
  { label: "Revenus", value: "12 340 €", icon: DollarSign, change: "+32%" },
];

const topDesigns = [
  { name: "Sunset Ocean", orders: 89, revenue: "4 441 €", tone: "#a7475c" },
  { name: "Gothic Velvet", orders: 78, revenue: "4 126 €", tone: "#3d2139" },
  { name: "Cherry Blossom", orders: 42, revenue: "1 885 €", tone: "#e5a8b9" },
];

export default function CreatorPage() {
  return (
    <AppShell>
      <PageHero
        eyebrow="CREATOR / 01"
        title="Ton goût peut devenir une collection."
        description="Publie tes univers, observe ce qui plaît et transforme tes créations en designs que la communauté peut porter."
        image={visualAssets.jewelryHands}
        imageAlt="Deux mains élégantes ornées de bijoux"
        label="Espace créateur"
        meta="Vues, essais, commandes"
        compact
      />
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs text-rose font-semibold uppercase tracking-widest">Créateur</p>
          <h1 className="text-2xl font-bold text-ink">Tableau de bord</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-2xl bg-white border border-soft-gray/50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-light/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-rose" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-ink">{stat.value}</p>
                <p className="text-xs text-ink-light/40 mt-0.5">{stat.label}</p>
                <p className="text-[10px] text-green-500 mt-1">{stat.change}</p>
              </div>
            );
          })}
        </div>

        {/* Top Designs */}
        <div className="rounded-3xl bg-white border border-soft-gray/50 p-6 mb-8">
          <h3 className="font-semibold mb-4">Top créations</h3>
          <div className="space-y-3">
            {topDesigns.map((design, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-soft-gray/20 hover:bg-soft-gray/40 transition-colors">
                <span className="text-sm font-bold text-ink-light/30 w-6">#{i + 1}</span>
                <div
                  className="w-10 h-12 rounded-lg flex-shrink-0"
                  style={{ background: design.tone }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{design.name}</p>
                  <p className="text-xs text-ink-light/40">{design.orders} commandes</p>
                </div>
                <p className="font-semibold text-sm">{design.revenue}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Publish CTA */}
        <Link
          href="/create"
          className="block rounded-3xl bg-ink p-8 text-center text-white hover:bg-ink-light transition-colors"
        >
          <ScanLine className="w-8 h-8 mx-auto mb-3 text-rose-light" />
          <h3 className="text-xl font-bold mb-1">Publier une nouvelle création</h3>
          <p className="text-sm text-white/50">
            Crée un nouveau design et rends-le disponible dans le marketplace
          </p>
        </Link>
      </div>
    </AppShell>
  );
}
