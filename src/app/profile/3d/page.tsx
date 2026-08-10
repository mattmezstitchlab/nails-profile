"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import AppShell from "@/components/AppShell";
import PageHero, { visualAssets } from "@/components/PageHero";
import {
  Sparkles,
  Activity,
  ChevronLeft,
  RefreshCw,
  TrendingUp,
  Heart,
} from "lucide-react";
import Link from "next/link";
import type { NailMeshParams } from "@/components/NailModel3D";

// Le composant 3D est dynamique pour éviter le SSR (three.js a besoin du DOM)
const NailModel3D = dynamic(() => import("@/components/NailModel3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[460px] w-full items-center justify-center rounded-3xl border border-soft-gray/50 bg-soft-gray/30 text-sm text-ink-light/40">
      Chargement du modèle 3D…
    </div>
  ),
});

const fingerLabels: Record<string, string> = {
  left_thumb: "Pouce G",
  left_index: "Index G",
  left_middle: "Majeur G",
  left_ring: "Annulaire G",
  left_pinky: "Auriculaire G",
  right_thumb: "Pouce D",
  right_index: "Index D",
  right_middle: "Majeur D",
  right_ring: "Annulaire D",
  right_pinky: "Auriculaire D",
};

const defaultMeasurements = [
  { hand: "left" as const, finger: "thumb" as const, width: 17, length: 16, curvature: 0.35, thickness: 0.7, shape: "square" as const },
  { hand: "left" as const, finger: "index" as const, width: 14, length: 14, curvature: 0.4, thickness: 0.6, shape: "almond" as const },
  { hand: "left" as const, finger: "middle" as const, width: 15, length: 15, curvature: 0.42, thickness: 0.6, shape: "almond" as const },
  { hand: "left" as const, finger: "ring" as const, width: 14, length: 14, curvature: 0.38, thickness: 0.6, shape: "oval" as const },
  { hand: "left" as const, finger: "pinky" as const, width: 12, length: 11, curvature: 0.32, thickness: 0.55, shape: "round" as const },
  { hand: "right" as const, finger: "thumb" as const, width: 18, length: 16, curvature: 0.36, thickness: 0.7, shape: "square" as const },
  { hand: "right" as const, finger: "index" as const, width: 14, length: 14, curvature: 0.4, thickness: 0.6, shape: "almond" as const },
  { hand: "right" as const, finger: "middle" as const, width: 15, length: 15, curvature: 0.42, thickness: 0.6, shape: "almond" as const },
  { hand: "right" as const, finger: "ring" as const, width: 14, length: 14, curvature: 0.4, thickness: 0.6, shape: "oval" as const },
  { hand: "right" as const, finger: "pinky" as const, width: 12, length: 11, curvature: 0.3, thickness: 0.55, shape: "round" as const },
];

const lastScannedAt = new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(); // 35 jours

