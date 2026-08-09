"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHero, { visualAssets } from "@/components/PageHero";
import AppShell from "@/components/AppShell";
import { ChevronLeft, ArrowRight, Move, ZoomIn, RotateCw, Check } from "lucide-react";
import Link from "next/link";

const fingerNames = ["Pouce", "Index", "Majeur", "Annulaire", "Auriculaire"];
const shapes = ["almond", "oval", "oval", "round", "round"];
const confidences = [98, 97, 96, 95, 94];

export default function ExtractionPage() {
  const router = useRouter();
  const [selectedNail, setSelectedNail] = useState<number | null>(null);
  const [corrected, setCorrected] = useState<Set<number>>(new Set());
  const [allValidated, setAllValidated] = useState(false);

  const handleValidate = (index: number) => {
    const newSet = new Set(corrected);
    newSet.add(index);
    setCorrected(newSet);
    if (newSet.size === 5) {
      setAllValidated(true);
    }
  };

  const handleAutoCorrect = (index: number) => {
    setSelectedNail(index);
    // Simulate correction
    setTimeout(() => {
      setSelectedNail(null);
      handleValidate(index);
    }, 1000);
  };

  return (
    <AppShell>
      <PageHero
        eyebrow="SCAN / 02"
        title="Chaque ongle devient un objet."
        description="Nous séparons les cinq formes, puis tu gardes le dernier mot. Un geste suffit pour valider ou corriger un contour."
        image={visualAssets.artHands}
        imageAlt="Mains avec nail art artistique noir et blanc"
        label="Contours détectés"
        meta="Correction manuelle disponible"
        compact
      />
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/scan" className="p-2 hover:bg-soft-gray rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-xs text-rose font-semibold uppercase tracking-widest">Extraction</p>
            <h1 className="text-2xl font-bold text-ink">Isoler les ongles</h1>
          </div>
          <div className="ml-auto">
            <span className="text-sm text-ink-light/40">
              {corrected.size}/5 validés
            </span>
          </div>
        </div>

        {/* Canvas with nail outlines */}
        <div className="rounded-3xl bg-white border border-soft-gray/50 p-8 mb-8">
          <p className="text-sm text-ink-light/40 text-center mb-6">
            {selectedNail !== null
              ? `Ajuste le contour de ton ${fingerNames[selectedNail]}`
              : "Sélectionne un ongle pour corriger son contour"}
          </p>

          <div className="flex items-end justify-center gap-4 sm:gap-8 flex-wrap">
            {fingerNames.map((name, i) => (
              <button
                key={name}
                onClick={() => setSelectedNail(i)}
                className={`flex flex-col items-center gap-3 transition-all ${
                  selectedNail === i ? "scale-110" : "hover:scale-105"
                }`}
              >
                <div
                  className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-2xl border-2 transition-all ${
                    selectedNail === i
                      ? "border-rose bg-rose-light/10 nail-glow"
                      : corrected.has(i)
                      ? "border-green-300 bg-green-50/30"
                      : "border-ink/10 bg-soft-gray/30"
                  }`}
                >
                  {/* Nail shape representation */}
                  <div className="absolute inset-2 rounded-xl border border-dashed border-ink/15 flex items-center justify-center">
                    <span className="text-[10px] text-ink-light/30">{confidences[i]}%</span>
                  </div>
                  {corrected.has(i) && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-ink-light/60">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        {selectedNail !== null && (
          <div className="rounded-3xl bg-white border border-soft-gray/50 p-6 mb-6 animate-fade-in-up">
            <h3 className="font-semibold mb-4">
              Correction — {fingerNames[selectedNail]}
            </h3>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => handleAutoCorrect(selectedNail)}
                className="flex items-center gap-2 px-4 py-2.5 bg-rose text-white rounded-xl text-sm font-medium hover:bg-rose-dark transition-all"
              >
                <Move className="w-4 h-4" />
                Ajuster automatiquement
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-soft-gray rounded-xl text-sm font-medium hover:border-ink/15 transition-all">
                <ZoomIn className="w-4 h-4" />
                Zoom
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-soft-gray rounded-xl text-sm font-medium hover:border-ink/15 transition-all">
                <RotateCw className="w-4 h-4" />
                Pivoter
              </button>
              <button
                onClick={() => {
                  handleValidate(selectedNail);
                  setSelectedNail(null);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-all ml-auto"
              >
                <Check className="w-4 h-4" />
                Valider
              </button>
            </div>
          </div>
        )}

        {/* Continue button */}
        <button
          onClick={() => router.push("/scan/profile")}
          disabled={!allValidated}
          className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-lg font-semibold transition-all ${
            allValidated
              ? "bg-rose text-white hover:bg-rose-dark shadow-lg shadow-rose/15"
              : "bg-ink/5 text-ink-light/30 cursor-not-allowed"
          }`}
        >
          {allValidated ? "Créer mon Nail Profile" : "Valide les 5 ongles pour continuer"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </AppShell>
  );
}
