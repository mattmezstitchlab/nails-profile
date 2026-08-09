"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHero, { visualAssets } from "@/components/PageHero";
import AppShell from "@/components/AppShell";
import {
  ChevronLeft,
  ArrowRight,
  Check,
  ShoppingBag,
  BadgeCheck,
  Shield,
  Ruler,
} from "lucide-react";
import Link from "next/link";

const designTones = ["#171717", "#22304a", "#8e2948", "#354d69", "#c4545f"];

export default function CheckoutPage() {
  const router = useRouter();
  const [finish, setFinish] = useState("glossy");
  const [shape, setShape] = useState("almond");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOrder = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finish, nailShape: shape, totalPrice: "39.90" }),
      });
      if (!response.ok) throw new Error("order");
      setIsConfirmed(true);
    } catch {
      setError("La commande n’a pas pu être enregistrée. Réessaie dans un instant.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <PageHero
        eyebrow="ORDER / 01"
        title="Ton set est prêt."
        description="Une dernière sélection de finition, puis ton set personnalisé part en fabrication avec les dimensions de ton Nail Profile."
        image={visualAssets.weddingHands}
        imageAlt="Mains avec manucure élégante de mariage"
        label="Fabrication sur commande"
        meta="Adapté à ton profil"
        compact
      />
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/create/fabricability" className="p-2 hover:bg-soft-gray rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-xs text-rose font-semibold uppercase tracking-widest">Commande</p>
            <h1 className="text-2xl font-bold text-ink">Ton set est prêt.</h1>
          </div>
        </div>

        {/* Set Preview */}
        <div className="rounded-3xl bg-white border border-soft-gray/50 p-6 mb-6">
          <h3 className="font-semibold mb-4">SET SUNSET OCEAN</h3>
          <div className="flex justify-center gap-2 mb-4 flex-wrap">
            {[...designTones, ...designTones].map((tone, i) => (
              <div
                key={i}
                className="w-12 h-14 rounded-xl border border-ink/10 shadow-sm"
                style={{ background: tone }}
              />
            ))}
          </div>
          <p className="text-xs text-ink-light/40 text-center">
            10 ongles personnalisés · Design généré par IA
          </p>
        </div>

        {/* Profile adaptation */}
        <div className="rounded-2xl bg-rose-light/5 border border-rose-light/20 p-4 mb-6 flex items-start gap-3">
          <Shield className="w-4 h-4 text-rose mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-rose">Adapté à ton Nail Profile</p>
            <p className="text-xs text-ink-light/40">
              Les dimensions de chaque ongle correspondent exactement à tes gabarits personnels.
            </p>
          </div>
        </div>

        {/* Finish */}
        <div className="rounded-3xl bg-white border border-soft-gray/50 p-6 mb-4">
          <h3 className="font-semibold mb-4">Finition</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "glossy", label: "Brillante" },
              { id: "matte", label: "Mate" },
              { id: "chrome", label: "Chrome" },
              { id: "metallic", label: "Métallique" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFinish(opt.id)}
                className={`p-3 rounded-xl text-xs font-medium transition-all ${
                  finish === opt.id
                    ? "bg-rose text-white shadow-md shadow-rose/15"
                    : "bg-soft-gray/30 text-ink-light/50 hover:bg-soft-gray"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shape */}
        <div className="rounded-3xl bg-white border border-soft-gray/50 p-6 mb-6">
          <h3 className="font-semibold mb-4">Forme</h3>
          <div className="grid grid-cols-5 gap-2">
            {[
              { id: "natural", label: "Naturelle" },
              { id: "almond", label: "Almond" },
              { id: "oval", label: "Oval" },
              { id: "square", label: "Square" },
              { id: "coffin", label: "Coffin" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setShape(opt.id)}
                className={`p-3 rounded-xl text-xs font-medium transition-all ${
                  shape === opt.id
                    ? "bg-rose text-white shadow-md shadow-rose/15"
                    : "bg-soft-gray/30 text-ink-light/50 hover:bg-soft-gray"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-3xl bg-white border border-soft-gray/50 p-6 mb-6">
          <h3 className="font-semibold mb-4">Récapitulatif</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-light/50">10 ongles personnalisés</span>
              <span className="font-medium">39,90 €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-light/50">Adaptation Nail Profile</span>
              <span className="text-ink-light/30">Inclus</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-light/50">Design IA</span>
              <span className="text-ink-light/30">Inclus</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-light/50">Finition {finish === "glossy" ? "Brillante" : finish}</span>
              <span className="text-ink-light/30">Inclus</span>
            </div>
            <hr className="border-soft-gray/50" />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>39,90 €</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        {!isConfirmed ? (
          <button
            onClick={handleOrder}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-5 bg-rose text-white rounded-2xl text-lg font-semibold hover:bg-rose-dark transition-all shadow-lg shadow-rose/15 disabled:opacity-60"
          >
            <ShoppingBag className="w-5 h-5" />
            {isSubmitting ? "Enregistrement…" : "Commander mon set — 39,90 €"}
          </button>
        ) : (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
            <BadgeCheck className="w-7 h-7 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-green-800">Commande confirmée</p>
            <p className="text-sm text-green-700/70 mt-1">Ton set passe en fabrication sur commande.</p>
            <button
              onClick={() => router.push("/orders")}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-ink text-white rounded-xl text-sm font-medium hover:bg-ink-light transition-colors"
            >
              Voir mes commandes
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && <p className="text-sm text-red-600 text-center mt-3">{error}</p>}

        <p className="text-xs text-ink-light/30 text-center mt-4">
          Fabrication sur commande · Livraison sous 7-10 jours · Satisfait ou refait
        </p>
      </div>
    </AppShell>
  );
}
