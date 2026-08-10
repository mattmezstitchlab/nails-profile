"use client";

import { useEffect, useRef, useState } from "react";
import {
  Brush,
  Eraser,
  Pipette,
  Layers3,
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
  PipetteIcon,
  PaintBucket,
  Plus,
  Minus,
} from "lucide-react";

/**
 * AIME® Nail Studio — interactive nail design canvas.
 *
 * Architecture:
 * - The user picks one of 10 nails (left/right × thumb/index/middle/ring/pinky)
 * - Each nail has its own HTMLCanvas where the user can paint / erase / apply
 *   motifs / fill with a color.
 * - Tools: brush, eraser, fill bucket, shapes (circle, square, triangle, hex,
 *   star), patterns (chevron, dots, stripes, gradient, etc.), color picker.
 * - Undo/redo per nail (stack of canvas snapshots).
 * - Export: PNG of the whole set, or save as data URL into sessionStorage so
 *   /create/result can display it.
 */

const FINGERS = [
  { id: "thumb_left", label: "Pouce G" },
  { id: "index_left", label: "Index G" },
  { id: "middle_left", label: "Majeur G" },
  { id: "ring_left", label: "Annulaire G" },
  { id: "pinky_left", label: "Auriculaire G" },
  { id: "thumb_right", label: "Pouce D" },
  { id: "index_right", label: "Index D" },
  { id: "middle_right", label: "Majeur D" },
  { id: "ring_right", label: "Annulaire D" },
  { id: "pinky_right", label: "Auriculaire D" },
] as const;

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

