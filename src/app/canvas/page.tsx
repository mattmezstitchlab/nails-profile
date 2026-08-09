"use client";

import { useState } from "react";
import PageHero, { visualAssets } from "@/components/PageHero";
import AppShell from "@/components/AppShell";
import { Eye, EyeOff, ZoomIn, ScanLine, ArrowRight, LayoutGrid } from "lucide-react";
import Link from "next/link";

const nailData = [
  { finger: "thumb_left", label: "Pouce G", w: 14.2, h: 18.7, shape: "Almond" },
  { finger: "index_left", label: "Index G", w: 12.8, h: 16.4, shape: "Oval" },
  { finger: "middle_left", label: "Majeur G", w: 13.1, h: 17.2, shape: "Oval" },
  { finger: "ring_left", label: "Annulaire G", w: 11.5, h: 15.8, shape: "Round" },
  { finger: "pinky_left", label: "Auri G", w: 10.2, h: 14.1, shape: "Round" },
  { finger: "thumb_right", label: "Pouce D", w: 14.5, h: 19.0, shape: "Almond" },
  { finger: "index_right", label: "Index D", w: 13.0, h: 16.6, shape: "Oval" },
  { finger: "middle_right", label: "Majeur D", w: 13.3, h: 17.4, shape: "Oval" },
  { finger: "ring_right", label: "Annulaire D", w: 11.7, h: 16.0, shape: "Round" },
  { finger: "pinky_right", label: "Auri D", w: 10.4, h: 14.3, shape: "Round" },
];

