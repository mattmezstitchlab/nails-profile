"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import PageHero, { visualAssets } from "@/components/PageHero";
import {
  ChevronLeft,
  Heart,
  Eye,
  ShoppingBag,
  ScanLine,
  ArrowRight,
  User,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const router = useRouter();
  const [favorited, setFavorited] = useState(false);

  return (
    <AppShell>
      <PageHero
        eyebrow="DESIGN / DETAIL"
        title="Une création. Dix façons de la porter."
        description="Ce design n'est pas une image figée. Il s'adapte à ton Nail Profile, doigt par doigt, avant de devenir ton set."
        image={visualAssets.blackNails}
        imageAlt="Portrait avec ongles noirs et nail art sophistiqué"
        label="SUNSET OCEAN"
        meta="Essayable sur ton profil"
        compact
      />
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/explore" className="p-2 hover:bg-soft-gray rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <p className="text-xs text-rose font-semibold uppercase tracking-widest">Design</p>
          </div>
          <button
            onClick={() => setFavorited(!favorited)}
            className={`p-2.5 rounded-xl transition-all ${
              favorited ? "bg-rose text-white" : "bg-white border border-soft-gray text-ink-light/40"
            }`}
          >
            <Heart className={`w-5 h-5 ${favorited ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Hero Design */}
        <div className="rounded-3xl bg-[#a7475c] aspect-[16/10] mb-6 flex items-center justify-center relative overflow-hidden">
          <div className="text-center text-white">
            <p className="text-white/60 text-sm">5 designs uniques</p>
            <h1 className="text-4xl font-bold mt-2">Sunset Ocean</h1>
          </div>
          <div className="absolute bottom-4 left-4 flex gap-3 text-white/80 text-sm">
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> 1 240</span>
            <span className="flex items-center gap-1"><ShoppingBag className="w-3.5 h-3.5" /> 89</span>
          </div>
        </div>

        {/* Creator info */}
        <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-white border border-soft-gray/50">
          <div className="w-10 h-10 rounded-full bg-rose flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Camille Dubois</p>
            <p className="text-xs text-ink-light/40">12 créations</p>
          </div>
          <span className="text-2xl font-bold text-ink">49,90 €</span>
        </div>

        {/* Description */}
        <div className="rounded-2xl bg-white border border-soft-gray/50 p-6 mb-6">
          <p className="text-sm text-ink-light/60 leading-relaxed">
            Inspiré d&apos;un coucher de soleil sur la mer, élégant, bleu nuit, corail et quelques détails dorés.
            Les cinq designs sont différents mais appartiennent au même univers visuel.
          </p>
          <div className="flex gap-2 mt-4">
            {["luxury", "ocean", "sunset", "gold"].map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-soft-gray/50 text-xs text-ink-light/40">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Try on CTA */}
        <div className="rounded-2xl bg-rose-light/5 border border-rose-light/20 p-4 mb-6 flex items-start gap-3">
          <Shield className="w-4 h-4 text-rose mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-rose">Essaie ce design sur tes ongles</p>
            <p className="text-xs text-ink-light/40 mt-0.5">
              Avec ton Nail Profile, ce design s&apos;adapte automatiquement à la forme de tes ongles.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/try-on")}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-rose text-white rounded-2xl text-lg font-semibold hover:bg-rose-dark transition-all shadow-lg shadow-rose/15"
          >
            <Eye className="w-5 h-5" />
            Essayer sur mes ongles
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push("/checkout")}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-ink text-white rounded-2xl text-lg font-semibold hover:bg-ink-light transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Commander — 49,90 €
          </button>
        </div>
      </div>
    </AppShell>
  );
}