export default function Profile3DPage() {
  const [meshes, setMeshes] = useState<NailMeshParams[] | null>(null);
  const [selectedFinger, setSelectedFinger] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRegen, setLastRegen] = useState<string | null>(null);

  const regenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/profile/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          measurements: defaultMeasurements,
          lastScannedAt,
        }),
      });
      if (!response.ok) throw new Error(`Service responded with ${response.status}`);
      const data = await response.json();
      setMeshes(data.set.meshes);
      setLastRegen(data.generatedAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Régénération échouée");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void regenerate();
  }, []);

  const selectedMesh = useMemo(
    () => meshes?.find((m) => m.finger === selectedFinger),
    [meshes, selectedFinger]
  );

  const summary = useMemo(() => {
    if (!meshes || meshes.length === 0) return null;
    const avgGrowth = meshes.reduce((s, m) => s + m.growthSinceLastScan, 0) / meshes.length;
    const avgHealth = Math.round(meshes.reduce((s, m) => s + m.healthScore, 0) / meshes.length);
    const totalGrowth = meshes.reduce((s, m) => s + m.growthSinceLastScan, 0);
    return { avgGrowth, avgHealth, totalGrowth };
  }, [meshes]);

  return (
    <AppShell>
      <PageHero
        eyebrow="PROFILE / 02"
        title="Ton Living Nail Profile."
        description="Un modèle 3D vivant de chacun de tes 10 ongles. Il suit leur pousse, mémorise leur forme, et se met à jour à chaque scan."
        image={visualAssets.editorialHands}
        imageAlt="Modèle 3D d'une main manucurée"
        label="Living Nail Profile"
        meta="Première mondiale"
        compact
      />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/profile" className="p-2 hover:bg-soft-gray rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <p className="text-xs text-rose font-semibold uppercase tracking-widest">
              Innovation
            </p>
            <h1 className="text-2xl font-bold text-ink">Living Nail Profile</h1>
          </div>
          <button
            onClick={regenerate}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-ink text-white text-sm font-medium hover:bg-ink-light transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Régénérer le mesh
          </button>
        </div>

        {/* Innovation banner */}
        <div className="rounded-2xl bg-gradient-to-r from-rose/10 via-rose-light/15 to-rose/5 border border-rose/20 p-5 mb-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-ink">Première mondiale</p>
            <p className="text-sm text-ink-light/60 mt-1">
              Personne d'autre ne combine scan biométrique + modèle paramétrique
              + pousse évolutive + commande à l'unité. Ton Nail Profile est vivant :
              il grandit avec toi et anticipe tes designs.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            {error ? (
              <div className="flex h-[460px] w-full items-center justify-center rounded-3xl border border-rose/20 bg-rose/5 text-sm text-rose">
                {error}
              </div>
            ) : !meshes ? (
              <div className="flex h-[460px] w-full items-center justify-center rounded-3xl border border-soft-gray/50 bg-soft-gray/30 text-sm text-ink-light/40">
                Initialisation du mesh…
              </div>
            ) : (
              <NailModel3D
                nails={meshes}
                selectedFinger={selectedFinger ?? undefined}
                onSelectFinger={setSelectedFinger}
              />
            )}

            {/* Stats row */}
            {summary && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-soft-gray/50 bg-white p-4">
                  <div className="flex items-center gap-2 text-ink-light/50">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium uppercase tracking-wider">
                      Pousse moy.
                    </span>
                  </div>
                  <p className="mt-1 text-2xl font-semibold text-ink">
                    {summary.avgGrowth.toFixed(2)}{" "}
                    <span className="text-sm font-normal text-ink-light/40">mm</span>
                  </p>
                </div>
                <div className="rounded-2xl border border-soft-gray/50 bg-white p-4">
                  <div className="flex items-center gap-2 text-ink-light/50">
                    <Activity className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium uppercase tracking-wider">
                      Santé moy.
                    </span>
                  </div>
                  <p className="mt-1 text-2xl font-semibold text-ink">
                    {summary.avgHealth}
                    <span className="text-sm font-normal text-ink-light/40">/100</span>
                  </p>
                </div>
                <div className="rounded-2xl border border-soft-gray/50 bg-white p-4">
                  <div className="flex items-center gap-2 text-ink-light/50">
                    <Heart className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium uppercase tracking-wider">
                      Croissance totale
                    </span>
                  </div>
                  <p className="mt-1 text-2xl font-semibold text-ink">
                    {summary.totalGrowth.toFixed(1)}{" "}
                    <span className="text-sm font-normal text-ink-light/40">mm</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Side panel: selected nail details */}
          <aside className="space-y-4">
            <div className="rounded-3xl border border-soft-gray/50 bg-white p-5">
              <h3 className="text-sm font-semibold text-ink mb-3">
                {selectedFinger ? fingerLabels[selectedFinger] : "Sélectionne un ongle"}
              </h3>
              {!selectedFinger && (
                <p className="text-xs text-ink-light/40">
                  Clique sur n'importe quel ongle du modèle 3D pour voir ses mesures et l'évolution depuis ton dernier scan.
                </p>
              )}
              {selectedFinger && !selectedMesh && (
                <p className="text-xs text-ink-light/40">
                  Cet ongle n'a pas encore de mesures. Lance un scan depuis{" "}
                  <Link href="/scan" className="text-rose underline">
                    /scan
                  </Link>
                  .
                </p>
              )}
              {selectedMesh && (
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-light/40">Largeur</dt>
                    <dd className="font-medium">{selectedMesh.width.toFixed(1)} mm</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-light/40">Longueur</dt>
                    <dd className="font-medium">{selectedMesh.length.toFixed(1)} mm</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-light/40">Courbure</dt>
                    <dd className="font-medium">
                      {(selectedMesh.curvature * 100).toFixed(0)}%
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-light/40">Épaisseur</dt>
                    <dd className="font-medium">{selectedMesh.thickness.toFixed(2)} mm</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-light/40">Forme</dt>
                    <dd className="font-medium capitalize">{selectedMesh.shape}</dd>
                  </div>
                  <div className="flex justify-between border-t border-soft-gray/30 pt-2">
                    <dt className="text-ink-light/40">Pousse depuis scan</dt>
                    <dd className="font-medium text-rose">
                      +{selectedMesh.growthSinceLastScan.toFixed(2)} mm
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-light/40">Santé</dt>
                    <dd className="font-medium">
                      {selectedMesh.healthScore}/100
                    </dd>
                  </div>
                </dl>
              )}
            </div>

            {lastRegen && (
              <p className="text-[10px] text-ink-light/30 text-center">
                Dernière régénération : {new Date(lastRegen).toLocaleString("fr-FR")}
              </p>
            )}
          </aside>
        </div>

        {/* Call to action */}
        <div className="mt-8 rounded-3xl bg-ink p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Et maintenant ?</h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Utilise ce mesh 3D pour générer un design parfaitement ajusté à ta
            géométrie, ou commande une seule capsule à l'unité quand un ongle casse.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-full bg-rose px-6 py-3 text-sm font-semibold hover:bg-rose-dark transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Générer un design sur ce profil
            </Link>
            <Link
              href="/scan"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Re-scanner mes mains
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
