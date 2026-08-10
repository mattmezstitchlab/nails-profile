"use client";

import { useEffect, useRef, useState } from "react";
import {
  Brush,
  Eraser,
  Pipette,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Star,
  Sparkles,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Save,
  PaintBucket,
  Plus,
  Minus,
} from "lucide-react";

/**
 * AIME® Nail Studio — interactive nail design canvas.
 *
 * Each nail is rendered as a canvas with a real nail-shaped clip region
 * (different shapes per finger: thumb is wide and squared, pinky is
 * narrow and oval, etc.). Every drawing operation is clipped to the
 * nail shape so the user can never paint outside the nail.
 *
 * Tools: brush, eraser, fill bucket, shape (drag-to-draw), pattern
 * overlay. Per-nail undo/redo history. Save serialises the 10 nails
 * to sessionStorage and routes to /create/result?source=studio.
 */

const CANVAS_W = 320;
const CANVAS_H = 400;
const MAX_HISTORY = 30;

type FingerId =
  | "thumb_left" | "index_left" | "middle_left" | "ring_left" | "pinky_left"
  | "thumb_right" | "index_right" | "middle_right" | "ring_right" | "pinky_right";

type FingerKind = "thumb" | "index" | "middle" | "ring" | "pinky";
type HandKind = "left" | "right";

const FINGERS: Array<{ id: FingerId; label: string; kind: FingerKind; hand: HandKind }> = [
  { id: "thumb_left", label: "Pouce G", kind: "thumb", hand: "left" },
  { id: "index_left", label: "Index G", kind: "index", hand: "left" },
  { id: "middle_left", label: "Majeur G", kind: "middle", hand: "left" },
  { id: "ring_left", label: "Annulaire G", kind: "ring", hand: "left" },
  { id: "pinky_left", label: "Auriculaire G", kind: "pinky", hand: "left" },
  { id: "thumb_right", label: "Pouce D", kind: "thumb", hand: "right" },
  { id: "index_right", label: "Index D", kind: "index", hand: "right" },
  { id: "middle_right", label: "Majeur D", kind: "middle", hand: "right" },
  { id: "ring_right", label: "Annulaire D", kind: "ring", hand: "right" },
  { id: "pinky_right", label: "Auriculaire D", kind: "pinky", hand: "right" },
];

/**
 * Per-kind nail shape definition, in canvas units.
 * Each shape is a closed path approximating the silhouette of that
 * fingernail when viewed from above.
 *
 *  - thumb:  wide, slightly squared top, very rounded bottom
 *  - index:  medium width, almond-leaning, rounded top
 *  - middle: longest + slightly narrower, almond
 *  - ring:   similar to middle, slightly shorter
 *  - pinky:  narrow, more rounded (almost circular)
 */
type Shape = { x: number; y: number; w: number; h: number; topRadius: number; bottomRadius: number };
const SHAPES: Record<FingerKind, Shape> = {
  thumb: { x: 30, y: 30, w: 260, h: 340, topRadius: 60, bottomRadius: 130 },
  index: { x: 70, y: 25, w: 180, h: 350, topRadius: 80, bottomRadius: 90 },
  middle: { x: 80, y: 20, w: 160, h: 360, topRadius: 70, bottomRadius: 80 },
  ring: { x: 75, y: 30, w: 170, h: 340, topRadius: 75, bottomRadius: 85 },
  pinky: { x: 95, y: 60, w: 130, h: 280, topRadius: 60, bottomRadius: 65 },
};

/** Position offset within the canvas to render the "10 nail" preview thumbnails.
    For the active finger, we draw it slightly larger. */
function shapeOf(id: FingerId): Shape {
  const f = FINGERS.find((x) => x.id === id);
  return f ? SHAPES[f.kind] : SHAPES.index;
}

