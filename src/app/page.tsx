import type { Viewport } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ScanLine,
  PanelsTopLeft,
  ShoppingBag,
  Eye,
  Gem,
  PenTool,
  Layers3,
  Sparkles,
  CircleDot,
  ChevronDown,
} from "lucide-react";
import Logo from "@/components/Logo";
import PageHero, { visualAssets } from "@/components/PageHero";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#101010",
};

export const dynamic = "force-dynamic";

const steps = [
  {
    num: "01",
    title: "Scan",
    subtitle: "Tes mains deviennent des données.",
    description:
      "Une photo de tes mains suffit. L'IA détecte, isole et mesure chacun de tes 10 ongles — largeur, longueur, courbure, orientation.",
    image: visualAssets.yellowHand,
    imageAlt: "Photographie éditoriale d'une main manucurée",
  },
  {
    num: "02",
    title: "Profil",
    subtitle: "Un Nail Profile, pour toujours.",
    description:
      "Ton profil enregistre tes 10 gabarits. Chaque future création s'adaptera à tes dimensions réelles, pas à un modèle générique.",
    image: visualAssets.jewelryHands,
    imageAlt: "Mains ornées de bijoux avec manucure sophistiquée",
  },
  {
    num: "03",
    title: "Création",
    subtitle: "Imagine. L'IA compose.",
    description:
      "Décris une ambiance, importe une inspiration, choisis un style. Le studio IA génère un set de 10 designs cohérents, adapté à ton profil.",
    image: visualAssets.artHands,
    imageAlt: "Mains avec nail art artistique noir et blanc",
  },
  {
    num: "04",
    title: "Essai",
    subtitle: "Regarde tes mains changer.",
    description:
      "Projette chaque design sur tes mains en temps réel. Zoom, compare l'avant/après, ajuste la lumière — puis choisis.",
    image: visualAssets.weddingHands,
    imageAlt: "Mains élégantes avec manucure de mariage",
  },
  {
    num: "05",
    title: "Commande",
    subtitle: "De l'écran à tes doigts.",
    description:
      "Le design est validé, la fabrication vérifiée. Ton set personnalisé part en production avec tes vraies dimensions.",
    image: visualAssets.editorialHands,
    imageAlt: "Mains manucurées avec bijoux et nail art éditorial",
  },
];

const features = [
  {
    icon: ScanLine,
    title: "Scan IA haute précision",
    text: "Détection automatique des 10 ongles, mesure en millimètres, reconnaissance de forme.",
  },
  {
    icon: Layers3,
    title: "Gabarits paramétriques",
    text: "Chaque design existe indépendamment de la taille de l'ongle. Il s'adapte au profil de chaque acheteur.",
  },
  {
    icon: PenTool,
    title: "Studio de création",
    text: "Prompt libre, import d'image, palette de couleurs, styles rapides — tout pour exprimer une intention.",
  },
  {
    icon: Eye,
    title: "Try-On réaliste",
    text: "Visualise le rendu final sur tes mains avant de commander, avec lumière et zoom.",
  },
  {
    icon: Gem,
    title: "Fabrication vérifiée",
    text: "Chaque création passe un contrôle de fabricabilité avant de devenir un vrai produit.",
  },
  {
    icon: PanelsTopLeft,
    title: "Marketplace vivante",
    text: "Publie tes créations, explore celles des autres. Chaque design se réadapte à chaque Nail Profile.",
  },
];

