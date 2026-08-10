"use client";

import type { PatternKind } from "@/lib/catalog-generator";

/**
 * Renders a single nail design as a layered CSS pattern.
 * Each pattern is a self-contained inline SVG / CSS background, so the design
 * is visually distinct beyond just a flat gradient.
 */

type Props = {
  pattern: PatternKind;
  colors: [string, string, string];
  className?: string;
  shape?: "thumb" | "other";
};

const SHAPE_RADIUS = {
  thumb: "40% 40% 35% 35% / 30% 30% 45% 45%",
  other: "50% 50% 40% 40% / 30% 30% 45% 45%",
};

export default function DesignPattern({ pattern, colors, className = "", shape = "other" }: Props) {
  const [c1, c2, c3] = colors;
  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{
        background: baseBackground(pattern, c1, c2, c3),
        borderRadius: SHAPE_RADIUS[shape],
      }}
    >
      {renderPatternOverlay(pattern, c1, c2, c3)}
      {/* Subtle glossy highlight on top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 50%)",
        }}
      />
    </div>
  );
}

function baseBackground(pattern: PatternKind, c1: string, c2: string, c3: string): string {
  switch (pattern) {
    case "solid":
      return c1;
    case "gradient":
    case "ombre-vertical":
      return `linear-gradient(180deg, ${c2} 0%, ${c1} 50%, ${c3} 100%)`;
    case "ombre-horizontal":
      return `linear-gradient(90deg, ${c2} 0%, ${c1} 50%, ${c3} 100%)`;
    case "ombre-radial":
      return `radial-gradient(circle at 30% 30%, ${c2} 0%, ${c1} 50%, ${c3} 100%)`;
    case "french-classic":
      return `linear-gradient(180deg, ${c1} 0% 75%, ${c2} 75% 100%)`;
    case "french-modern":
      return `linear-gradient(165deg, ${c1} 0% 60%, ${c2} 60% 100%)`;
    case "french-double":
      return `linear-gradient(180deg, ${c1} 0% 70%, ${c2} 70% 82%, ${c3} 82% 100%)`;
    case "glitter-dust":
      return `linear-gradient(135deg, ${c1}, ${c2}), radial-gradient(circle, white 0.5px, transparent 1px)`;
    case "glitter-chunky":
      return `linear-gradient(135deg, ${c1}, ${c2}), radial-gradient(circle, white 1.5px, transparent 2px)`;
    case "chrome-mirror":
      return `linear-gradient(135deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`;
    case "chrome-holographic":
      return `conic-gradient(from 45deg at 50% 50%, ${c1}, ${c2}, ${c3}, ${c1})`;
    case "matte-velvet":
      return c1;
    default:
      return `linear-gradient(135deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`;
  }
}

function renderPatternOverlay(pattern: PatternKind, c1: string, c2: string, c3: string) {
  switch (pattern) {
    case "chevron":
      return <ChevronPattern c1={c1} c2={c2} c3={c3} />;
    case "stripes":
      return <StripesPattern c1={c1} c2={c2} />;
    case "dots":
      return <DotsPattern c1={c1} c2={c2} />;
    case "grid":
      return <GridPattern c1={c1} c2={c2} />;
    case "checker":
      return <CheckerPattern c1={c1} c2={c2} />;
    case "wave":
      return <WavePattern c1={c1} c2={c2} />;
    case "diamond":
      return <DiamondPattern c1={c1} c2={c2} />;
    case "tribal":
      return <TribalPattern c1={c1} c2={c2} />;
    case "florals":
      return <FloralsPattern c1={c1} c2={c2} />;
    case "starburst":
      return <StarburstPattern c1={c1} c2={c2} />;
    case "constellation":
      return <ConstellationPattern c1={c1} c2={c2} />;
    case "marble":
      return <MarblePattern c1={c1} c2={c2} c3={c3} />;
    case "watercolor":
      return <WatercolorPattern c1={c1} c2={c2} />;
    case "halftone":
      return <HalftonePattern c1={c1} c2={c2} />;
    case "circuit":
      return <CircuitPattern c1={c1} c2={c2} />;
    case "leopard":
      return <LeopardPattern c1={c1} c2={c2} />;
    case "honeycomb":
      return <HoneycombPattern c1={c1} c2={c2} />;
    case "herringbone":
      return <HerringbonePattern c1={c1} c2={c2} />;
    case "psychedelic":
      return <PsychedelicPattern c1={c1} c2={c2} c3={c3} />;
    case "ascii":
      return <AsciiPattern c1={c1} c2={c2} />;
    case "splatter":
      return <SplatterPattern c1={c1} c2={c2} c3={c3} />;
    case "swirl":
      return <SwirlPattern c1={c1} c2={c2} />;
    case "negative-space":
      return <NegativeSpacePattern c1={c1} c2={c2} />;
    default:
      return null;
  }
}

/* ---------- Patterns SVG inline ---------- */

function ChevronPattern({ c1, c2, c3 }: { c1: string; c2: string; c3: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <pattern id="chev" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 10 L10 0 L20 10 L10 20 Z" fill={c2} opacity="0.55" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#chev)" />
    </svg>
  );
}

function StripesPattern({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <pattern id="stripes" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="12" fill={c2} opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#stripes)" />
    </svg>
  );
}

function DotsPattern({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="2" fill={c2} opacity="0.7" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#dots)" />
    </svg>
  );
}

function GridPattern({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <pattern id="grid" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M 14 0 L 0 0 0 14" fill="none" stroke={c2} strokeWidth="0.6" opacity="0.7" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#grid)" />
    </svg>
  );
}

function CheckerPattern({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <pattern id="check" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill={c2} opacity="0.6" />
          <rect x="8" y="8" width="8" height="8" fill={c2} opacity="0.6" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#check)" />
    </svg>
  );
}

function WavePattern({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path
        d="M 0 50 Q 25 20 50 50 T 100 50"
        stroke={c2}
        strokeWidth="2.5"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M 0 65 Q 25 35 50 65 T 100 65"
        stroke={c2}
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M 0 80 Q 25 50 50 80 T 100 80"
        stroke={c2}
        strokeWidth="1.5"
        fill="none"
        opacity="0.35"
      />
    </svg>
  );
}

function DiamondPattern({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <pattern id="dia" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M 11 0 L 22 11 L 11 22 L 0 11 Z" fill="none" stroke={c2} strokeWidth="1.2" opacity="0.7" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#dia)" />
    </svg>
  );
}

function TribalPattern({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <g stroke={c2} strokeWidth="1.5" fill="none" opacity="0.75">
        <path d="M 10 50 L 30 30 L 50 50 L 70 30 L 90 50" />
        <path d="M 10 65 L 30 85 L 50 65 L 70 85 L 90 65" />
        <circle cx="20" cy="20" r="2" fill={c2} />
        <circle cx="50" cy="50" r="2" fill={c2} />
        <circle cx="80" cy="20" r="2" fill={c2} />
        <circle cx="35" cy="78" r="2" fill={c2} />
        <circle cx="65" cy="78" r="2" fill={c2} />
      </g>
    </svg>
  );
}

function FloralsPattern({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <g fill={c2} opacity="0.7">
        {[20, 50, 80].map((cx) =>
          [20, 50, 80].map((cy) => (
            <g key={`${cx}-${cy}`} transform={`translate(${cx} ${cy})`}>
              <circle cx="-4" cy="0" r="3" />
              <circle cx="4" cy="0" r="3" />
              <circle cx="0" cy="-4" r="3" />
              <circle cx="0" cy="4" r="3" />
              <circle cx="0" cy="0" r="2" />
            </g>
          ))
        )}
      </g>
    </svg>
  );
}

function StarburstPattern({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <g transform="translate(50 50)" fill={c2} opacity="0.8">
        <g>
          {Array.from({ length: 12 }).map((_, i) => (
            <rect
              key={i}
              x="-1"
              y="-40"
              width="2"
              height="20"
              transform={`rotate(${i * 30})`}
            />
          ))}
        </g>
        <circle r="6" />
      </g>
    </svg>
  );
}

function ConstellationPattern({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <g stroke={c2} strokeWidth="0.5" fill={c2} opacity="0.85">
        <line x1="20" y1="20" x2="50" y2="40" />
        <line x1="50" y1="40" x2="80" y2="25" />
        <line x1="50" y1="40" x2="65" y2="70" />
        <line x1="65" y1="70" x2="20" y2="80" />
        <circle cx="20" cy="20" r="1.8" />
        <circle cx="50" cy="40" r="2.2" />
        <circle cx="80" cy="25" r="1.6" />
        <circle cx="65" cy="70" r="2" />
        <circle cx="20" cy="80" r="1.5" />
        <circle cx="40" cy="60" r="1" />
        <circle cx="85" cy="65" r="1" />
      </g>
    </svg>
  );
}

function MarblePattern({ c1, c2, c3 }: { c1: string; c2: string; c3: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <g fill="none" stroke={c2} strokeWidth="1" opacity="0.5">
        <path d="M 0 30 Q 30 20 60 40 T 100 30" />
        <path d="M 0 50 Q 40 60 70 50 T 100 60" />
        <path d="M 0 75 Q 20 80 50 70 T 100 80" />
      </g>
      <g fill={c3} opacity="0.25">
        <ellipse cx="30" cy="40" rx="20" ry="8" />
        <ellipse cx="70" cy="65" rx="15" ry="6" />
      </g>
    </svg>
  );
}

function WatercolorPattern({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <g opacity="0.55">
        <ellipse cx="30" cy="40" rx="28" ry="20" fill={c2} />
        <ellipse cx="65" cy="60" rx="22" ry="18" fill={c2} opacity="0.7" />
        <ellipse cx="50" cy="30" rx="15" ry="10" fill={c2} opacity="0.5" />
      </g>
    </svg>
  );
}

function HalftonePattern({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <radialGradient id="htgrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c2} stopOpacity="0.9" />
          <stop offset="100%" stopColor={c2} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#htgrad)" />
    </svg>
  );
}

function CircuitPattern({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <g stroke={c2} strokeWidth="0.6" fill="none" opacity="0.75">
        <path d="M 10 20 L 40 20 L 40 50 L 70 50" />
        <path d="M 30 70 L 60 70 L 60 30 L 90 30" />
        <path d="M 10 80 L 25 80 L 25 60" />
        <circle cx="40" cy="20" r="2" fill={c2} />
        <circle cx="70" cy="50" r="2" fill={c2} />
        <circle cx="60" cy="30" r="2" fill={c2} />
        <circle cx="25" cy="60" r="2" fill={c2} />
        <rect x="35" y="65" width="6" height="6" fill="none" stroke={c2} />
        <rect x="80" y="65" width="6" height="6" fill="none" stroke={c2} />
      </g>
    </svg>
  );
}

function LeopardPattern({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <g fill={c2} opacity="0.75">
        <ellipse cx="20" cy="25" rx="6" ry="4" transform="rotate(20 20 25)" />
        <ellipse cx="55" cy="20" rx="5" ry="3.5" transform="rotate(-15 55 20)" />
        <ellipse cx="80" cy="40" rx="6" ry="4" transform="rotate(30 80 40)" />
        <ellipse cx="25" cy="55" rx="5" ry="3.5" transform="rotate(10 25 55)" />
        <ellipse cx="60" cy="65" rx="6" ry="4" transform="rotate(-25 60 65)" />
        <ellipse cx="40" cy="80" rx="5" ry="3.5" transform="rotate(15 40 80)" />
        <ellipse cx="85" cy="80" rx="5" ry="3.5" transform="rotate(-20 85 80)" />
      </g>
    </svg>
  );
}

function HoneycombPattern({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <pattern id="honey" width="14" height="12" patternUnits="userSpaceOnUse">
          <polygon points="7,0 14,4 14,8 7,12 0,8 0,4" fill="none" stroke={c2} strokeWidth="0.8" opacity="0.7" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#honey)" />
    </svg>
  );
}

function HerringbonePattern({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <pattern id="herring" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect x="0" y="6" width="14" height="3" fill={c2} opacity="0.65" transform="rotate(45)" />
          <rect x="6" y="14" width="14" height="3" fill={c2} opacity="0.65" transform="rotate(-45)" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#herring)" />
    </svg>
  );
}

function PsychedelicPattern({ c1, c2, c3 }: { c1: string; c2: string; c3: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <radialGradient id="psy1" cx="30%" cy="30%" r="40%">
          <stop offset="0%" stopColor={c2} stopOpacity="0.8" />
          <stop offset="100%" stopColor={c2} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="psy2" cx="70%" cy="60%" r="40%">
          <stop offset="0%" stopColor={c3} stopOpacity="0.8" />
          <stop offset="100%" stopColor={c3} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#psy1)" />
      <rect width="100" height="100" fill="url(#psy2)" />
    </svg>
  );
}

function AsciiPattern({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <g fill={c2} opacity="0.5" fontFamily="monospace" fontSize="6" textAnchor="middle">
        {Array.from({ length: 10 }).map((_, row) =>
          Array.from({ length: 10 }).map((_, col) => {
            const chars = ["01", "10", "11", "0", "1"];
            const char = chars[(row * 10 + col) % chars.length];
            return (
              <text key={`${row}-${col}`} x={col * 10 + 5} y={row * 10 + 8}>
                {char}
              </text>
            );
          })
        )}
      </g>
    </svg>
  );
}

function SplatterPattern({ c1, c2, c3 }: { c1: string; c2: string; c3: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <g>
        <circle cx="20" cy="25" r="3" fill={c2} opacity="0.8" />
        <circle cx="75" cy="20" r="2" fill={c3} opacity="0.7" />
        <circle cx="55" cy="50" r="4" fill={c2} opacity="0.6" />
        <circle cx="30" cy="70" r="2.5" fill={c3} opacity="0.8" />
        <circle cx="80" cy="75" r="3" fill={c2} opacity="0.7" />
        <circle cx="15" cy="55" r="1.5" fill={c3} opacity="0.6" />
        <circle cx="65" cy="30" r="1" fill={c2} opacity="0.5" />
      </g>
    </svg>
  );
}

function SwirlPattern({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <g fill="none" stroke={c2} strokeWidth="1.5" opacity="0.7">
        <path d="M 50 20 Q 70 35 65 55 Q 60 75 40 75 Q 20 70 25 50 Q 30 35 50 40" />
        <path d="M 50 30 Q 60 40 55 55 Q 50 70 35 65 Q 25 60 30 50 Q 35 40 50 45" />
      </g>
    </svg>
  );
}

function NegativeSpacePattern({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <line x1="20" y1="80" x2="80" y2="20" stroke={c2} strokeWidth="2" opacity="0.85" />
      <circle cx="50" cy="50" r="12" fill="none" stroke={c2} strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
}