export default function CanvasPage() {
  const [mode, setMode] = useState<"canvas" | "hand">("canvas");
  const [hiddenNails, setHiddenNails] = useState<Set<string>>(new Set());
  const [selectedNail, setSelectedNail] = useState<string | null>(null);

  const toggleNail = (finger: string) => {
    const newSet = new Set(hiddenNails);
    if (newSet.has(finger)) {
      newSet.delete(finger);
    } else {
      newSet.add(finger);
    }
    setHiddenNails(newSet);
  };

  return (
    <AppShell>
      <PageHero
        eyebrow="CANVAS / 01"
        title="Mon ongle. Mon canevas."
        description="Visualise tes dix formes à plat, sélectionne un doigt, compare tes mains et prépare la prochaine création."
        image={visualAssets.blueNails}
        imageAlt="Main avec manucure bleue graphique"
        label="10 objets indépendants"
        meta="Canvas prêt à designer"
        compact
      />
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs text-rose font-semibold uppercase tracking-widest">Canvas</p>
            <h1 className="text-2xl font-bold text-ink">Nail Canvas</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMode("canvas")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                mode === "canvas"
                  ? "bg-rose text-white"
                  : "bg-white border border-soft-gray text-ink-light/60 hover:border-ink/15"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Canvas
            </button>
            <button
              onClick={() => setMode("hand")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                mode === "hand"
                  ? "bg-rose text-white"
                  : "bg-white border border-soft-gray text-ink-light/60 hover:border-ink/15"
              }`}
            >
              <ScanLine className="w-4 h-4" />
              Main
            </button>
          </div>
        </div>

        {/* Canvas / Hand View */}
        {mode === "canvas" ? (
          <div className="rounded-3xl bg-white border border-soft-gray/50 p-8 mb-8">
            <p className="text-sm text-ink-light/40 text-center mb-6">
              10 formes isolées — sélectionne, zoome, masque ou modifie chaque ongle
            </p>

            {/* Left hand row */}
            <div className="mb-8">
              <p className="text-xs font-semibold text-ink-light/40 uppercase tracking-wider mb-4 text-center">Main Gauche</p>
              <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
                {nailData.slice(0, 5).map((nail) => (
                  <button
                    key={nail.finger}
                    onClick={() => setSelectedNail(selectedNail === nail.finger ? null : nail.finger)}
                    className={`flex flex-col items-center gap-2 transition-all ${
                      hiddenNails.has(nail.finger) ? "opacity-20" : ""
                    } ${selectedNail === nail.finger ? "scale-110" : "hover:scale-105"}`}
                  >
                    <div
                      className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-2xl border-2 transition-all flex items-center justify-center ${
                        selectedNail === nail.finger
                          ? "border-rose bg-rose-light/10 nail-glow"
                          : "border-ink/10 bg-soft-gray/30"
                      }`}
                      style={{
                        borderRadius: nail.shape === "Almond" ? "40% 40% 35% 35% / 30% 30% 45% 45%" :
                                     nail.shape === "Oval" ? "50% 50% 40% 40% / 30% 30% 45% 45%" :
                                     "35% 35% 30% 30% / 25% 25% 40% 40%",
                      }}
                    >
                      {hiddenNails.has(nail.finger) ? (
                        <EyeOff className="w-4 h-4 text-ink-light/30" />
                      ) : (
                        <span className="text-[10px] text-ink-light/30">
                          {nail.w}×{nail.h}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-ink-light/50">{nail.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right hand row */}
            <div>
              <p className="text-xs font-semibold text-ink-light/40 uppercase tracking-wider mb-4 text-center">Main Droite</p>
              <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
                {nailData.slice(5, 10).map((nail) => (
                  <button
                    key={nail.finger}
                    onClick={() => setSelectedNail(selectedNail === nail.finger ? null : nail.finger)}
                    className={`flex flex-col items-center gap-2 transition-all ${
                      hiddenNails.has(nail.finger) ? "opacity-20" : ""
                    } ${selectedNail === nail.finger ? "scale-110" : "hover:scale-105"}`}
                  >
                    <div
                      className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-2xl border-2 transition-all flex items-center justify-center ${
                        selectedNail === nail.finger
                          ? "border-rose bg-rose-light/10 nail-glow"
                          : "border-ink/10 bg-soft-gray/30"
                      }`}
                      style={{
                        borderRadius: nail.shape === "Almond" ? "40% 40% 35% 35% / 30% 30% 45% 45%" :
                                     nail.shape === "Oval" ? "50% 50% 40% 40% / 30% 30% 45% 45%" :
                                     "35% 35% 30% 30% / 25% 25% 40% 40%",
                      }}
                    >
                      {hiddenNails.has(nail.finger) ? (
                        <EyeOff className="w-4 h-4 text-ink-light/30" />
                      ) : (
                        <span className="text-[10px] text-ink-light/30">
                          {nail.w}×{nail.h}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-ink-light/50">{nail.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex justify-center gap-3 mt-8">
              <button
                onClick={() => setHiddenNails(new Set())}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-light/50 hover:text-ink transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Tout afficher
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-light/50 hover:text-ink transition-colors">
                <ZoomIn className="w-3.5 h-3.5" />
                Zoom
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-white border border-soft-gray/50 p-8 mb-8 text-center">
            <div className="flex justify-center gap-16 items-end perspective-hand">
              {/* Left hand silhouette */}
              <div className="relative w-48 h-64">
                <div className="absolute inset-0 bg-soft-gray/50 rounded-[30%_30%_20%_20%/25%_25%_40%_40%]" />
                <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col gap-3">
                  {nailData.slice(0, 5).map((nail, i) => (
                    <div
                      key={nail.finger}
                      className="w-14 h-8 rounded-full border-2 border-rose/20 bg-rose-light/10 mx-auto"
                      style={{ width: `${14 - i * 1.2}px` }}
                    />
                  ))}
                </div>
                <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-ink-light/30">Main Gauche</p>
              </div>
              {/* Right hand silhouette */}
              <div className="relative w-48 h-64 scale-x-[-1]">
                <div className="absolute inset-0 bg-soft-gray/50 rounded-[30%_30%_20%_20%/25%_25%_40%_40%]" />
                <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col gap-3">
                  {nailData.slice(5, 10).map((nail, i) => (
                    <div
                      key={nail.finger}
                      className="w-14 h-8 rounded-full border-2 border-rose/20 bg-rose-light/10 mx-auto"
                      style={{ width: `${14 - i * 1.2}px` }}
                    />
                  ))}
                </div>
                <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-ink-light/30">Main Droite</p>
              </div>
            </div>
            <p className="text-sm text-ink-light/40 mt-16">Rendu réaliste des deux mains avec les gabarits détectés</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/create"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-rose text-white rounded-2xl text-base font-semibold hover:bg-rose-dark transition-all shadow-lg shadow-rose/15"
          >
            <ScanLine className="w-5 h-5" />
            Créer un design sur ce canvas
          </Link>
          <Link
            href="/profile"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-soft-gray/80 rounded-2xl text-base font-medium hover:border-ink/15 transition-all"
          >
            Voir mon profil
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
