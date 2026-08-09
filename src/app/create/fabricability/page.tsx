"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import PageHero, { visualAssets } from "@/components/PageHero";
import {
  ChevronLeft,
  ArrowRight,
  Check,
  AlertTriangle,
  SlidersHorizontal,
  ShoppingBag,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";

const checks = [
  { label: "Couleurs compatibles", status: "pass", detail: "Toutes les couleurs sont reproductibles" },
  { label: "Dimensions compatibles", status: "pass", detail: "Les 10 gabarits respectent les contraintes de fabrication" },
  { label: "Motifs suffisamment détaillés", status: "pass", detail: "Niveau de détail optimal" },
  { label: "Gabarits corrects", status: "pass", detail: "Tous les contours sont valides" },
  { label: "Auriculaire droit — détails", status: "warn", detail: "Le motif de ton auriculaire droit contient trop de détails fins pour une reproduction parfaite." },
];

export default function FabricabilityPage() {
  const router = useRouter();
  const [optimized, setOptimized] = useState(false);

  const handleOptimize = () => {
    setOptimized(true);
  };

  return (
    <AppShell>
      <PageHero
        eyebrow="BUILD / 01"
        title="Prêt à être fabriqué."
        description="Avant de commander, nous vérifions que le design peut devenir un vrai set : couleurs, détails, dimensions et gabarits."
        image={visualAssets.jewelryHands}
        imageAlt="Mains avec bijoux et manucure sophistiquée"
        label="Vérification fabrication"
        meta="Un contrôle avant production"
        compact
      />
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/try-on" className="p-2 hover:bg-soft-gray rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-xs text-rose font-semibold uppercase tracking-widest">Vérification</p>
            <h1 className="text-2xl font-bold text-ink">Fabricability Check</h1>
          </div>
        </div>

        {/* Score */}
        <div className="rounded-3xl bg-white border border-soft-gray/50 p-8 text-center mb-6">
          <div className="relative w-28 h-28 mx-auto mb-4">
            <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#f0ece6" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={optimized ? "#22c55e" : "#e91e63"}
                strokeWidth="8"
                strokeDasharray={`${optimized ? 98 : 92} ${100 - (optimized ? 98 : 92)}`}
                strokeLinecap="round"
                strokeDashoffset="25"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${optimized ? "text-green-500" : "text-rose"}`}>
                {optimized ? "98" : "92"}%
              </span>
            </div>
          </div>
          <p className="text-lg font-semibold mb-1">
            {optimized ? "Design optimisé" : "FABRICABILITÉ"}
          </p>
          <p className="text-sm text-ink-light/40">
            {optimized
              ? "Ton set est prêt pour la production."
              : "Presque parfait — un petit ajustement recommandé."}
          </p>
        </div>

        {/* Checks */}
        <div className="rounded-3xl bg-white border border-soft-gray/50 p-6 mb-6">
          <h3 className="font-semibold mb-4">Analyse détaillée</h3>
          <div className="space-y-3">
            {checks.map((check, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                  check.status === "warn" && !optimized
                    ? "bg-amber-50 border border-amber-100"
                    : "bg-soft-gray/30"
                }`}
              >
                {check.status === "pass" || optimized ? (
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium text-ink">{check.label}</p>
                  <p className="text-xs text-ink-light/40">{check.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimize button */}
        {!optimized && (
          <button
            onClick={handleOptimize}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-rose text-white rounded-2xl text-base font-semibold hover:bg-rose-dark transition-all shadow-lg shadow-rose/15 mb-3"
          >
            <Zap className="w-5 h-5" />
            Optimiser automatiquement
          </button>
        )}

        {/* Continue */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/checkout")}
            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-lg font-semibold transition-all ${
              optimized
                ? "bg-ink text-white hover:bg-ink-light shadow-lg shadow-ink/10"
                : "bg-ink/5 text-ink-light/30 cursor-not-allowed"
            }`}
            disabled={!optimized}
          >
            <ShoppingBag className="w-5 h-5" />
            {optimized ? "Commander mon set" : "Optimise d'abord pour commander"}
          </button>
          {optimized && (
            <button
              onClick={() => router.push("/create/publish")}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white border border-soft-gray/80 rounded-2xl text-base font-medium hover:border-ink/15 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Publier dans le Marketplace
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
