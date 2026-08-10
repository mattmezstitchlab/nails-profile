"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHero, { visualAssets } from "@/components/PageHero";
import AppShell from "@/components/AppShell";
import { ChevronLeft, ArrowRight, ScanFace, Ruler, ScanLine, Check, Shield } from "lucide-react";
import Link from "next/link";

type NailData = {
  finger: string;
  label: string;
  width: string;
  height: string;
  shape: string;
  confidence: number;
  orientation: string;
};

const leftHand: NailData[] = [
  { finger: "thumb_left", label: "Pouce G", width: "14.2", height: "18.7", shape: "Almond", confidence: 98, orientation: "0°" },
  { finger: "index_left", label: "Index G", width: "12.8", height: "16.4", shape: "Oval", confidence: 97, orientation: "2°" },
  { finger: "middle_left", label: "Majeur G", width: "13.1", height: "17.2", shape: "Oval", confidence: 96, orientation: "1°" },
  { finger: "ring_left", label: "Annulaire G", width: "11.5", height: "15.8", shape: "Round", confidence: 95, orientation: "3°" },
  { finger: "pinky_left", label: "Auriculaire G", width: "10.2", height: "14.1", shape: "Round", confidence: 94, orientation: "5°" },
];

const rightHand: NailData[] = [
  { finger: "thumb_right", label: "Pouce D", width: "14.5", height: "19.0", shape: "Almond", confidence: 97, orientation: "0°" },
  { finger: "index_right", label: "Index D", width: "13.0", height: "16.6", shape: "Oval", confidence: 96, orientation: "1°" },
  { finger: "middle_right", label: "Majeur D", width: "13.3", height: "17.4", shape: "Oval", confidence: 95, orientation: "2°" },
  { finger: "ring_right", label: "Annulaire D", width: "11.7", height: "16.0", shape: "Round", confidence: 94, orientation: "3°" },
  { finger: "pinky_right", label: "Auriculaire D", width: "10.4", height: "14.3", shape: "Round", confidence: 93, orientation: "6°" },
];

export default function NailProfilePage() {
  const router = useRouter();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <AppShell>
      <PageHero
        eyebrow="PROFILE / 01"
        title="Ton profil est prêt."
        description="Tes dix gabarits deviennent la base permanente de chaque création, de chaque essai et de chaque commande."
        image={visualAssets.jewelryHands}
        imageAlt="Deux mains élégantes ornées de bijoux et d'une manucure moderne"
        label="10 gabarits personnels"
        meta="Adaptation automatique"
        compact
      />
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/scan/extraction" className="p-2 hover:bg-soft-gray rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-xs text-rose font-semibold uppercase tracking-widest">AIME®</p>
            <h1 className="text-2xl font-bold text-ink">Mon AIME®</h1>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
            <Shield className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs font-medium text-green-700">Prêt</span>
          </div>
        </div>

        {/* Success message */}
        <div className={`rounded-3xl bg-white border border-soft-gray/50 p-6 mb-8 transition-all duration-700 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-light/10 flex items-center justify-center flex-shrink-0">
              <ScanFace className="w-6 h-6 text-rose" />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-1">Ton profil est prêt.</h2>
              <p className="text-sm text-ink-light/40 leading-relaxed">
                À partir de maintenant, chaque création peut être adaptée à tes ongles.
                Tes 10 gabarits sont sauvegardés et serviront de base pour tous tes designs.
              </p>
            </div>
          </div>
        </div>

        {/* Left Hand */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ScanLine className="w-4 h-4 text-rose" />
            <h3 className="font-semibold text-ink">Main Gauche</h3>
          </div>
          <div className="rounded-3xl bg-white border border-soft-gray/50 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-soft-gray/30">
              {leftHand.map((nail, i) => (
                <div key={nail.finger} className={`p-4 text-center transition-all duration-500 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="w-14 h-16 mx-auto mb-3 rounded-xl border-2 border-rose/20 bg-rose-light/5 flex items-center justify-center">
                    <span className="text-[10px] text-rose font-medium">{nail.confidence}%</span>
                  </div>
                  <p className="text-xs font-semibold text-ink mb-1">{nail.label}</p>
                  <p className="text-xs text-ink-light/40">
                    {nail.width} × {nail.height} mm
                  </p>
                  <p className="text-xs text-rose font-medium mt-0.5">{nail.shape}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Hand */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <ScanLine className="w-4 h-4 text-rose" />
            <h3 className="font-semibold text-ink">Main Droite</h3>
          </div>
          <div className="rounded-3xl bg-white border border-soft-gray/50 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-soft-gray/30">
              {rightHand.map((nail, i) => (
                <div key={nail.finger} className={`p-4 text-center transition-all duration-500 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: `${(i + 5) * 80}ms` }}>
                  <div className="w-14 h-16 mx-auto mb-3 rounded-xl border-2 border-rose/20 bg-rose-light/5 flex items-center justify-center">
                    <span className="text-[10px] text-rose font-medium">{nail.confidence}%</span>
                  </div>
                  <p className="text-xs font-semibold text-ink mb-1">{nail.label}</p>
                  <p className="text-xs text-ink-light/40">
                    {nail.width} × {nail.height} mm
                  </p>
                  <p className="text-xs text-rose font-medium mt-0.5">{nail.shape}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/canvas")}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-rose text-white rounded-2xl text-lg font-semibold hover:bg-rose-dark transition-all shadow-lg shadow-rose/15"
          >
            Voir mon Nail Canvas
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push("/create")}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white border border-soft-gray/80 rounded-2xl text-base font-medium hover:border-ink/15 transition-all"
          >
            <ScanLine className="w-4 h-4" />
            Créer mon premier design
          </button>
        </div>
      </div>
    </AppShell>
  );
}
