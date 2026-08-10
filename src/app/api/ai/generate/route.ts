import { NextRequest } from "next/server";
import { generateText } from "ai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type NailSize = {
  finger: string;
  width: number; // mm
  length: number; // mm
  shape: "natural" | "almond" | "oval" | "square" | "coffin" | "stiletto" | "round" | "ballerina";
};

type GenerateBody = {
  prompt: string;
  style?: string;
  nailProfile?: { nails: NailSize[]; skinTone?: string };
};

const FINGER_LABELS: Record<string, string> = {
  thumb_left: "left thumb",
  index_left: "left index",
  middle_left: "left middle",
  ring_left: "left ring",
  pinky_left: "left pinky",
  thumb_right: "right thumb",
  index_right: "right index",
  middle_right: "right middle",
  ring_right: "right ring",
  pinky_right: "right pinky",
};

const STYLE_KEYWORDS: Record<string, string> = {
  minimal: "minimalist clean negative space, single thin lines on a sheer base",
  french: "modern French tip, soft smile line, glossy nude",
  chrome: "mirror chrome powder finish, liquid metal reflection, futuristic",
  luxury: "high-end editorial, gold foil accents, jewel-like depth, deep saturated tones",
  floral: "botanical watercolor, soft petals, hand-painted flowers, romantic",
  gothic: "dark romantic, deep oxblood and black, velvet matte finish, occult motifs",
  kawaii: "playful pastel, cute motifs, soft pink, glossy top coat",
  y2k: "Y2K pop, holographic glitter, butterfly motifs, bright cyan and magenta",
  nature: "organic textures, moss, stone, watercolor earth tones, raw beauty",
  wedding: "bridal elegance, milky sheer base, pearl shimmer, delicate lace pattern",
  art: "abstract expressionist nail art, bold brushstrokes, contemporary fine art",
  abstract: "geometric abstract, asymmetric blocks, primary colors, Bauhaus-inspired",
};

/**
 * Build a single nail design prompt for one finger.
 * The model is asked to respond as JSON describing the design's visual specs
 * (palette, motif, finish) so the result can be rendered consistently and
 * later applied to the parametric 3D mesh.
 */
