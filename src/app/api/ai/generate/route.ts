import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // seconds; Vercel hobby limit

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
 * Build a single image generation prompt for one nail.
 * Each finger gets its own prompt so the model can vary the design per finger
 * while still respecting the global set direction.
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
    `Single fingernail close-up macro photograph, ${fingerLabel}, ${size}.`,
    `Design direction: ${prompt}.`,
    styleLine,
    `Editorial nail photography, soft studio lighting, sharp focus on the nail plate,`,
    `${skinLine}, square aspect ratio 1:1.`,
    `This is nail ${index + 1} of ${total} in a coherent 10-nail set — keep visual DNA consistent (palette, finish, motif) but vary the composition per finger.`,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Deterministic palette helper when the API is unavailable.
 * Produces 10 swatches that share a hue family so the set looks coherent.
 */
function deterministicFallback(prompt: string, style?: string): string[] {
  let hash = 0;
  const input = `${prompt}|${style ?? ""}`;
  for (let i = 0; i < input.length; i++) hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  const baseHue = hash % 360;
  return Array.from({ length: 10 }, (_, i) => {
    const h = (baseHue + i * 12) % 360;
    const s = 55 + ((hash >> (i + 1)) & 0x1f);
    const l = 35 + ((hash >> (i + 3)) & 0x1f);
    return `hsl(${h}, ${s}%, ${l}%)`;
  });
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

  const apiKey = process.env.GOOGLE_AI_API_KEY ?? process.env.GEMINI_API_KEY;
  const total = body.nailProfile?.nails?.length ?? 10;
  const nails = body.nailProfile?.nails ?? [];

  // Fallback: no API key configured → return deterministic mock that already
  // looks more intentional than the previous hardcoded palette.
  if (!apiKey) {
    const swatches = deterministicFallback(body.prompt, body.style);
    return Response.json({
      mode: "fallback",
      reason: "GOOGLE_AI_API_KEY not set; using deterministic palette",
      set: {
        name: inferSetName(body.prompt, body.style),
        nails: Array.from({ length: total }, (_, i) => ({
          finger: nails[i]?.finger ?? `finger_${i}`,
          swatch: swatches[i],
          finish: inferFinish(body.style),
        })),
      },
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const generated = await Promise.all(
      Array.from({ length: total }, async (_, i) => {
        const prompt = buildNailPrompt({
          index: i,
          total,
          prompt: body.prompt,
          style: body.style,
          nail: nails[i],
          skinTone: body.nailProfile?.skinTone,
        });
        try {
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseModalities: ["IMAGE"],
            },
          });
          const part = response.candidates?.[0]?.content?.parts?.find(
            (p) => "inlineData" in p && p.inlineData
          );
          if (part && "inlineData" in part && part.inlineData?.data) {
            return {
              finger: nails[i]?.finger ?? `finger_${i}`,
              image: `data:${part.inlineData.mimeType ?? "image/png"};base64,${part.inlineData.data}`,
              finish: inferFinish(body.style),
            };
          }
        } catch (err) {
          console.error(`[ai/generate] nail ${i} failed`, err);
        }
        return null;
      })
    );

    const images = generated.filter((n): n is NonNullable<typeof n> => n !== null);

    if (images.length === 0) {
      const swatches = deterministicFallback(body.prompt, body.style);
      return Response.json({
        mode: "fallback",
        reason: "AI generation produced no images; using deterministic palette",
        set: {
          name: inferSetName(body.prompt, body.style),
          nails: Array.from({ length: total }, (_, i) => ({
            finger: nails[i]?.finger ?? `finger_${i}`,
            swatch: swatches[i],
            finish: inferFinish(body.style),
          })),
        },
      });
    }

    return Response.json({
      mode: "ai",
      set: {
        name: inferSetName(body.prompt, body.style),
        nails: images,
      },
    });
  } catch (error) {
    console.error("[ai/generate] failed", error);
    const swatches = deterministicFallback(body.prompt, body.style);
    return Response.json(
      {
        mode: "fallback",
        reason: error instanceof Error ? error.message : "AI generation failed",
        set: {
          name: inferSetName(body.prompt, body.style),
          nails: Array.from({ length: total }, (_, i) => ({
            finger: nails[i]?.finger ?? `finger_${i}`,
            swatch: swatches[i],
            finish: inferFinish(body.style),
          })),
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
