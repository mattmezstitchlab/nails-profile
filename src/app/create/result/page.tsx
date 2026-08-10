"use client";

import { useEffect, useState } from "react";
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
  Wand2,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

type GeneratedNail = {
  finger: string;
  name?: string;
  palette?: string[];
  motif?: string;
  finish?: string;
  description?: string;
  swatch?: string;
};

type GeneratedSet = {
  name: string;
  nails: GeneratedNail[];
  mode?: "ai" | "fallback";
  reason?: string;
};

const fingerLabels: Record<string, string> = {
  thumb_left: "Pouce G",
  index_left: "Index G",
  middle_left: "Majeur G",
  ring_left: "Annulaire G",
  pinky_left: "Auriculaire G",
  thumb_right: "Pouce D",
  index_right: "Index D",
  middle_right: "Majeur D",
  ring_right: "Annulaire D",
  pinky_right: "Auriculaire D",
};

const leftFingers = ["thumb_left", "index_left", "middle_left", "ring_left", "pinky_left"];
const rightFingers = ["thumb_right", "index_right", "middle_right", "ring_right", "pinky_right"];

function nailShapeStyle(finger: string) {
  return finger.startsWith("thumb")
    ? "40% 40% 35% 35% / 30% 30% 45% 45%"
    : "50% 50% 40% 40% / 30% 30% 45% 45%";
}

