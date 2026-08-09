"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import PageHero, { visualAssets } from "@/components/PageHero";
import {
  ArrowRight,
  ScanLine,
  RefreshCw,
  Eye,
  ShoppingBag,
  ChevronLeft,
  Check,
  Globe,
  Lock,
  Users,
  Wand2,
} from "lucide-react";
import Link from "next/link";

const leftFingers = ["Pouce G", "Index G", "Majeur G", "Annulaire G", "Auriculaire G"];
const rightFingers = ["Pouce D", "Index D", "Majeur D", "Annulaire D", "Auriculaire D"];

// Flat editorial tones for each nail design
const designTones = [
  "#171717",
  "#22304a",
  "#8e2948",
  "#354d69",
  "#c4545f",
  "#252b38",
  "#59647b",
  "#a94457",
  "#c18c4c",
  "#303d55",
];

export default function DesignResultPage() {
  const router = useRouter();
  const [regenerating, setRegenerating] = useState<number | null>(null);

  const handleRegenerate = (index: number) => {
    setRegenerating(index);
    setTimeout(() => setRegenerating(null), 1500);
  };

  return (
    <AppShell>
      <PageHero
        eyebrow="CREATE / 02"
        title="Un set pensé pour toi."
        description="Dix designs indépendants, une seule direction artistique. Chaque pièce est adaptée à la largeur, la longueur et la forme de ton ongle."
        image={visualAssets.editorialHands}
        imageAlt="Mains manucurées avec création de nail art éditorial"
        label="SET SUNSET OCEAN"
        meta="10 designs cohérents"
        compact
      />
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/create" className="p-2 hover:bg-soft-gray rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-xs text-rose font-semibold uppercase tracking-widest">Design généré</p>
            <h1 className="text-2xl font-bold text-ink">SET SUNSET OCEAN</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-light/10 text-rose text-sm font-medium hover:bg-rose-light/20 transition-colors">
              <Wand2 className="w-3.5 h-3.5" />
              Modifier le set
            </button>
          </div>
        </div>

        {/* AI note */}
        <div className="rounded-2xl bg-rose-light/5 border border-rose-light/20 p-4 mb-6 flex items-start gap-3">
          <ScanLine className="w-4 h-4 text-rose mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-rose mb-0.5">Design adapté à ton Nail Profile</p>
            <p className="text-xs text-ink-light/40">
              Chaque ongle a été généré individuellement pour correspondre à tes dimensions et à tes formes naturelles.
            </p>
          </div>
        </div>

        {/* Left Hand */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-ink-light/50 uppercase tracking-wider mb-4">Main Gauche</h3>
          <div className="grid grid-cols-5 gap-3 sm:gap-4">
            {leftFingers.map((name, i) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <div className="relative group">
                  <div
                    className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl border-2 border-ink/10 shadow-sm transition-all group-hover:scale-105 group-hover:border-rose/30"
                    style={{
                      background: designTones[i],
                      borderRadius: i === 0 ? "40% 40% 35% 35% / 30% 30% 45% 45%" : "50% 50% 40% 40% / 30% 30% 45% 45%",
                    }}
                  />
                  {regenerating === i && (
                    <div className="absolute inset-0 rounded-2xl bg-white/60 flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-rose animate-spin" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-medium text-ink-light/50">{name}</span>
                <button
                  onClick={() => handleRegenerate(i)}
                  className="text-[10px] text-ink-light/30 hover:text-rose transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Régénérer
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Hand */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-ink-light/50 uppercase tracking-wider mb-4">Main Droite</h3>
          <div className="grid grid-cols-5 gap-3 sm:gap-4">
            {rightFingers.map((name, i) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <div className="relative group">
                  <div
                    className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl border-2 border-ink/10 shadow-sm transition-all group-hover:scale-105 group-hover:border-rose/30"
                    style={{
                      background: designTones[i + 5],
                      borderRadius: i === 0 ? "40% 40% 35% 35% / 30% 30% 45% 45%" : "50% 50% 40% 40% / 30% 30% 45% 45%",
                    }}
                  />
                </div>
                <span className="text-[10px] font-medium text-ink-light/50">{name}</span>
                <button
                  onClick={() => handleRegenerate(i + 5)}
                  className="text-[10px] text-ink-light/30 hover:text-rose transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Régénérer
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Coherence note */}
        <div className="rounded-2xl bg-white border border-soft-gray/50 p-4 mb-6 flex items-center gap-3">
          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
          <p className="text-xs text-ink-light/50">
            Cohérence artistique vérifiée — les 10 designs appartiennent au même univers visuel.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/try-on")}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-rose text-white rounded-2xl text-lg font-semibold hover:bg-rose-dark transition-all shadow-lg shadow-rose/15"
          >
            <Eye className="w-5 h-5" />
            Voir sur mes mains
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push("/create/fabricability")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-soft-gray/80 rounded-2xl text-sm font-medium hover:border-ink/15 transition-all"
            >
              <Wand2 className="w-4 h-4" />
              Vérifier la fabrication
            </button>
            <button
              onClick={() => router.push("/checkout")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-ink text-white rounded-2xl text-sm font-medium hover:bg-ink-light transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              Commander ce set
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
