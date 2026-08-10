import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type Finger = "thumb" | "index" | "middle" | "ring" | "pinky";
type Hand = "left" | "right";

type NailMeasurements = {
  hand: Hand;
  finger: Finger;
  width: number; // mm — largeur du lit unguéal
  length: number; // mm — longueur du lit unguéal
  curvature: number; // 0 (plat) → 1 (très bombé)
  thickness: number; // mm — épaisseur du bord libre
  shape: "natural" | "almond" | "oval" | "square" | "coffin" | "stiletto" | "round" | "ballerina";
  growRateMmPerMonth?: number;
};

type RegenerateBody = {
  measurements: NailMeasurements[];
  // Optionnel: timestamp de la dernière mise à jour pour calculer la pousse
  lastScannedAt?: string;
};

type MeshParams = {
  finger: string;
  // Géométrie 3D dérivée des mesures
  width: number;
  length: number;
  curvature: number;
  thickness: number;
  shape: NailMeasurements["shape"];
  // Pousse naturelle estimée depuis le dernier scan
  growthSinceLastScan: number;
  // Couleur / état de surface dérivés
  healthScore: number; // 0-100
  surface: {
    glossiness: number; // 0-1
    color: string; // hex
  };
};

/**
 * Convertit des mesures cliniques (mm) en paramètres de mesh 3D.
 * L'idée : on normalise les mesures pour pouvoir les passer à un mesh paramétrique
 * côté client. Le ratio width/length drive la forme, la curvature drive le bombé.
 */
function deriveMesh(measurement: NailMeasurements, lastScannedAt?: string): MeshParams {
  const aspectRatio = measurement.length / Math.max(measurement.width, 1);
  // Forme dérivée du ratio si l'utilisateur n'en a pas explicitement choisi
  const derivedShape = inferShape(aspectRatio, measurement.shape);

  // Pousse : ~3mm/mois par défaut, plus lent pour le pouce
  const growRate = measurement.growRateMmPerMonth ?? defaultGrowRate(measurement.finger);
  const monthsSinceLastScan = lastScannedAt
    ? Math.max(0, (Date.now() - new Date(lastScannedAt).getTime()) / (1000 * 60 * 60 * 24 * 30))
    : 0;
  const growth = Math.min(growRate * monthsSinceLastScan, growRate * 2);

  // Score santé heuristique simple à partir de la courbure et l'épaisseur
  const health = clamp(
    100 - Math.abs(measurement.curvature - 0.4) * 80 - Math.max(0, 0.8 - measurement.thickness) * 40,
    0,
    100
  );

  return {
    finger: `${measurement.hand}_${measurement.finger}`,
    width: measurement.width,
    length: measurement.length,
    curvature: measurement.curvature,
    thickness: measurement.thickness,
    shape: derivedShape,
    growthSinceLastScan: Number(growth.toFixed(2)),
    healthScore: Math.round(health),
    surface: {
      glossiness: 0.65,
      color: "#f3d3c4",
    },
  };
}

function inferShape(
  aspect: number,
  explicit?: NailMeasurements["shape"]
): NailMeasurements["shape"] {
  if (explicit) return explicit;
  if (aspect < 0.9) return "square";
  if (aspect < 1.05) return "round";
  if (aspect < 1.2) return "oval";
  if (aspect < 1.4) return "almond";
  return "coffin";
}

function defaultGrowRate(finger: Finger): number {
  // Pouces poussent plus vite,'auriculaires moins
  switch (finger) {
    case "thumb":
      return 3.5;
    case "index":
    case "middle":
      return 3.0;
    case "ring":
      return 2.7;
    case "pinky":
      return 2.3;
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export async function POST(request: NextRequest) {
  let body: RegenerateBody;
  try {
    body = (await request.json()) as RegenerateBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body.measurements) || body.measurements.length === 0) {
    return Response.json({ error: "measurements[] requis" }, { status: 400 });
  }

  const meshes = body.measurements.map((m) => deriveMesh(m, body.lastScannedAt));

  return Response.json({
    generatedAt: new Date().toISOString(),
    set: {
      meshes,
      summary: {
        averageGrowth: Number(
          (meshes.reduce((s, m) => s + m.growthSinceLastScan, 0) / meshes.length).toFixed(2)
        ),
        averageHealth: Math.round(
          meshes.reduce((s, m) => s + m.healthScore, 0) / meshes.length
        ),
      },
    },
  });
}