const SHAPES = [
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
  const [activeFinger, setActiveFinger] = useState<string>("index_left");
  const [tool, setTool] = useState<Tool>("brush");
  const [shape, setShape] = useState<typeof SHAPES[number]["id"]>("circle");
  const [color, setColor] = useState("#e62e6b");
  const [brushSize, setBrushSize] = useState(6);
  const [pattern, setPattern] = useState<string>("none");

  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
  const statesRef = useRef<Record<string, NailCanvasState>>({});
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const shapeStartRef = useRef<{ x: number; y: number } | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [version, setVersion] = useState(0); // force re-render after canvas changes

  /* Init: white background on each nail canvas */
  useEffect(() => {
    FINGERS.forEach(({ id }) => {
      const canvas = canvasRefs.current[id];
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#fff5f7";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Nail shape outline (rounded rect)
      ctx.strokeStyle = "rgba(0,0,0,0.12)";
      ctx.lineWidth = 2;
      drawNailShape(ctx, canvas.width, canvas.height, id.startsWith("thumb"));

      // Init history
      const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      statesRef.current[id] = { history: [snapshot], historyIndex: 0 };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Re-render when activeFinger changes so undo/redo buttons update */
  useEffect(() => {
    updateUndoRedoFlags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFinger, version]);

  function getActiveCanvas() {
    return canvasRefs.current[activeFinger] ?? null;
  }

  function getActiveState() {
    return statesRef.current[activeFinger] ?? null;
  }

  function updateUndoRedoFlags() {
    const state = getActiveState();
    if (!state) {
      setCanUndo(false);
      setCanRedo(false);
      return;
    }
    setCanUndo(state.historyIndex > 0);
    setCanRedo(state.historyIndex < state.history.length - 1);
  }

  function pushHistory() {
    const canvas = getActiveCanvas();
    const state = getActiveState();
    if (!canvas || !state) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Truncate any redo branch
    state.history = state.history.slice(0, state.historyIndex + 1);
    state.history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (state.history.length > 30) state.history.shift();
    state.historyIndex = state.history.length - 1;
    setVersion((v) => v + 1);
  }

  function undo() {
    const state = getActiveState();
    const canvas = getActiveCanvas();
    if (!state || !canvas || state.historyIndex === 0) return;
    state.historyIndex--;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(state.history[state.historyIndex]!, 0, 0);
    setVersion((v) => v + 1);
  }

  function redo() {
    const state = getActiveState();
    const canvas = getActiveCanvas();
    if (!state || !canvas || state.historyIndex >= state.history.length - 1) return;
    state.historyIndex++;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(state.history[state.historyIndex]!, 0, 0);
    setVersion((v) => v + 1);
  }

  function clearNail() {
    const canvas = getActiveCanvas();
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fff5f7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(0,0,0,0.12)";
    ctx.lineWidth = 2;
    drawNailShape(ctx, canvas.width, canvas.height, activeFinger.startsWith("thumb"));
    pushHistory();
  }

  function fillNail() {
    const canvas = getActiveCanvas();
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(0,0,0,0.12)";
    ctx.lineWidth = 2;
    drawNailShape(ctx, canvas.width, canvas.height, activeFinger.startsWith("thumb"));
    // Then apply pattern overlay if any
    if (pattern !== "none") {
      drawPattern(ctx, canvas.width, canvas.height, pattern, color);
    }
    pushHistory();
  }

  function applyPatternAll() {
    const canvas = getActiveCanvas();
    if (!canvas || pattern === "none") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawPattern(ctx, canvas.width, canvas.height, pattern, color);
    pushHistory();
  }

  /* Mouse / touch handlers */
  function getPos(e: React.PointerEvent<HTMLCanvasElement>): { x: number; y: number } {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * e.currentTarget.width, y: ((e.clientY - rect.top) / rect.height) * e.currentTarget.height };
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

    if (tool === "shape") {
      return; // wait for pointer up
    }

    // brush or eraser
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
      drawShape(start, end, shape, color);
      shapeStartRef.current = null;
    }
    pushHistory();
  }

  function drawStroke(from: { x: number; y: number }, to: { x: number; y: number }) {
    const canvas = getActiveCanvas();
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;
    if (tool === "eraser") {
      ctx.strokeStyle = "#fff5f7";
      ctx.globalCompositeOperation = "source-over";
    } else {
      ctx.strokeStyle = color;
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  function drawShape(start: { x: number; y: number }, end: { x: number; y: number }, shapeId: string, c: string) {
    const canvas = getActiveCanvas();
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = c;
    ctx.strokeStyle = c;
    ctx.lineWidth = 2;
    const cx = (start.x + end.x) / 2;
    const cy = (start.y + end.y) / 2;
    const r = Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y)) / 2;
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
  }

  /* Export all 10 nails as base64 PNGs and store in sessionStorage */
  function saveSet() {
    const set = FINGERS.map(({ id, label }) => {
      const canvas = canvasRefs.current[id];
      return { id, label, image: canvas?.toDataURL("image/png") ?? "" };
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
      // sessionStorage plein
    }
    // Navigate to /create/result
    window.location.href = "/create/result?source=studio";
  }

  function downloadNail() {
    const canvas = getActiveCanvas();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `aime-${activeFinger}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="rounded-3xl bg-white border border-soft-gray/50 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-soft-gray/30 bg-ivory/40 space-y-3">
        {/* Tool row */}
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
            <span className="text-xs font-medium w-8 text-center">{brushSize}px</span>
            <button
              onClick={() => setBrushSize((s) => Math.min(40, s + 2))}
              className="p-1.5 rounded hover:bg-soft-gray/40"
              aria-label="Plus épais"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Color row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Pipette className="w-3.5 h-3.5 text-ink-light/50" />
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-7 h-7 rounded border border-soft-gray cursor-pointer"
              aria-label="Couleur personnalisée"
            />
            <span className="text-[10px] font-mono text-ink-light/40">{color}</span>
          </div>
          {PALETTE_PRESETS.map((preset, i) => (
            <div key={i} className="flex gap-1">
              {preset.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    color.toLowerCase() === c.toLowerCase() ? "border-ink" : "border-white shadow-sm"
                  }`}
                  style={{ background: c }}
                  aria-label={`Couleur ${c}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Pattern row */}
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

        {/* Shape row (visible when tool=shape) */}
        {tool === "shape" && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-ink-light/50">Forme :</span>
            {SHAPES.map((s) => (
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
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-[200px_1fr]">
        {/* Finger picker */}
        <div className="p-3 border-r border-soft-gray/30 bg-ivory/20">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-light/40 mb-2 px-2">
            Ongles
          </p>
          <div className="space-y-1">
            <FingerGroup title="Main Gauche" fingers={FINGERS.slice(0, 5)} active={activeFinger} onSelect={setActiveFinger} />
            <FingerGroup title="Main Droite" fingers={FINGERS.slice(5)} active={activeFinger} onSelect={setActiveFinger} />
          </div>
        </div>

        {/* Canvas area */}
        <div className="p-4 sm:p-6 flex flex-col items-center justify-center bg-gradient-to-b from-ivory to-soft-gray/20 min-h-[400px]">
          <p className="text-xs text-ink-light/40 mb-2">
            Ongle actif : <span className="font-medium text-ink">
              {FINGERS.find((f) => f.id === activeFinger)?.label}
            </span>
          </p>
          <div className="relative">
            <canvas
              ref={(el) => {
                canvasRefs.current[activeFinger] = el;
              }}
              width={320}
              height={400}
              className="rounded-2xl border-2 border-ink/10 shadow-md cursor-crosshair touch-none"
              style={{ maxWidth: "100%", height: "auto" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            />
          </div>
          <p className="text-[10px] text-ink-light/30 mt-3">
            Pinceau / Gomme / Forme : glisser pour dessiner. Remplir : un clic.
          </p>

          {/* Save / Download */}
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
type FingerId = Fingers[number]["id"];

function FingerGroup({
  title,
  fingers,
  active,
  onSelect,
}: {
  title: string;
  fingers: readonly { readonly id: FingerId; readonly label: string }[];
  active: string;
  onSelect: (id: string) => void;
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

function drawNailShape(ctx: CanvasRenderingContext2D, w: number, h: number, isThumb: boolean) {
  ctx.save();
  ctx.beginPath();
  if (isThumb) {
    roundedRect(ctx, 0.12 * w, 0.05 * h, 0.76 * w, 0.9 * h, 0.35 * w, 0.45 * h);
  } else {
    roundedRect(ctx, 0.18 * w, 0.05 * h, 0.64 * w, 0.9 * h, 0.4 * w, 0.45 * h);
  }
  ctx.stroke();
  ctx.restore();
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  rx: number,
  ry: number
) {
  // Simple rounded-rect path
  const r = Math.min(rx, w / 2);
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawPattern(ctx: CanvasRenderingContext2D, w: number, h: number, pattern: string, baseColor: string) {
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = baseColor === "#ffffff" || baseColor === "#fff5f7" ? "#000" : "#fff";

  if (pattern === "stripes") {
    for (let x = -h; x < w + h; x += 12) {
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(x, -h, 4, h * 2);
      ctx.restore();
    }
  } else if (pattern === "dots") {
    for (let x = 8; x < w; x += 16) {
      for (let y = 8; y < h; y += 16) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (pattern === "chevron") {
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 2;
    for (let y = 0; y < h + 20; y += 18) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w / 2, y + 12);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  } else if (pattern === "grid") {
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  } else if (pattern === "florals") {
    for (let x = 18; x < w; x += 32) {
      for (let y = 18; y < h; y += 32) {
        for (let a = 0; a < 5; a++) {
          const angle = (a * 2 * Math.PI) / 5;
          ctx.beginPath();
          ctx.arc(x + Math.cos(angle) * 4, y + Math.sin(angle) * 4, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (pattern === "stars") {
    for (let x = 16; x < w; x += 24) {
      for (let y = 16; y < h; y += 24) {
        drawStar(ctx, x, y, 4, 2, 5);
      }
    }
  } else if (pattern === "diamond") {
    for (let x = 0; x < w + 20; x += 20) {
      for (let y = 0; y < h + 20; y += 20) {
        ctx.beginPath();
        ctx.moveTo(x, y - 6);
        ctx.lineTo(x + 6, y);
        ctx.lineTo(x, y + 6);
        ctx.lineTo(x - 6, y);
        ctx.closePath();
        ctx.fill();
      }
    }
  } else if (pattern === "wave") {
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 2;
    for (let y = 0; y < h + 10; y += 16) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const yy = y + Math.sin((x / w) * Math.PI * 4) * 4;
        if (x === 0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, r2: number, spikes: number) {
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
