"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import PageHero, { visualAssets } from "@/components/PageHero";
import {
  ScanLine,
  Upload,
  Camera,
  ArrowRight,
  Palette,
  ChevronLeft,
  Zap,
  Minus,
  CircleDot,
  Orbit,
  Layers3,
  Flower2,
  Moon,
  Candy,
  PanelsTopLeft,
  Leaf,
  Gem,
  PenTool,
  Shapes,
  Activity,
} from "lucide-react";
import Link from "next/link";

const quickStyles = [
  { id: "minimal", label: "Minimal", icon: Minus },
  { id: "french", label: "French", icon: CircleDot },
  { id: "chrome", label: "Chrome", icon: Orbit },
  { id: "luxury", label: "Luxury", icon: Gem },
  { id: "floral", label: "Floral", icon: Flower2 },
  { id: "gothic", label: "Gothic", icon: Moon },
  { id: "kawaii", label: "Kawaii", icon: Candy },
  { id: "y2k", label: "Y2K", icon: PanelsTopLeft },
  { id: "nature", label: "Nature", icon: Leaf },
  { id: "wedding", label: "Wedding", icon: Gem },
  { id: "art", label: "Art", icon: PenTool },
  { id: "abstract", label: "Abstract", icon: Shapes },
];

type GeneratedNail = {
  finger: string;
  image?: string;
  swatch?: string;
  finish?: string;
};

type GeneratedSet = {
  name: string;
  nails: GeneratedNail[];
  mode?: "ai" | "fallback";
  reason?: string;
};

const DEFAULT_FINGERS = [
  "thumb_left", "index_left", "middle_left", "ring_left", "pinky_left",
  "thumb_right", "index_right", "middle_right", "ring_right", "pinky_right",
];