const PALETTE_PRESETS = [
  ["#0a0a0a", "#ffffff", "#e62e6b", "#f7c7d7"],
  ["#d4af37", "#cd7f32", "#c0c0c0", "#1f1f1f"],
  ["#1e88e5", "#0d47a1", "#40e0d0", "#00bcd4"],
  ["#2d6a4f", "#b8e6c8", "#fff099", "#ffd700"],
  ["#6a0dad", "#b39ddb", "#e91e63", "#ff7f50"],
  ["#e8c4a0", "#c8a280", "#5d4037", "#3e2723"],
];

const PATTERNS = [
  { id: "none", label: "Aucun" },
  { id: "stripes", label: "Rayures" },
  { id: "dots", label: "Pois" },
  { id: "chevron", label: "Chevron" },
  { id: "grid", label: "Grille" },
  { id: "florals", label: "Fleurs" },
  { id: "stars", label: "Étoiles" },
  { id: "diamond", label: "Losanges" },
  { id: "wave", label: "Vagues" },
];

const SHAPES_TOOLS = [
  { id: "circle", icon: Circle, label: "Cercle" },
  { id: "square", icon: Square, label: "Carré" },
  { id: "triangle", icon: Triangle, label: "Triangle" },
  { id: "hexagon", icon: Hexagon, label: "Hexagone" },
  { id: "star", icon: Star, label: "Étoile" },
] as const;

type Tool = "brush" | "eraser" | "fill" | "shape";

type NailCanvasState = {
  history: ImageData[];
  historyIndex: number;
};

