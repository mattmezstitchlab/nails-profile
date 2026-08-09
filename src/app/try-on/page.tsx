"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import PageHero, { visualAssets } from "@/components/PageHero";
import {
  ChevronLeft,
  ArrowRight,
  Eye,
  EyeOff,
  ShoppingBag,
  Sun,
  Moon,
  Maximize2,
  RotateCw,
} from "lucide-react";
import Link from "next/link";

const leftTones = ["#171717", "#22304a", "#354d69", "#8e2948", "#c4545f"];
const rightTones = ["#22304a", "#354d69", "#171717", "#a94457", "#c18c4c"];

export default function TryOnPage() {
  const [showBefore, setShowBefore] = useState(false);
  const [lighting, setLighting] = useState<"day" | "evening">("day");
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  return (
    <AppShell>
      <PageHero
        eyebrow="TRY-ON / 01"
        title="Voir avant de choisir."
        description="Projette ta création sur tes mains, compare l'avant et l'après, puis ajuste la lumière et le cadrage."
        image={visualAssets.weddingHands}
        imageAlt="Mains élégantes avec manucure de mariage"
        label="Visualisation sur tes mains"
        meta="Avant / après interactif"
        compact
      />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/create/result" className="p-2 hover:bg-soft-gray rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-xs text-rose font-semibold uppercase tracking-widest">Try-On</p>
            <h1 className="text-2xl font-bold text-ink">Voir sur mes mains</h1>
          </div>
        </div>

        <div
          className={`rounded-3xl border border-soft-gray/50 p-8 mb-6 text-center min-h-[400px] flex flex-col items-center justify-center transition-colors duration-500 ${
            lighting === "day" ? "bg-white" : "bg-ink/5"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setShowBefore(false)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                !showBefore ? "bg-rose text-white" : "bg-soft-gray/50 text-ink-light/40"
              }`}
            >
              <Eye className="w-4 h-4 inline mr-1.5" />
              Avec design
            </button>
            <button
              onClick={() => setShowBefore(true)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                showBefore ? "bg-rose text-white" : "bg-soft-gray/50 text-ink-light/40"
              }`}
            >
              <EyeOff className="w-4 h-4 inline mr-1.5" />
              Avant
            </button>
          </div>

          <div
            className="flex justify-center gap-16 items-end perspective-hand mb-8 transition-transform duration-300"
            style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
          >
            {[leftTones, rightTones].map((tones, handIndex) => (
              <div
                key={handIndex}
                className={`relative w-44 h-60 ${handIndex === 1 ? "scale-x-[-1]" : ""}`}
              >
                <div className="absolute inset-0 bg-soft-gray/50 rounded-[30%_30%_20%_20%/25%_25%_40%_40%]" />
                {!showBefore && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col gap-2.5">
                    {tones.map((color, i) => (
                      <div
                        key={color}
                        className="h-7 rounded-full shadow-md mx-auto"
                        style={{
                          width: `${14 - i * 1.2}px`,
                          backgroundColor: color,
                          borderRadius:
                            i === 0
                              ? "40% 40% 30% 30% / 30% 30% 40% 40%"
                              : "50% 50% 35% 35% / 30% 30% 40% 40%",
                        }}
                      />
                    ))}
                  </div>
                )}
                <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-ink-light/30">
                  {handIndex === 0 ? "Gauche" : "Droite"}
                </p>
              </div>
            ))}
          </div>

          <p className="text-sm text-ink-light/40">
            {showBefore ? "Tes mains naturelles" : "SET SUNSET OCEAN sur tes ongles"}
          </p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setLighting(lighting === "day" ? "evening" : "day")}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-soft-gray/80 rounded-xl text-sm font-medium hover:border-ink/15 transition-all"
          >
            {lighting === "day" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {lighting === "day" ? "Lumière du soir" : "Lumière du jour"}
          </button>
          <button
            onClick={() => setZoom((value) => (value >= 1.4 ? 1 : value + 0.2))}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-soft-gray/80 rounded-xl text-sm font-medium hover:border-ink/15 transition-all"
          >
            <Maximize2 className="w-4 h-4" />
            Zoom {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={() => setRotation((value) => (value + 10) % 360)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-soft-gray/80 rounded-xl text-sm font-medium hover:border-ink/15 transition-all"
          >
            <RotateCw className="w-4 h-4" />
            Pivoter {rotation}°
          </button>
        </div>

        <div className="space-y-3">
          <Link
            href="/create/fabricability"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-rose text-white rounded-2xl text-lg font-semibold hover:bg-rose-dark transition-all shadow-lg shadow-rose/15"
          >
            Continuer vers la fabrication
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-ink text-white rounded-2xl text-lg font-semibold hover:bg-ink-light transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Commander directement
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