function buildNailPrompt(opts: {
  index: number;
  total: number;
  prompt: string;
  style?: string;
  nail?: NailSize;
  skinTone?: string;
}): string {
  const { index, total, prompt, style, nail, skinTone } = opts;
  const fingerLabel = nail ? FINGER_LABELS[nail.finger] ?? nail.finger : `finger ${index + 1}`;
  const size = nail
    ? `${Math.round(nail.width)}mm wide × ${Math.round(nail.length)}mm long, ${nail.shape} shape`
    : "natural nail shape";
  const styleLine = style && STYLE_KEYWORDS[style] ? STYLE_KEYWORDS[style] : "";
  const skinLine = skinTone ? `complementing ${skinTone} skin tone` : "photographed on editorial hands";

  return [
    `You are an editorial nail designer creating nail ${index + 1} of ${total} in a coherent set.`,
    `Subject: single fingernail close-up, ${fingerLabel}, ${size}.`,
    `Set direction: ${prompt}.`,
    styleLine,
    skinLine,
    `Reply with strict JSON only, no markdown, matching this schema:`,
    `{"name": string, "palette": [string, string, string], "motif": string, "finish": "glossy" | "matte" | "satin" | "chrome" | "glitter", "description": string, "swatch": "#hexcolor"}`,
    `The palette must reuse 2 of the 3 colors from nails 1-${Math.max(1, index)} in this set so all 10 nails feel like one collection. Vary the motif and composition per finger.`,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Deterministic palette when no API key is configured.
 * Produces 10 swatches that share a hue family so the set looks coherent.
 */
function deterministicFallback(prompt: string, style?: string) {
  let hash = 0;
  const input = `${prompt}|${style ?? ""}`;
  for (let i = 0; i < input.length; i++) hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  const baseHue = hash % 360;
  return Array.from({ length: 10 }, (_, i) => {
    const h = (baseHue + i * 12) % 360;
    const s = 55 + ((hash >> (i + 1)) & 0x1f);
    const l = 35 + ((hash >> (i + 3)) & 0x1f);
    return {
      name: inferSetName(prompt, style) + " — " + (i + 1),
      palette: [`hsl(${h}, ${s}%, ${l}%)`, `hsl(${(h + 30) % 360}, ${s}%, ${l + 10}%)`, `hsl(${(h - 30 + 360) % 360}, ${s - 5}%, ${l - 10}%)`],
      motif: i % 2 === 0 ? "solid color" : "subtle gradient",
      finish: inferFinish(style),
      description: `Auto-generated palette based on "${prompt}" (no API key configured).`,
      swatch: `hsl(${h}, ${s}%, ${l}%)`,
    };
  });
}

type GeneratedNailDesign = {
  name?: string;
  palette?: string[];
  motif?: string;
  finish?: string;
  description?: string;
  swatch?: string;
};

/**
 * Parse the model output as a single JSON object.
 * Tolerant to fenced code blocks and minor noise.
 */
function parseJsonNailDesign(text: string): GeneratedNailDesign | null {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function POST(request: NextRequest) {
  let body: GenerateBody;
  try {
    body = (await request.json()) as GenerateBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.prompt?.trim() && !body.style) {
    return Response.json(
      { error: "Le prompt ou le style est requis" },
      { status: 400 }
    );
  }

  const apiKey = process.env.AI_GATEWAY_API_KEY ?? process.env.GOOGLE_AI_API_KEY ?? process.env.GEMINI_API_KEY;
  const total = body.nailProfile?.nails?.length ?? 10;
  const nails = body.nailProfile?.nails ?? [];

  // Fallback: no API key configured → return deterministic mock
  if (!apiKey) {
    const designs = deterministicFallback(body.prompt, body.style);
    return Response.json({
      mode: "fallback",
      reason: "AI_GATEWAY_API_KEY not set; using deterministic palette",
      set: {
        name: inferSetName(body.prompt, body.style),
        nails: designs.map((d, i) => ({
          finger: nails[i]?.finger ?? `finger_${i}`,
          ...d,
        })),
      },
    });
  }

  try {
    // We ask the model to return structured JSON for each finger.
    // The AI Gateway resolves to whatever provider is configured; we ask for
    // a Gemini Flash model by default (cheap + supports text output reliably).
    const collectedDesigns: GeneratedNailDesign[] = [];
    for (let i = 0; i < total; i++) {
      const prompt = buildNailPrompt({
        index: i,
        total,
        prompt: body.prompt,
        style: body.style,
        nail: nails[i],
        skinTone: body.nailProfile?.skinTone,
      });
      try {
        const { text } = await generateText({
          model: "google/gemini-2.5-flash",
          prompt,
        });
        const parsed = parseJsonNailDesign(text);
        if (parsed) collectedDesigns.push(parsed);
      } catch (err) {
        console.error(`[ai/generate] nail ${i} failed`, err);
        collectedDesigns.push({});
      }
    }

    const valid = collectedDesigns.filter((d) => d && Object.keys(d).length > 0);
    if (valid.length === 0) {
      const fallback = deterministicFallback(body.prompt, body.style);
      return Response.json({
        mode: "fallback",
        reason: "AI generation produced no designs; using deterministic palette",
        set: {
          name: inferSetName(body.prompt, body.style),
          nails: fallback.map((d, i) => ({ finger: nails[i]?.finger ?? `finger_${i}`, ...d })),
        },
      });
    }

    return Response.json({
      mode: "ai",
      set: {
        name: inferSetName(body.prompt, body.style),
        nails: valid.map((d, i) => ({
          finger: nails[i]?.finger ?? `finger_${i}`,
          name: d.name,
          palette: d.palette,
          motif: d.motif,
          finish: d.finish ?? inferFinish(body.style),
          description: d.description,
          swatch: d.swatch ?? d.palette?.[0] ?? "#cccccc",
        })),
      },
    });
  } catch (error) {
    console.error("[ai/generate] failed", error);
    const fallback = deterministicFallback(body.prompt, body.style);
    return Response.json(
      {
        mode: "fallback",
        reason: error instanceof Error ? error.message : "AI generation failed",
        set: {
          name: inferSetName(body.prompt, body.style),
          nails: fallback.map((d, i) => ({ finger: nails[i]?.finger ?? `finger_${i}`, ...d })),
        },
      },
      { status: 200 }
    );
  }
}

function inferSetName(prompt: string, style?: string): string {
  const seed = (prompt || style || "set").trim().split(/\s+/).slice(0, 3).join(" ");
  return seed
    .replace(/[^a-zA-ZÀ-ÿ0-9\s]/g, "")
    .replace(/\b\w/g, (c) => c.toUpperCase()) || "Custom Set";
}

function inferFinish(style?: string): string {
  switch (style) {
    case "chrome":
      return "chrome";
    case "gothic":
      return "matte";
    case "minimal":
    case "french":
      return "glossy";
    case "luxury":
    case "wedding":
      return "satin";
    default:
      return "glossy";
  }
}