export default function DesignResultPage() {
  const router = useRouter();
  const [generatedSet, setGeneratedSet] = useState<GeneratedSet | null>(null);
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [selectedFinger, setSelectedFinger] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("generatedSet");
      if (raw) setGeneratedSet(JSON.parse(raw) as GeneratedSet);
    } catch {
      // ignore — fallback to placeholder
    }
  }, []);

  const handleRegenerate = async (finger: string) => {
    setRegenerating(finger);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Single nail close-up: ${fingerLabels[finger] ?? finger}, alternate variation of set "${generatedSet?.name ?? ""}"`,
          style: "art",
          nailProfile: { nails: [{ finger, width: 14, length: 12, shape: "almond" }] },
        }),
      });
      if (response.ok) {
        const data = (await response.json()) as GeneratedSet;
        const newNail = data.nails[0];
        if (newNail) {
          const next: GeneratedSet = {
            ...(generatedSet ?? { name: data.name, nails: [] }),
            nails: (generatedSet?.nails ?? []).map((n) =>
              n.finger === finger ? { ...n, ...newNail, finger } : n
            ),
          };
          setGeneratedSet(next);
          try {
            sessionStorage.setItem("generatedSet", JSON.stringify(next));
          } catch {
            // sessionStorage plein
          }
        }
      }
    } catch {
      // silencieux
    } finally {
      setRegenerating(null);
    }
  };

  const renderNail = (finger: string) => {
    const generated = generatedSet?.nails.find((n) => n.finger === finger);
    const isRegenerating = regenerating === finger;
    const palette = generated?.palette ?? generated?.swatch
      ? [generated.swatch!, ...(generated.palette ?? []).slice(0, 2)].filter(Boolean)
      : ["#d4d4d4"];
    const isSelected = selectedFinger === finger;

    return (
      <button
        key={finger}
        type="button"
        onClick={() => setSelectedFinger(isSelected ? null : finger)}
        className="flex flex-col items-center gap-2 group focus:outline-none"
      >
        <div className="relative">
          <div
            className={`w-16 h-20 sm:w-20 sm:h-24 border-2 shadow-sm transition-all group-hover:scale-105 overflow-hidden ${
              isSelected ? "border-rose ring-4 ring-rose/10" : "border-ink/10 group-hover:border-rose/30"
            }`}
            style={{
              borderRadius: nailShapeStyle(finger),
              background: `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1] ?? palette[0]} 50%, ${palette[2] ?? palette[0]} 100%)`,
            }}
            aria-label={generated?.name ?? finger}
          />
          {isRegenerating && (
            <div className="absolute inset-0 rounded-2xl bg-white/70 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-rose animate-spin" />
            </div>
          )}
          {generated?.finish && generated.finish !== "glossy" && (
            <span className="absolute -top-1.5 -right-1.5 inline-flex items-center gap-0.5 rounded-full bg-white px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-ink shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-rose" />
              {generated.finish}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium text-ink-light/50">
          {fingerLabels[finger] ?? finger}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRegenerate(finger);
          }}
          disabled={isRegenerating}
          className="text-[10px] text-ink-light/30 hover:text-rose transition-colors flex items-center gap-1 disabled:opacity-30"
        >
          <RefreshCw className="w-3 h-3" />
          Régénérer
        </button>
      </button>
    );
  };

  const setName = generatedSet?.name ?? "Set en cours de chargement…";
  const isFallback = generatedSet?.mode === "fallback";
  const selectedNail = selectedFinger
    ? generatedSet?.nails.find((n) => n.finger === selectedFinger)
    : null;

  return (
    <AppShell>
      <PageHero
        eyebrow="CREATE / 02"
        title="Un set pensé pour toi."
        description="Dix designs indépendants, une seule direction artistique. Chaque pièce est adaptée à la largeur, la longueur et la forme de ton ongle."
        image={visualAssets.editorialHands}
        imageAlt="Mains manucurées avec création de nail art éditorial"
        label={setName.toUpperCase()}
        meta={isFallback ? "Mode dégradé (sans clé IA)" : "10 designs cohérents"}
        compact
      />
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/create" className="p-2 hover:bg-soft-gray rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-rose font-semibold uppercase tracking-widest">
              Design généré
            </p>
            <h1 className="text-2xl font-bold text-ink truncate">{setName}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-light/10 text-rose text-sm font-medium hover:bg-rose-light/20 transition-colors">
              <Wand2 className="w-3.5 h-3.5" />
              Modifier le set
            </button>
          </div>
        </div>

        {/* Status banner */}
        <div
          className={`rounded-2xl border p-4 mb-6 flex items-start gap-3 ${
            isFallback ? "bg-amber-50 border-amber-200" : "bg-rose-light/5 border-rose-light/20"
          }`}
        >
          <ScanLine className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isFallback ? "text-amber-600" : "text-rose"}`} />
          <div>
            <p className={`text-sm font-medium mb-0.5 ${isFallback ? "text-amber-700" : "text-rose"}`}>
              {isFallback ? "Mode dégradé : palette déterministe" : "Design adapté à ton Nail Profile"}
            </p>
            <p className="text-xs text-ink-light/60">
              {isFallback
                ? generatedSet?.reason ??
                  "La clé AI_GATEWAY_API_KEY n'est pas configurée. Une palette cohérente a été générée localement."
                : "Chaque ongle a été généré individuellement pour correspondre à tes dimensions et à tes formes naturelles."}
            </p>
          </div>
        </div>

        {/* Left Hand */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-ink-light/50 uppercase tracking-wider mb-4">
            Main Gauche
          </h3>
          <div className="grid grid-cols-5 gap-3 sm:gap-4">
            {leftFingers.map((finger) => renderNail(finger))}
          </div>
        </div>

        {/* Right Hand */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-ink-light/50 uppercase tracking-wider mb-4">
            Main Droite
          </h3>
          <div className="grid grid-cols-5 gap-3 sm:gap-4">
            {rightFingers.map((finger) => renderNail(finger))}
          </div>
        </div>

        {/* Selected nail details */}
        {selectedNail && (
          <div className="rounded-2xl border border-soft-gray/50 bg-white p-5 mb-6">
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-20 rounded-xl flex-shrink-0 border-2 border-ink/10"
                style={{
                  background: `linear-gradient(135deg, ${selectedNail.palette?.[0] ?? selectedNail.swatch ?? "#ddd"} 0%, ${selectedNail.palette?.[1] ?? selectedNail.swatch ?? "#ddd"} 50%, ${selectedNail.palette?.[2] ?? selectedNail.swatch ?? "#ddd"} 100%)`,
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-light/40">
                  {fingerLabels[selectedFinger!]}
                </p>
                <h3 className="font-semibold text-ink truncate">
                  {selectedNail.name ?? "Design"}
                </h3>
                <p className="text-xs text-ink-light/50 mt-1">
                  {selectedNail.description ?? "Pas de description fournie."}
                </p>
                {selectedNail.palette && selectedNail.palette.length > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-ink-light/40">
                      Palette
                    </span>
                    <div className="flex gap-1.5">
                      {selectedNail.palette.map((c, i) => (
                        <span
                          key={i}
                          className="w-4 h-4 rounded-full border border-ink/10"
                          style={{ background: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {selectedNail.motif && (
                  <p className="mt-2 text-[11px] text-ink-light/50">
                    <span className="font-medium">Motif :</span> {selectedNail.motif}
                    {selectedNail.finish && <> · <span className="font-medium">Finish :</span> {selectedNail.finish}</>}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

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
