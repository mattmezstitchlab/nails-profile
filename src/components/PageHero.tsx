import type { ReactNode } from "react";
import { ArrowUpRight, ScanLine } from "lucide-react";

export const visualAssets = {
  editorialHands: "/images/hands-editorial.jpg",
  blackNails: "/images/nails-black.jpg",
  artHands: "/images/hands-art.jpg",
  weddingHands: "/images/hands-wedding.jpg",
  yellowHand: "/images/hand-yellow.jpg",
  blueNails: "/images/nails-blue.jpg",
  jewelryHands: "/images/hands-jewelry.jpg",
  festiveHands: "/images/hands-festive.jpg",
  handVideo: "/hand-video.mp4",
};

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  label?: string;
  meta?: string;
  children?: ReactNode;
  compact?: boolean;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  label,
  meta,
  children,
  compact = false,
}: PageHeroProps) {
  return (
    <section className={`mx-auto max-w-6xl px-6 ${compact ? "pt-6 pb-8" : "pt-8 pb-10"}`}>
      <div className="grid overflow-hidden rounded-[2rem] border border-line bg-white lg:grid-cols-[0.92fr_1.08fr]">
        <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
          <div>
            <div className="mb-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-rose">
              <span className="h-1.5 w-1.5 rounded-full bg-rose" />
              {eyebrow}
            </div>
            <h1 className="max-w-xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-ink sm:text-5xl lg:text-[4.2rem]">
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-ink-light/60 sm:text-lg">
              {description}
            </p>
          </div>
          {(children || meta) && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {children}
              {meta && (
                <span className="inline-flex items-center gap-2 text-xs font-medium text-ink-light/45">
                  <ScanLine className="h-4 w-4" />
                  {meta}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="relative min-h-[310px] overflow-hidden bg-ivory-dark sm:min-h-[390px] lg:min-h-[450px]">
          <img
            src={image}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
            loading={compact ? "lazy" : "eager"}
          />
          <div className="absolute inset-0 bg-ink/10" />
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white">
            {label && <span className="rounded-full border border-white/35 bg-ink/35 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">{label}</span>}
            <ArrowUpRight className="ml-auto h-5 w-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
