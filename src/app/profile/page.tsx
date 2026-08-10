"use client";

import AppShell from "@/components/AppShell";
import PageHero, { visualAssets } from "@/components/PageHero";
import {
  User,
  ScanLine,
  ScanFace,
  Settings,
  ChevronRight,
  ShoppingBag,
  Heart,
  Globe,
  Shield,
  Palette,
} from "lucide-react";
import Link from "next/link";

const sections = [
  { label: "Mes mains", icon: ScanLine, href: "/canvas", desc: "Voir mes 10 gabarits" },
  { label: "AIME® 3D", icon: ScanFace, href: "/profile/3d", desc: "Modèle 3D vivant de ton ongle" },
  { label: "Mes designs", icon: Palette, href: "/my-creations", desc: "4 créations" },
  { label: "Mes commandes", icon: ShoppingBag, href: "/orders", desc: "3 commandes" },
  { label: "Mes favoris", icon: Heart, href: "/explore", desc: "3 favoris" },
  { label: "Mes créations publiées", icon: Globe, href: "/creator", desc: "Créateur" },
  { label: "AIME®", icon: Shield, href: "/scan/profile", desc: "Paramètres du profil" },
];

export default function ProfilePage() {
  return (
    <AppShell>
      <PageHero
        eyebrow="PROFILE / 01"
        title="Ton profil de beauté numérique."
        description="Un espace personnel qui connaît tes mains, tes goûts, tes créations et les sets qui te ressemblent."
        image={visualAssets.editorialHands}
        imageAlt="Mains manucurées avec bijoux et nail art éditorial"
        label="Camille Dubois"
        meta="AIME® actif"
        compact
      />
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-rose flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Camille Dubois</h1>
          <p className="text-sm text-ink-light/40 mt-1">camille@nailprofile.com</p>
        </div>

        {/* AIME® Status */}
        <div className="rounded-2xl bg-rose-light/5 border border-rose-light/20 p-5 mb-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-light/10 flex items-center justify-center flex-shrink-0">
            <ScanFace className="w-5 h-5 text-rose" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-ink">Ton AIME® est actif</p>
            <p className="text-sm text-ink-light/40 mt-0.5">
              Tes 10 gabarits sont prêts pour toutes tes futures créations.
            </p>
            <Link href="/scan/profile" className="text-sm text-rose font-medium mt-2 inline-block hover:underline">
              Voir mon profil →
            </Link>
          </div>
        </div>

        {/* Sections */}
        <div className="rounded-3xl bg-white border border-soft-gray/50 overflow-hidden mb-8">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.label}
                href={section.href}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-soft-gray/30 transition-colors ${
                  i < sections.length - 1 ? "border-b border-soft-gray/30" : ""
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-soft-gray/50 flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-ink-light/60" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{section.label}</p>
                  <p className="text-xs text-ink-light/40">{section.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-ink-light/20" />
              </Link>
            );
          })}
        </div>

        {/* Settings */}
        <Link
          href="#"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-soft-gray/80 rounded-2xl text-sm font-medium text-ink-light/60 hover:border-ink/15 transition-all"
        >
          <Settings className="w-4 h-4" />
          Paramètres
        </Link>
      </div>
    </AppShell>
  );
}
