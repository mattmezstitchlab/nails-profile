"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import PageHero, { visualAssets } from "@/components/PageHero";
import { Camera, Upload, ArrowRight, ChevronLeft, ScanFace, ScanLine, Activity, BadgeCheck } from "lucide-react";
import Link from "next/link";

export default function ScanPage() {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "mode" | "capture" | "analyzing" | "detected">("intro");
  const [mode, setMode] = useState<"quick" | "precision">("quick");

  const handleStartScan = () => setStep("mode");
  const handleSelectMode = (m: "quick" | "precision") => {
    setMode(m);
    setStep("capture");
  };
  const handleCapture = () => {
    setStep("analyzing");
    setTimeout(() => setStep("detected"), 2500);
  };
  const handleContinue = () => router.push("/scan/extraction");

  return (
    <AppShell>
      <PageHero
        eyebrow="SCAN / 01"
        title="Montre-moi ta main."
        description="Une photo suffit pour commencer. Nous isolons tes ongles, mesurons leur forme et préparons ton profil personnel."
        image={visualAssets.yellowHand}
        imageAlt="Main manucurée photographiée dans une lumière éditoriale"
        label="Scan haute précision"
        meta="30 secondes pour commencer"
        compact
      />
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {step !== "intro" && (
            <button onClick={() => setStep("intro")} className="p-2 hover:bg-soft-gray rounded-xl transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <p className="text-xs text-rose font-semibold uppercase tracking-widest">Scan</p>
            <h1 className="text-2xl font-bold text-ink">Nail Profile</h1>
          </div>
        </div>

        {/* Step: Intro */}
        {step === "intro" && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="rounded-3xl bg-white border border-soft-gray/50 p-10 text-center">
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-rose-light/10 flex items-center justify-center">
                <ScanLine className="w-12 h-12 text-rose" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Montre-moi ta main.</h2>
              <p className="text-ink-light/50 max-w-md mx-auto leading-relaxed">
                Place ta main dans le cadre. L&apos;IA va détecter, isoler et mesurer
                automatiquement chacun de tes ongles pour créer ton Nail Profile.
              </p>
            </div>

            <button
              onClick={handleStartScan}
              className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-rose text-white rounded-2xl text-lg font-semibold hover:bg-rose-dark transition-all duration-300 shadow-lg shadow-rose/15"
            >
              <Camera className="w-5 h-5" />
              Commencer le scan
            </button>
          </div>
        )}

        {/* Step: Mode Selection */}
        {step === "mode" && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-xl font-semibold">Choisis ton mode de scan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleSelectMode("quick")}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  mode === "quick"
                    ? "border-rose bg-rose-light/5 shadow-lg shadow-rose/5"
                    : "border-soft-gray/50 bg-white hover:border-ink/15"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-rose-light/10 flex items-center justify-center mb-3">
                  <ScanLine className="w-6 h-6 text-rose" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Mode Rapide</h3>
                <p className="text-sm text-ink-light/40">Une seule main • ~30 secondes</p>
              </button>
              <button
                onClick={() => handleSelectMode("precision")}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  mode === "precision"
                    ? "border-rose bg-rose-light/5 shadow-lg shadow-rose/5"
                    : "border-soft-gray/50 bg-white hover:border-ink/15"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-rose-light/10 flex items-center justify-center mb-3">
                  <ScanFace className="w-6 h-6 text-rose" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Mode Précision</h3>
                <p className="text-sm text-ink-light/40">Deux mains • Mesure des 10 ongles</p>
              </button>
            </div>
            <p className="text-sm text-ink-light/40 text-center px-4">
              Le mode Précision scanne tes deux mains pour une mesure plus fidèle de tes 10 ongles.
              Recommandé pour la commande.
            </p>
            <button
              onClick={() => setStep("capture")}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-rose text-white rounded-2xl text-base font-semibold hover:bg-rose-dark transition-all shadow-lg shadow-rose/15"
            >
              Continuer en mode {mode === "quick" ? "Rapide" : "Précision"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step: Capture */}
        {step === "capture" && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="rounded-3xl bg-ink/5 border-2 border-dashed border-ink/15 aspect-[4/3] flex flex-col items-center justify-center relative overflow-hidden">
              {/* Hand silhouette */}
              <div className="absolute inset-0 flex items-center justify-center opacity-15">
                <ScanLine className="w-48 h-48 text-ink" />
              </div>
              <div className="relative z-10 text-center">
                <p className="text-sm text-ink-light/40 mb-4">Place ta main dans le cadre</p>
                <div className="w-64 h-48 mx-auto border-2 border-rose/30 rounded-3xl flex items-center justify-center">
                  <ScanLine className="w-20 h-20 text-rose/30" />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCapture}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-rose text-white rounded-2xl text-base font-semibold hover:bg-rose-dark transition-all shadow-lg shadow-rose/15"
              >
                <Camera className="w-5 h-5" />
                Prendre une photo
              </button>
              <button
                onClick={handleCapture}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border border-soft-gray/80 rounded-2xl text-base font-medium hover:border-ink/15 transition-all"
              >
                <Upload className="w-5 h-5" />
                Importer
              </button>
            </div>
          </div>
        )}

        {/* Step: Analyzing */}
        {step === "analyzing" && (
          <div className="space-y-8 animate-fade-in-up text-center py-12">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-rose-light/30 animate-ping" />
              <div className="absolute inset-2 rounded-full border-4 border-rose animate-spin border-t-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="w-10 h-10 text-rose animate-pulse-soft" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">J&apos;observe tes ongles…</h2>
              <p className="text-ink-light/40">Analyse des contours, mesure des dimensions, détection des formes.</p>
            </div>
            <div className="flex justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose animate-pulse-soft" />
              <span className="w-2 h-2 rounded-full bg-rose animate-pulse-soft delay-100" />
              <span className="w-2 h-2 rounded-full bg-rose animate-pulse-soft delay-200" />
            </div>
          </div>
        )}

        {/* Step: Detected */}
        {step === "detected" && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="rounded-3xl bg-white border border-soft-gray/50 p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <BadgeCheck className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {mode === "quick" ? "J'ai trouvé 5 ongles." : "J'ai trouvé 10 ongles."}
              </h2>
              <p className="text-ink-light/40">Contours détectés avec une précision de 97%</p>
            </div>

            {/* Visual: 5 nails detected */}
            <div className="rounded-3xl bg-white border border-soft-gray/50 p-6">
              <div className="flex justify-center gap-4 flex-wrap">
                {["Pouce", "Index", "Majeur", "Annulaire", "Auriculaire"].map((name, i) => (
                  <div key={name} className="flex flex-col items-center gap-2">
                    <div className="w-16 h-20 rounded-2xl border-2 border-rose/30 bg-rose-light/5 nail-glow flex items-center justify-center">
                      <span className="text-[10px] text-rose font-medium">98%</span>
                    </div>
                    <span className="text-xs font-medium text-ink-light/60">{name}</span>
                  </div>
                ))}
              </div>
              {mode === "precision" && (
                <p className="text-xs text-ink-light/30 text-center mt-4">
                  + main droite détectée
                </p>
              )}
            </div>

            <button
              onClick={handleContinue}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-rose text-white rounded-2xl text-lg font-semibold hover:bg-rose-dark transition-all shadow-lg shadow-rose/15"
            >
              Voir l&apos;extraction
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
