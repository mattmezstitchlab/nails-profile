"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import PageHero, { visualAssets } from "@/components/PageHero";
import {
  ChevronLeft,
  ArrowRight,
  Globe,
  Lock,
  Users,
  ScanLine,
  Check,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

export default function PublishPage() {
  const router = useRouter();
  const [visibility, setVisibility] = useState<"private" | "public" | "creator">("public");
  const [price, setPrice] = useState("49.90");
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    setIsPublishing(true);
    setError(null);
    try {
      const response = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility, price }),
      });
      if (!response.ok) throw new Error("publish");
      router.push("/explore");
    } catch {
      setError("La publication n’a pas pu être enregistrée. Réessaie dans un instant.");
      setIsPublishing(false);
    }
  };

  return (
    <AppShell>
      <PageHero
        eyebrow="PUBLISH / 01"
        title="Une création peut voyager."
        description="Publie un design que d'autres pourront adapter à leurs propres gabarits. Tu partages une création, pas seulement une image."
        image={visualAssets.artHands}
        imageAlt="Mains avec nail art artistique noir et blanc"
        label="Design paramétrique"
        meta="Prêt à rejoindre la boutique"
        compact
      />
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/create/result" className="p-2 hover:bg-soft-gray rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-xs text-rose font-semibold uppercase tracking-widest">Publier</p>
            <h1 className="text-2xl font-bold text-ink">Partager ta création</h1>
          </div>
        </div>

        {/* Design Preview */}
        <div className="rounded-3xl bg-[#a7475c] aspect-[16/10] mb-6 flex items-center justify-center">
          <p className="text-white/60 text-lg font-medium">Sunset Ocean</p>
        </div>

        {/* Visibility Options */}
        <div className="rounded-3xl bg-white border border-soft-gray/50 p-6 mb-6">
          <h3 className="font-semibold mb-4">Visibilité</h3>
          <div className="space-y-3">
            <button
              onClick={() => setVisibility("private")}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                visibility === "private"
                  ? "border-rose bg-rose-light/5"
                  : "border-soft-gray/50 hover:border-ink/15"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-soft-gray/50 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-ink-light/40" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Privé</p>
                <p className="text-xs text-ink-light/40">Uniquement pour toi</p>
              </div>
              {visibility === "private" && <Check className="w-5 h-5 text-rose" />}
            </button>

            <button
              onClick={() => setVisibility("public")}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                visibility === "public"
                  ? "border-rose bg-rose-light/5"
                  : "border-soft-gray/50 hover:border-ink/15"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-soft-gray/50 flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-ink-light/40" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Public</p>
                <p className="text-xs text-ink-light/40">Publier dans la boutique — les autres peuvent commander ce design</p>
              </div>
              {visibility === "public" && <Check className="w-5 h-5 text-rose" />}
            </button>

            <button
              onClick={() => setVisibility("creator")}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                visibility === "creator"
                  ? "border-rose bg-rose-light/5"
                  : "border-soft-gray/50 hover:border-ink/15"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-soft-gray/50 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-ink-light/40" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Créateur</p>
                <p className="text-xs text-ink-light/40">Permettre à d&apos;autres de commander ce design — tu reçois une commission</p>
              </div>
              {visibility === "creator" && <Check className="w-5 h-5 text-rose" />}
            </button>
          </div>
        </div>

        {/* Price setting (for public/creator) */}
        {visibility !== "private" && (
          <div className="rounded-3xl bg-white border border-soft-gray/50 p-6 mb-6">
            <h3 className="font-semibold mb-4">Prix de vente</h3>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="flex-1 p-3 rounded-xl border border-soft-gray/80 bg-ivory/50 text-ink text-lg font-semibold focus:outline-none focus:border-rose/30"
              />
              <span className="text-ink-light/40 font-medium">€</span>
            </div>
            {visibility === "creator" && (
              <div className="mt-4 p-4 rounded-xl bg-green-50 flex items-start gap-3">
                <DollarSign className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-700">Tu gagnes 70% sur chaque vente</p>
                  <p className="text-xs text-green-600/60 mt-0.5">
                    Soit environ {(parseFloat(price) * 0.7).toFixed(2)} € par commande
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Parametric design note */}
        <div className="rounded-2xl bg-rose-light/5 border border-rose-light/20 p-4 mb-6 flex items-start gap-3">
          <ScanLine className="w-4 h-4 text-rose mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-rose">Design paramétrique</p>
            <p className="text-xs text-ink-light/40">
              Ton design sera automatiquement adapté aux différents Nail Profiles.
              Chaque acheteur recevra le design ajusté à ses propres dimensions.
            </p>
          </div>
        </div>

        {/* Publish button */}
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="w-full flex items-center justify-center gap-2 px-6 py-5 bg-rose text-white rounded-2xl text-lg font-semibold hover:bg-rose-dark transition-all shadow-lg shadow-rose/15 disabled:opacity-60"
        >
          <Globe className="w-5 h-5" />
          {isPublishing
            ? "Enregistrement…"
            : visibility === "private"
            ? "Sauvegarder en privé"
            : visibility === "creator"
            ? "Publier en tant que Créateur"
            : "Publier dans la boutique"}
          <ArrowRight className="w-4 h-4" />
        </button>
        {error && <p className="text-sm text-red-600 text-center mt-3">{error}</p>}
      </div>
    </AppShell>
  );
}
