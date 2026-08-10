"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import PageHero, { visualAssets } from "@/components/PageHero";
import {
  ChevronLeft,
  Heart,
  Eye,
  ShoppingBag,
  ArrowRight,
  User,
  Shield,
  Sparkles,
  Layers3,
} from "lucide-react";
import Link from "next/link";
import { getMarketplaceItem, getCreatorItems } from "@/lib/marketplace";

type PageProps = { params: Promise<{ id: string }> };

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const item = getMarketplaceItem(id);
  const router = useRouter();
  const [favorited, setFavorited] = useState(false);

  if (!item) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <p className="text-xs text-rose font-semibold uppercase tracking-widest">
            Introuvable
          </p>
          <h1 className="mt-3 text-3xl font-bold text-ink">
            Ce design n'existe pas (ou plus)
          </h1>
          <p className="mt-3 text-ink-light/50">
            Il a peut-être été retiré par AIME® Studio, ou le lien est incorrect.
          </p>
          <Link
            href="/explore"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-ink-light transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour à la marketplace
          </Link>
        </div>
      </AppShell>
    );
  }

  // Designs du même style (pour la section "Dans la même collection")
  const sameCollection = getCreatorItems(item.creator)
    .filter((i) => i.style === item.style && i.id !== item.id)
    .slice(0, 4);

  return (
    <AppShell>
      <PageHero
        eyebrow={`DESIGN / ${item.style.toUpperCase()}`}
        title="Une création. Dix façons de la porter."
        description="Ce design n'est pas une image figée. Il s'adapte à ton AIME®, doigt par doigt, avant de devenir ton set."
        image={item.palette3[0]}
        imageAlt={`${item.name} — ${item.style}`}
        label={item.name.toUpperCase()}
        meta="Essayable sur ton profil"
        compact
      />
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/explore" className="p-2 hover:bg-soft-gray rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-rose font-semibold uppercase tracking-widest">Design</p>
            <h1 className="text-2xl font-bold text-ink truncate">{item.name}</h1>
          </div>
          <button
            onClick={() => setFavorited(!favorited)}
            aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
            className={`p-2.5 rounded-xl transition-all ${
              favorited ? "bg-rose text-white" : "bg-white border border-soft-gray text-ink-light/40"
            }`}
          >
            <Heart className={`w-5 h-5 ${favorited ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Hero Design */}
        <div
          className="rounded-3xl aspect-[16/10] mb-6 flex items-center justify-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${item.palette3[0]} 0%, ${item.palette3[1]} 50%, ${item.palette3[2]} 100%)`,
          }}
        >
          <div className="text-center text-white drop-shadow-lg">
            <p className="text-white/80 text-xs uppercase tracking-widest">{item.style}</p>
            <h1 className="text-4xl font-bold mt-2">{item.name}</h1>
          </div>
          <div className="absolute bottom-4 left-4 flex gap-3 text-white/90 text-sm">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {item.views.toLocaleString("fr-FR")}
            </span>
            <span className="flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5" /> {item.orders}
            </span>
          </div>
        </div>

        {/* Studio + price */}
        <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-white border border-soft-gray/50">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
            style={{ background: item.tone }}
          >
            A
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">AIME® Studio</p>
            <p className="text-xs text-ink-light/40">Collection {item.style}</p>
          </div>
          <span className="text-2xl font-bold text-ink">{item.price}</span>
        </div>

        {/* Description */}
        <div className="rounded-2xl bg-white border border-soft-gray/50 p-6 mb-6">
          <p className="text-sm text-ink-light/60 leading-relaxed">{item.description}</p>
          <div className="flex gap-2 mt-4 flex-wrap">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-soft-gray/50 text-xs text-ink-light/40"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Palette + finish + shape */}
        <div className="rounded-2xl bg-white border border-soft-gray/50 p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-light/40 mb-3">
                Palette
              </p>
              <div className="flex gap-2">
                {item.palette3.map((color, i) => (
                  <div key={i} className="flex-1">
                    <div
                      className="aspect-square rounded-xl border border-ink/10"
                      style={{ background: color }}
                    />
                    <p className="mt-1.5 text-[10px] text-ink-light/40 text-center font-mono">
                      {color}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-light/40">
                Spécifications
              </p>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-rose" />
                <span className="text-sm capitalize">Finition {item.finish}</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers3 className="w-3.5 h-3.5 text-rose" />
                <span className="text-sm">10 designs doigt par doigt</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-rose" />
                <span className="text-sm capitalize">Forme {item.shape}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Try on CTA */}
        <div className="rounded-2xl bg-rose-light/5 border border-rose-light/20 p-4 mb-6 flex items-start gap-3">
          <Shield className="w-4 h-4 text-rose mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-rose">Essaie ce design sur tes ongles</p>
            <p className="text-xs text-ink-light/40 mt-0.5">
              Avec ton AIME®, ce design s'adapte automatiquement à la forme de tes ongles.
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
            Commander — {item.price}
          </button>
        </div>

        {/* Same collection */}
        {sameCollection.length > 0 && (
          <div className="mt-12">
            <h3 className="text-sm font-semibold text-ink-light/50 uppercase tracking-wider mb-4">
              Dans la même collection {item.style}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sameCollection.map((other) => (
                <Link
                  key={other.id}
                  href={`/explore/${other.id}`}
                  className="group rounded-2xl bg-white border border-soft-gray/50 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div
                    className="aspect-square"
                    style={{
                      background: `linear-gradient(135deg, ${other.palette3[0]}, ${other.palette3[1]}, ${other.palette3[2]})`,
                    }}
                  />
                  <div className="p-3">
                    <p className="font-medium text-ink text-sm group-hover:text-rose transition-colors line-clamp-1">
                      {other.name}
                    </p>
                    <p className="text-[10px] text-ink-light/40">{other.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