const creators = [
  { name: "Camille Dubois", sets: 12, color: "#e62e6b" },
  { name: "Sofia Chen", sets: 8, color: "#67618f" },
  { name: "Léa Moreau", sets: 5, color: "#b38a4b" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink text-white">
      {/* ── Floating Header ───────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-ink/95 px-6 py-5 backdrop-blur-md sm:px-10 border-b border-white/5">
        <Logo size="sm" dark />
        <nav className="hidden sm:flex items-center gap-6 text-sm text-white/55">
          <a href="#concept" className="hover:text-white transition-colors">Concept</a>
          <a href="#processus" className="hover:text-white transition-colors">Processus</a>
          <a href="#atouts" className="hover:text-white transition-colors">Atouts</a>
          <a href="#communaute" className="hover:text-white transition-colors">Communauté</a>
        </nav>
        <Link
          href="/scan"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-ivory transition-colors"
        >
          Créer mon Nail Profile
        </Link>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
        <video
          src={visualAssets.handVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={visualAssets.blackNails}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/15" />
        <div className="relative z-10 px-6 pb-16 pt-40 sm:px-10 lg:px-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
            Nail Profile — La première plateforme d'ongles sur mesure par IA
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-[5.6rem]">
            Tes ongles.
            <br />
            Ton design.
            <br />
            <span className="text-rose-light">Ton format.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-white/60 sm:text-xl">
            Scanne tes mains. L'IA mesure tes ongles, crée un profil unique et compose
            un set de designs qui s'adaptent exactement à toi.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/scan"
              className="inline-flex items-center gap-2.5 rounded-full bg-rose px-7 py-3.5 text-sm font-semibold text-white hover:bg-rose-dark transition-colors shadow-lg shadow-rose/25"
            >
              Créer mon Nail Profile
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Explorer les créations
            </Link>
          </div>
        </div>
        <a
          href="#concept"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 hover:text-white/60 transition-colors"
        >
          <span className="text-[10px] font-medium tracking-widest uppercase">Découvrir</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </a>
      </section>

      {/* ── CONCEPT ────────────────────────────────────────────────── */}
      <section id="concept" className="relative bg-white text-ink px-6 sm:px-10 lg:px-20 py-24 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose mb-4">Concept</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-semibold leading-[1.04] tracking-[-0.04em]">
              Un ongle n'est pas un écran.
              <br />
              C'est une forme.
            </h2>
            <p className="mt-6 text-lg leading-8 text-ink-light/55 max-w-xl">
              Les outils actuels génèrent des images de nail art. Nail Profile est différent :
              nous créons un modèle numérique de tes vrais ongles, puis chaque design y est
              dessiné directement. Pas de simulacre. Pas d'approximation. Un vrai produit, pensé pour toi.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: "Tes mains",
                title: "Scannées, pas devinées.",
                desc: "L'IA détecte tes 10 ongles, mesure chaque forme en millimètres et enregistre un Nail Profile permanent.",
              },
              {
                label: "Ton design",
                title: "Composé pour toi.",
                desc: "Chaque set est généré doigt par doigt, en respectant la cohérence artistique ET tes dimensions réelles.",
              },
              {
                label: "Ton format",
                title: "Adapté à tous les profils.",
                desc: "Une même création devient 10 versions différentes selon le Nail Profile. C'est du paramétrique, pas du copier-coller.",
              },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl border border-line bg-ivory p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose mb-3">{card.label}</p>
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-sm leading-6 text-ink-light/50">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESSUS ──────────────────────────────────────────────── */}
      <section id="processus" className="bg-ivory text-ink px-6 sm:px-10 lg:px-20 py-24 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose mb-4">Processus</p>
            <h2 className="text-4xl sm:text-5xl font-semibold leading-[1.04] tracking-[-0.04em]">
              De la photo à la commande,
              <br />
              en cinq étapes.
            </h2>
          </div>

          <div className="space-y-20">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 === 1 ? "lg:direction-rtl" : ""}`}
              >
                <div className={i % 2 === 1 ? "lg:order-2 lg:direction-ltr" : "lg:direction-ltr"}>
                  <span className="text-5xl font-light text-ink/10">{step.num}</span>
                  <h3 className="mt-2 text-2xl sm:text-3xl font-semibold">{step.subtitle}</h3>
                  <p className="mt-3 text-base leading-7 text-ink-light/55 max-w-md">{step.description}</p>
                </div>
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                  <img
                    src={step.image}
                    alt={step.imageAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ATOUTS ─────────────────────────────────────────────────── */}
      <section id="atouts" className="bg-white text-ink px-6 sm:px-10 lg:px-20 py-24 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose mb-4">Atouts</p>
          <h2 className="text-4xl sm:text-5xl font-semibold leading-[1.04] tracking-[-0.04em] max-w-xl mb-14">
            Un produit. Pas un gadget.
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-2xl border border-line bg-ivory p-6 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl bg-ink flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold">{f.title}</h3>
                  <p className="text-sm leading-6 text-ink-light/50">{f.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── VISUAL BREAK ───────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[420px] overflow-hidden">
        <img
          src={visualAssets.blueNails}
          alt="Manucure bleue en gros plan"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-ink/25" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <h2 className="max-w-3xl text-4xl sm:text-5xl lg:text-[3.6rem] font-semibold leading-[1.04] tracking-[-0.04em] text-white">
            L'ongle devient une surface de création.
            <br />
            Pas un accessoire.
          </h2>
        </div>
      </section>

      {/* ── COMMUNAUTE ─────────────────────────────────────────────── */}
      <section id="communaute" className="bg-white text-ink px-6 sm:px-10 lg:px-20 py-24 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose mb-4">Communauté</p>
              <h2 className="text-4xl sm:text-5xl font-semibold leading-[1.04] tracking-[-0.04em]">
                Crée. Publie.
                <br />
                Partage.
              </h2>
              <p className="mt-6 text-lg leading-8 text-ink-light/55 max-w-md">
                Chaque création peut devenir publique. Chaque créateur peut recevoir des commandes.
                Et chaque design s'adapte au Nail Profile de chaque acheteur — c'est un produit
                paramétrique, pas une simple image.
              </p>
              <div className="mt-8 flex items-center gap-3">
                {creators.map((c) => (
                  <div key={c.name} className="flex items-center gap-2.5 rounded-full border border-line py-1.5 pl-1.5 pr-4">
                    <div className="w-7 h-7 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-xs font-medium">{c.name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-3">
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-light transition-colors"
                >
                  Explorer les créations
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/creator"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 text-sm font-medium text-ink hover:bg-ivory transition-colors"
                >
                  Devenir créateur
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
              <img
                src={visualAssets.festiveHands}
                alt="Mains avec manucure festive et créative"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={visualAssets.weddingHands}
            alt="Mains avec manucure élégante"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-ink/70" />
        </div>
        <div className="relative z-10 px-6 sm:px-10 lg:px-20 py-24 lg:py-32 text-center">
          <h2 className="mx-auto max-w-3xl text-4xl sm:text-5xl lg:text-[3.6rem] font-semibold leading-[1.04] tracking-[-0.04em] text-white">
            Tu as déjà tes mains.
            <br />
            Il ne manque que ton design.
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-lg leading-8 text-white/55">
            Crée ton Nail Profile en trente secondes, puis laisse l'IA composer un set de designs
            qui n'existe que pour toi.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/scan"
              className="inline-flex items-center gap-2.5 rounded-full bg-rose px-8 py-4 text-base font-semibold text-white hover:bg-rose-dark transition-colors shadow-lg shadow-rose/25"
            >
              Créer mon Nail Profile
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/25 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Explorer la marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="bg-ink border-t border-white/10 px-6 sm:px-10 lg:px-20 py-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Logo size="sm" dark />
          <div className="flex flex-wrap gap-6 text-sm text-white/35">
            <Link href="/explore" className="hover:text-white transition-colors">Marketplace</Link>
            <Link href="/creator" className="hover:text-white transition-colors">Créateurs</Link>
            <Link href="/profile" className="hover:text-white transition-colors">Profil</Link>
            <Link href="/orders" className="hover:text-white transition-colors">Commandes</Link>
          </div>
          <p className="text-xs text-white/20">© NAIL PROFILE 2026</p>
        </div>
      </footer>
    </div>
  );
}