export default function CreatePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [inspirationName, setInspirationName] = useState<string | null>(null);
  const [step, setStep] = useState<"prompt" | "generating" | "result">("prompt");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() && !selectedStyle) return;
    setError(null);
    setStep("generating");

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: selectedStyle,
          nailProfile: {
            skinTone: "neutral warm",
            nails: DEFAULT_FINGERS.map((finger) => ({
              finger,
              width: 14,
              length: 12,
              shape: "almond" as const,
            })),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`AI service responded with ${response.status}`);
      }

      const data = (await response.json()) as GeneratedSet & { mode: "ai" | "fallback" };
      const enriched: GeneratedSet = {
        ...data,
        nails: data.nails.length > 0
          ? data.nails
          : DEFAULT_FINGERS.map((finger) => ({
              finger,
              swatch: "hsl(0, 0%, 50%)",
            })),
      };

      try {
        sessionStorage.setItem("generatedSet", JSON.stringify(enriched));
      } catch {
        // sessionStorage peut être plein / désactivé — on continue sans persister
      }

      setStep("result");
      router.push("/create/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "La génération a échoué");
      setStep("prompt");
    }
  };

  return (
    <AppShell>
      <PageHero
        eyebrow="CREATE / 01"
        title="Imagine ton set."
        description="Raconte une ambiance, une matière, une lumière. L'IA transforme ton intention en dix designs qui respectent ton profil."
        image={visualAssets.artHands}
        imageAlt="Mains avec nail art artistique noir et blanc"
        label="Studio de création"
        meta="Prompt naturel + inspiration"
        compact
      />
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 hover:bg-soft-gray rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-xs text-rose font-semibold uppercase tracking-widest">Créer</p>
            <h1 className="text-2xl font-bold text-ink">AI Design Studio</h1>
          </div>
        </div>

        {/* Prompt Area */}
        <div className="rounded-3xl bg-white border border-soft-gray/50 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-1">Imagine ton set.</h2>
          <p className="text-sm text-ink-light/40 mb-4">
            Décris le design que tu souhaites. L&apos;IA va créer un set de 10 ongles adaptés à ton Nail Profile.
          </p>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Je veux un design inspiré d'un coucher de soleil sur la mer, élégant, bleu nuit, corail et quelques détails dorés. Les cinq ongles doivent être différents mais appartenir au même univers."
            className="w-full h-32 p-4 rounded-2xl border border-soft-gray/80 bg-ivory/50 text-ink placeholder:text-ink-light/25 resize-none focus:outline-none focus:border-rose/30 focus:ring-4 focus:ring-rose/5 transition-all text-sm leading-relaxed"
          />
        </div>

        {/* Quick Styles */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-ink-light/60 mb-3">Styles rapides</h3>
          <div className="flex flex-wrap gap-2">
            {quickStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(selectedStyle === style.id ? null : style.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedStyle === style.id
                    ? "bg-rose text-white shadow-md shadow-rose/15"
                    : "bg-white border border-soft-gray/80 text-ink-light/60 hover:border-ink/15"
                }`}
              >
                <style.icon className="w-3.5 h-3.5" />
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inspiration Import */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-ink-light/60 mb-3">Importer une inspiration</h3>
          <div className="flex gap-3">
            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-dashed border-soft-gray/80 rounded-xl text-sm font-medium text-ink-light/50 hover:border-ink/15 transition-all cursor-pointer">
              <Upload className="w-4 h-4" />
              Importer une image
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => setInspirationName(event.target.files?.[0]?.name ?? null)}
              />
            </label>
            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-dashed border-soft-gray/80 rounded-xl text-sm font-medium text-ink-light/50 hover:border-ink/15 transition-all cursor-pointer">
              <Camera className="w-4 h-4" />
              Prendre une photo
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={(event) => setInspirationName(event.target.files?.[0]?.name ?? null)}
              />
            </label>
            <button
              type="button"
              onClick={() => setInspirationName("Palette personnalisée")}
              className={`flex items-center justify-center gap-2 px-4 py-3 bg-white border border-dashed rounded-xl text-sm font-medium transition-all ${
                inspirationName === "Palette personnalisée"
                  ? "border-rose text-rose"
                  : "border-soft-gray/80 text-ink-light/50 hover:border-ink/15"
              }`}
              aria-label="Choisir une palette"
            >
              <Palette className="w-4 h-4" />
            </button>
          </div>
          {inspirationName && (
            <p className="text-xs text-rose mt-3">Inspiration sélectionnée : {inspirationName}</p>
          )}
        </div>

        {/* AI Assistant hint */}
        <div className="rounded-2xl bg-rose-light/5 border border-rose-light/20 p-4 mb-6 flex items-start gap-3">
          <Zap className="w-4 h-4 text-rose mt-0.5 flex-shrink-0" />
          <p className="text-xs text-ink-light/50 leading-relaxed">
            <span className="font-medium text-rose">Astuce IA :</span> Tu peux décrire une ambiance, une palette de couleurs, une texture, un thème, ou même coller le lien d&apos;une image. L&apos;IA comprend le langage naturel.
          </p>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() && !selectedStyle}
          className={`w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl text-lg font-semibold transition-all ${
            prompt.trim() || selectedStyle
              ? "bg-rose text-white hover:bg-rose-dark shadow-lg shadow-rose/15"
              : "bg-ink/5 text-ink-light/30 cursor-not-allowed"
          }`}
        >
          <ScanLine className="w-5 h-5" />
          Créer mon design
        </button>

        {error && (
          <p className="mt-4 text-sm text-rose text-center">{error}</p>
        )}

        {/* Generating state */}
        {step === "generating" && (
          <div className="fixed inset-0 bg-ivory/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center animate-fade-in-up">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-rose-light/30 animate-ping" />
                <div className="absolute inset-2 rounded-full border-4 border-rose animate-spin border-t-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity className="w-8 h-8 text-rose animate-pulse-soft" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2">L&apos;IA imagine ton set…</h2>
              <p className="text-sm text-ink-light/40">Création des 10 designs adaptés à tes ongles.</p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