export default function NailStudio() {
  const [activeFinger, setActiveFinger] = useState<FingerId>("index_left");
  const [tool, setTool] = useState<Tool>("brush");
  const [shape, setShape] = useState<typeof SHAPES_TOOLS[number]["id"]>("circle");
  const [color, setColor] = useState("#e62e6b");
  const [brushSize, setBrushSize] = useState(8);
  const [pattern, setPattern] = useState<string>("none");
  const [accentColor, setAccentColor] = useState<string>("#ffffff");
  const [version, setVersion] = useState(0);

  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
  const statesRef = useRef<Record<string, NailCanvasState>>({});
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const shapeStartRef = useRef<{ x: number; y: number } | null>(null);
  const [tick, setTick] = useState(0); // forces undo/redo labels to update

  /* Initialise: light pink background + faint nail outline for each canvas */
  useEffect(() => {
    FINGERS.forEach(({ id, kind }) => {
      const canvas = canvasRefs.current[id];
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      drawInitial(ctx, kind);
      const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      statesRef.current[id] = { history: [snapshot], historyIndex: 0 };
    });
  }, []);

  const state = statesRef.current[activeFinger];
  const canUndo = !!state && state.historyIndex > 0;
  const canRedo = !!state && state.historyIndex < state.history.length - 1;

  function pushHistory() {
    const canvas = canvasRefs.current[activeFinger];
    const s = statesRef.current[activeFinger];
    if (!canvas || !s) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    s.history = s.history.slice(0, s.historyIndex + 1);
    s.history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (s.history.length > MAX_HISTORY) s.history.shift();
    s.historyIndex = s.history.length - 1;
    setVersion((v) => v + 1);
    setTick((t) => t + 1);
  }

  function undo() {
    const canvas = canvasRefs.current[activeFinger];
    const s = statesRef.current[activeFinger];
    if (!canvas || !s || s.historyIndex === 0) return;
    s.historyIndex--;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(s.history[s.historyIndex]!, 0, 0);
    setVersion((v) => v + 1);
    setTick((t) => t + 1);
  }

  function redo() {
    const canvas = canvasRefs.current[activeFinger];
    const s = statesRef.current[activeFinger];
    if (!canvas || !s || s.historyIndex >= s.history.length - 1) return;
    s.historyIndex++;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(s.history[s.historyIndex]!, 0, 0);
    setVersion((v) => v + 1);
    setTick((t) => t + 1);
  }

  function clearNail() {
    const canvas = canvasRefs.current[activeFinger];
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const f = FINGERS.find((x) => x.id === activeFinger)!;
    drawInitial(ctx, f.kind);
    pushHistory();
  }

  function fillNail() {
    const canvas = canvasRefs.current[activeFinger];
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const f = FINGERS.find((x) => x.id === activeFinger)!;
    const shape = SHAPES[f.kind];

    // Fill background outside the nail (so the transparent margin stays clean)
    ctx.save();
    ctx.fillStyle = "#fff5f7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clip to nail shape and fill
    ctx.beginPath();
    nailPath(ctx, shape);
    ctx.clip();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pattern overlay inside the clip
    if (pattern !== "none") {
      drawPattern(ctx, shape, pattern, color, accentColor);
    }
    ctx.restore();

    // Re-draw the outline
    drawInitial(ctx, f.kind);
    pushHistory();
  }

  function applyPatternAll() {
    const canvas = canvasRefs.current[activeFinger];
    if (!canvas || pattern === "none") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const f = FINGERS.find((x) => x.id === activeFinger)!;
    const shape = SHAPES[f.kind];

    ctx.save();
    ctx.beginPath();
    nailPath(ctx, shape);
    ctx.clip();
    drawPattern(ctx, shape, pattern, color, accentColor);
    ctx.restore();

    drawInitial(ctx, f.kind);
    pushHistory();
  }

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    const pos = getPos(e);
    lastPosRef.current = pos;
    shapeStartRef.current = pos;

    if (tool === "fill") {
      fillNail();
      isDrawingRef.current = false;
      return;
    }
    if (tool === "shape") return;

    drawStroke(pos, pos);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return;
    const pos = getPos(e);
    if (tool === "brush" || tool === "eraser") {
      drawStroke(lastPosRef.current ?? pos, pos);
      lastPosRef.current = pos;
    }
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (tool === "shape" && shapeStartRef.current) {
      const start = shapeStartRef.current;
      const end = getPos(e);
      drawShape(start, end);
      shapeStartRef.current = null;
    }
    pushHistory();
  }

  function drawStroke(from: { x: number; y: number }, to: { x: number; y: number }) {
    const canvas = canvasRefs.current[activeFinger];
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const f = FINGERS.find((x) => x.id === activeFinger)!;
    const shape = SHAPES[f.kind];

    ctx.save();
    ctx.beginPath();
    nailPath(ctx, shape);
    ctx.clip();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = tool === "eraser" ? "#fff5f7" : color;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  }

  function drawShape(start: { x: number; y: number }, end: { x: number; y: number }) {
    const canvas = canvasRefs.current[activeFinger];
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const f = FINGERS.find((x) => x.id === activeFinger)!;
    const nailShape = SHAPES[f.kind];

    ctx.save();
    ctx.beginPath();
    nailPath(ctx, nailShape);
    ctx.clip();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    const cx = (start.x + end.x) / 2;
    const cy = (start.y + end.y) / 2;
    const r = Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y)) / 2;
    const shapeId = shape;
    if (shapeId === "circle") {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    } else if (shapeId === "square") {
      ctx.fillRect(start.x, start.y, end.x - start.x, end.y - start.y);
    } else if (shapeId === "triangle") {
      ctx.beginPath();
      ctx.moveTo(cx, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.lineTo(start.x, end.y);
      ctx.closePath();
      ctx.fill();
    } else if (shapeId === "hexagon") {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    } else if (shapeId === "star") {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI / 5) * i - Math.PI / 2;
        const rr = i % 2 === 0 ? r : r * 0.45;
        const x = cx + rr * Math.cos(a);
        const y = cy + rr * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function saveSet() {
    const set = FINGERS.map(({ id, label, kind, hand }) => {
      const canvas = canvasRefs.current[id];
      return { id, label, kind, hand, image: canvas?.toDataURL("image/png") ?? "" };
    });
    try {
      sessionStorage.setItem(
        "studioSet",
        JSON.stringify({
          name: "Set dessiné sur AIME® Studio",
          createdAt: new Date().toISOString(),
          nails: set,
        })
      );
    } catch {
      // ignore
    }
    window.location.href = "/create/result?source=studio";
  }

  function downloadNail() {
    const canvas = canvasRefs.current[activeFinger];
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `aime-${activeFinger}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  const activeFingerMeta = FINGERS.find((f) => f.id === activeFinger)!;
  const activeShape = SHAPES[activeFingerMeta.kind];

  return (
    <div className="rounded-3xl bg-white border border-soft-gray/50 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-soft-gray/30 bg-ivory/40 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <ToolButton active={tool === "brush"} onClick={() => setTool("brush")} icon={Brush} label="Pinceau" />
          <ToolButton active={tool === "eraser"} onClick={() => setTool("eraser")} icon={Eraser} label="Gomme" />
          <ToolButton active={tool === "fill"} onClick={() => setTool("fill")} icon={PaintBucket} label="Remplir" />
          <ToolButton active={tool === "shape"} onClick={() => setTool("shape")} icon={Sparkles} label="Forme" />
          <div className="h-6 w-px bg-soft-gray mx-1" />
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-2 rounded-lg hover:bg-soft-gray/40 disabled:opacity-30 transition-colors"
            aria-label="Annuler"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-2 rounded-lg hover:bg-soft-gray/40 disabled:opacity-30 transition-colors"
            aria-label="Refaire"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            onClick={clearNail}
            className="p-2 rounded-lg hover:bg-soft-gray/40 text-ink-light/60 hover:text-rose transition-colors"
            aria-label="Effacer l'ongle"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="h-6 w-px bg-soft-gray mx-1" />
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setBrushSize((s) => Math.max(1, s - 2))}
              className="p-1.5 rounded hover:bg-soft-gray/40"
              aria-label="Plus fin"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-medium w-10 text-center">{brushSize}px</span>
            <button
              onClick={() => setBrushSize((s) => Math.min(40, s + 2))}
              className="p-1.5 rounded hover:bg-soft-gray/40"
              aria-label="Plus épais"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-[10px] text-ink-light/40 ml-2">Taille du pinceau</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Pipette className="w-3.5 h-3.5 text-ink-light/50" />
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-7 h-7 rounded border border-soft-gray cursor-pointer"
              aria-label="Couleur principale"
            />
            <span className="text-[10px] font-mono text-ink-light/40">Base</span>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-7 h-7 rounded border border-soft-gray cursor-pointer"
              aria-label="Couleur d'accent"
            />
            <span className="text-[10px] font-mono text-ink-light/40">Accent</span>
          </div>
          {PALETTE_PRESETS.map((preset, i) => (
            <div key={i} className="flex gap-1">
              {preset.map((c, idx) => (
                <button
                  key={c}
                  onClick={() => {
                    if (idx === 0) setColor(c);
                    else setAccentColor(c);
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    color.toLowerCase() === c.toLowerCase() || accentColor.toLowerCase() === c.toLowerCase()
                      ? "border-ink"
                      : "border-white shadow-sm"
                  }`}
                  style={{ background: c }}
                  aria-label={`Couleur ${c}`}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-ink-light/50">Motifs :</span>
          {PATTERNS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPattern(p.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                pattern === p.id
                  ? "bg-rose text-white"
                  : "bg-white border border-soft-gray/80 text-ink-light/60 hover:border-ink/15"
              }`}
            >
              {p.label}
            </button>
          ))}
          {pattern !== "none" && (
            <button
              onClick={applyPatternAll}
              className="px-3 py-1 rounded-full text-xs font-medium bg-ink text-white hover:bg-ink-light transition-colors"
            >
              Appliquer le motif
            </button>
          )}
        </div>

        {tool === "shape" && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-ink-light/50">Forme :</span>
            {SHAPES_TOOLS.map((s) => (
              <button
                key={s.id}
                onClick={() => setShape(s.id)}
                className={`p-2 rounded-lg transition-colors ${
                  shape === s.id
                    ? "bg-rose text-white"
                    : "bg-white border border-soft-gray/80 text-ink-light/60 hover:border-ink/15"
                }`}
                aria-label={s.label}
              >
                <s.icon className="w-4 h-4" />
              </button>
            ))}
            <span className="text-[10px] text-ink-light/40 ml-2">Glisser-déposer sur l'ongle</span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-[200px_1fr]">
        <div className="p-3 border-r border-soft-gray/30 bg-ivory/20">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-light/40 mb-2 px-2">
            Ongles
          </p>
          <div className="space-y-1">
            <FingerGroup title="Main Gauche" fingers={FINGERS.slice(0, 5)} active={activeFinger} onSelect={setActiveFinger} />
            <FingerGroup title="Main Droite" fingers={FINGERS.slice(5)} active={activeFinger} onSelect={setActiveFinger} />
          </div>
        </div>

        <div className="p-4 sm:p-6 flex flex-col items-center justify-center bg-gradient-to-b from-ivory to-soft-gray/20 min-h-[500px]">
          <p className="text-xs text-ink-light/40 mb-2">
            Ongle actif :{" "}
            <span className="font-medium text-ink">{activeFingerMeta.label}</span>
            <span className="ml-2 text-[10px] text-ink-light/30">
              (Forme : {activeFingerMeta.kind})
            </span>
          </p>
          <div className="relative">
            <canvas
              ref={(el) => {
                canvasRefs.current[activeFinger] = el;
              }}
              width={CANVAS_W}
              height={CANVAS_H}
              className="rounded-2xl border-2 border-ink/10 shadow-md touch-none"
              style={{ maxWidth: "100%", height: "auto" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            />
            {/* Hidden 2nd canvas overlay to refresh on version changes */}
            <span className="hidden" aria-hidden>{version}</span>
          </div>
          <p className="text-[10px] text-ink-light/30 mt-3 max-w-md text-center">
            Tous les tracés restent automatiquement à l'intérieur de la forme de l'ongle. Pinceau :
            glisser. Remplir : un clic. Forme : glisser-déposer.
          </p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={downloadNail}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-soft-gray text-sm font-medium text-ink-light/70 hover:border-ink/15 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Télécharger cet ongle
            </button>
            <button
              onClick={saveSet}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose text-white text-sm font-semibold hover:bg-rose-dark transition-colors shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              Enregistrer le set
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type Fingers = typeof FINGERS;
type FingerIdReal = Fingers[number]["id"];

function FingerGroup({
  title,
  fingers,
  active,
  onSelect,
}: {
  title: string;
  fingers: readonly { readonly id: FingerIdReal; readonly label: string; readonly kind: FingerKind; readonly hand: HandKind }[];
  active: string;
  onSelect: (id: FingerId) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-light/40 px-2 pt-2 pb-1">
        {title}
      </p>
      {fingers.map((f) => (
        <button
          key={f.id}
          onClick={() => onSelect(f.id)}
          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            active === f.id
              ? "bg-rose/10 text-rose"
              : "text-ink-light/60 hover:bg-soft-gray/30"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

function ToolButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        active ? "bg-ink text-white" : "bg-white border border-soft-gray/80 text-ink-light/60 hover:border-ink/15"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

/* ---------- Shape primitives ---------- */

/**
 * Build the nail path for a given shape, in canvas units.
 * The path goes:
 *   - from top-left corner of the top-rounded area
 *   - to top-right corner
 *   - down the right side
 *   - across the bottom (rounded)
 *   - up the left side
 *   - back to start (top is rounded)
 */
function nailPath(ctx: CanvasRenderingContext2D, s: Shape) {
  const { x, y, w, h, topRadius, bottomRadius } = s;
  const tr = Math.min(topRadius, w / 2);
  const br = Math.min(bottomRadius, w / 2);
  // Start at top-left after the top-left curve
  ctx.moveTo(x, y + tr);
  ctx.quadraticCurveTo(x, y, x + tr, y);
  // Top edge
  ctx.lineTo(x + w - tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
  // Right edge (straight)
  ctx.lineTo(x + w, y + h - br);
  // Bottom curve
  ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
  ctx.lineTo(x + br, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - br);
  ctx.closePath();
}

function drawInitial(ctx: CanvasRenderingContext2D, kind: FingerKind) {
  ctx.save();
  // Background — soft pink outside the nail
  ctx.fillStyle = "#fff5f7";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Subtle nail bed (slightly different from outside)
  ctx.save();
  ctx.beginPath();
  nailPath(ctx, SHAPES[kind]);
  ctx.clip();
  // Inside-clip base (very pale, lets user see the nail area)
  ctx.fillStyle = "#fde8ed";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  // Cuticle line (top horizontal hairline at the very top of the nail)
  ctx.strokeStyle = "rgba(0,0,0,0.18)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(SHAPES[kind].x + 6, SHAPES[kind].y + 1);
  ctx.lineTo(SHAPES[kind].x + SHAPES[kind].w - 6, SHAPES[kind].y + 1);
  ctx.stroke();
  ctx.restore();

  // Outline of the nail
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  nailPath(ctx, SHAPES[kind]);
  ctx.stroke();
  ctx.restore();
}

function drawPattern(
  ctx: CanvasRenderingContext2D,
  s: Shape,
  pattern: string,
  base: string,
  accent: string
) {
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = accent === "#ffffff" || accent === "#fff5f7" ? "#000" : accent;
  ctx.strokeStyle = ctx.fillStyle;

  if (pattern === "stripes") {
    for (let x = -s.h; x < s.w + s.h; x += 16) {
      ctx.save();
      ctx.translate(s.x + s.w / 2, s.y + s.h / 2);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(x, -s.h, 5, s.h * 2);
      ctx.restore();
    }
  } else if (pattern === "dots") {
    for (let x = s.x + 12; x < s.x + s.w; x += 18) {
      for (let y = s.y + 12; y < s.y + s.h; y += 18) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (pattern === "chevron") {
    ctx.lineWidth = 2.5;
    for (let y = s.y; y < s.y + s.h + 20; y += 22) {
      ctx.beginPath();
      ctx.moveTo(s.x, y);
      ctx.lineTo(s.x + s.w / 2, y + 14);
      ctx.lineTo(s.x + s.w, y);
      ctx.stroke();
    }
  } else if (pattern === "grid") {
    ctx.lineWidth = 1.2;
    for (let x = s.x; x < s.x + s.w; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, s.y);
      ctx.lineTo(x, s.y + s.h);
      ctx.stroke();
    }
    for (let y = s.y; y < s.y + s.h; y += 18) {
      ctx.beginPath();
      ctx.moveTo(s.x, y);
      ctx.lineTo(s.x + s.w, y);
      ctx.stroke();
    }
  } else if (pattern === "florals") {
    for (let x = s.x + 24; x < s.x + s.w; x += 38) {
      for (let y = s.y + 24; y < s.y + s.h; y += 38) {
        for (let a = 0; a < 5; a++) {
          const angle = (a * 2 * Math.PI) / 5;
          ctx.beginPath();
          ctx.arc(x + Math.cos(angle) * 4, y + Math.sin(angle) * 4, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (pattern === "stars") {
    for (let x = s.x + 22; x < s.x + s.w; x += 32) {
      for (let y = s.y + 22; y < s.y + s.h; y += 32) {
        drawStar(ctx, x, y, 5, 2.5, 5);
      }
    }
  } else if (pattern === "diamond") {
    for (let x = s.x; x < s.x + s.w + 20; x += 24) {
      for (let y = s.y; y < s.y + s.h + 20; y += 24) {
        ctx.beginPath();
        ctx.moveTo(x, y - 7);
        ctx.lineTo(x + 7, y);
        ctx.lineTo(x, y + 7);
        ctx.lineTo(x - 7, y);
        ctx.closePath();
        ctx.fill();
      }
    }
  } else if (pattern === "wave") {
    ctx.lineWidth = 2.5;
    for (let y = s.y; y < s.y + s.h + 10; y += 20) {
      ctx.beginPath();
      for (let x = s.x; x <= s.x + s.w; x += 4) {
        const yy = y + Math.sin(((x - s.x) / s.w) * Math.PI * 4) * 5;
        if (x === s.x) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  r2: number,
  spikes: number
) {
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const a = (i * Math.PI) / spikes - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r2;
    const x = cx + rr * Math.cos(a);
    const y = cy + rr * Math.sin(a);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}
