"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

export type NailMeshParams = {
  finger: string;
  width: number;
  length: number;
  curvature: number;
  thickness: number;
  shape: "natural" | "almond" | "oval" | "square" | "coffin" | "stiletto" | "round" | "ballerina";
  growthSinceLastScan: number;
  healthScore: number;
  surface: { glossiness: number; color: string };
};

type Props = {
  nails: NailMeshParams[];
  selectedFinger?: string;
  onSelectFinger?: (finger: string) => void;
};

/**
 * HandLayout positions 10 nail meshes in a believable left+right hand layout.
 * Coordinates are unitless scene units (1 = ~1cm).
 */
function handPositions(): Array<{ hand: "left" | "right"; finger: string; x: number; y: number; z: number }> {
  const fingers: Array<"thumb" | "index" | "middle" | "ring" | "pinky"> = [
    "thumb",
    "index",
    "middle",
    "ring",
    "pinky",
  ];
  const positions: Array<{ hand: "left" | "right"; finger: string; x: number; y: number; z: number }> = [];
  const yBase = 0;

  for (const hand of ["left", "right"] as const) {
    const xCenter = hand === "left" ? -3 : 3;
    fingers.forEach((f, i) => {
      // Écart latéral (x) — les doigts divergent depuis le centre de la main
      const x = xCenter + (i - 2) * 1.05;
      // Longueur du doigt (y) — pouce plus court
      const fingerLength = f === "thumb" ? 2.4 : 3.0 + (i === 1 || i === 2 ? 0.3 : 0);
      const y = yBase + fingerLength / 2;
      // Profondeur (z) — le pouce est devant
      const z = f === "thumb" ? 0.8 : 0;
      positions.push({
        hand,
        finger: `${hand}_${f}`,
        x: hand === "left" ? -x : x,
        y,
        z,
      });
    });
  }
  return positions;
}

/**
 * Builds the nail plate geometry from a single set of measurements.
 * Uses LatheGeometry to revolve a 2D profile around the Y axis (nail grows upward).
 * The profile is shaped by the `shape` parameter.
 */
function buildNailGeometry(params: NailMeshParams) {
  const { length, width, curvature, thickness, shape } = params;
  const w = Math.max(width / 10, 0.6); // normalized
  const l = Math.max(length / 10, 0.6);

  // Define the 2D profile: [(x, y)] starting from the cuticle (bottom)
  // and going up to the tip.
  const profile: THREE.Vector2[] = [];
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 0 = base, 1 = tip
    // x(width) is wider at the base, narrows according to shape
    let halfWidth = w * 0.5;
    if (shape === "square" || shape === "coffin" || shape === "ballerina") {
      // Wide plateau, abrupt taper near the tip
      const taperStart = 0.7;
      if (t > taperStart) {
        halfWidth *= 1 - ((t - taperStart) / (1 - taperStart)) * 0.95;
      }
    } else if (shape === "almond" || shape === "oval" || shape === "round" || shape === "natural") {
      // Smooth curve to a rounded tip
      halfWidth *= Math.cos(((t - 0.5) * Math.PI) / 1.6);
    } else if (shape === "stiletto") {
      // Pointy
      halfWidth *= 1 - Math.pow(t, 1.5) * 0.95;
    }
    halfWidth = Math.max(halfWidth, 0.01);

    // y is the height along the nail
    const y = t * l;
    // Optional curvature: bow the profile outward
    const bow = Math.sin(t * Math.PI) * curvature * 0.18;
    profile.push(new THREE.Vector2(halfWidth + bow, y));
  }

  // Add a small inner cut to give the nail some thickness at the base
  const innerProfile: THREE.Vector2[] = [];
  const tSteps = 12;
  for (let i = 0; i <= tSteps; i++) {
    const t = i / tSteps;
    const y = t * thickness * 0.8;
    const halfW = (Math.max(width / 10, 0.6) * 0.5) * 0.85;
    innerProfile.push(new THREE.Vector2(halfW, y));
  }
  void innerProfile; // currently unused; we rely on the lathe solid

  return new THREE.LatheGeometry(profile, 32);
}

function NailMesh({
  params,
  position,
  selected,
  onClick,
  growthColor,
}: {
  params: NailMeshParams;
  position: [number, number, number];
  selected: boolean;
  onClick: () => void;
  growthColor: THREE.Color;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => buildNailGeometry(params), [params]);
  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(params.surface.color),
      roughness: 1 - params.surface.glossiness,
      metalness: 0.05,
      clearcoat: params.surface.glossiness,
      clearcoatRoughness: 0.15,
      sheen: 0.4,
    });
  }, [params.surface.color, params.surface.glossiness]);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        onClick={onClick}
        scale={selected ? 1.15 : 1}
      />
      {/* Growth indicator: a thin ring at the cuticle that pulses with regrowth */}
      {params.growthSinceLastScan > 0.05 && (
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[Math.max(params.width / 10, 0.6) * 0.55, 0.025, 8, 24]} />
          <meshStandardMaterial color={growthColor} emissive={growthColor} emissiveIntensity={0.6} />
        </mesh>
      )}
    </group>
  );
}

function Scene({ nails, selectedFinger, onSelectFinger, positions }: Props & { positions: ReturnType<typeof handPositions> }) {
  const growthColor = useMemo(() => new THREE.Color("#e62e6b"), []);

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-5, 4, -3]} intensity={0.4} color="#ffd9c0" />

      {positions.map((pos) => {
        const nailParams = nails.find((n) => n.finger === pos.finger);
        if (!nailParams) return null;
        return (
          <NailMesh
            key={pos.finger}
            params={nailParams}
            position={[pos.x, pos.y, pos.z]}
            selected={selectedFinger === pos.finger}
            onClick={() => onSelectFinger?.(pos.finger)}
            growthColor={growthColor}
          />
        );
      })}

      <ContactShadows position={[0, -0.6, 0]} opacity={0.35} scale={20} blur={2} far={6} />
      <Environment preset="studio" />
      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </>
  );
}

export default function NailModel3D(props: Props) {
  const positions = useMemo(() => handPositions(), []);

  return (
    <div className="relative h-[460px] w-full overflow-hidden rounded-3xl border border-soft-gray/50 bg-gradient-to-b from-ivory to-soft-gray/40">
      <Canvas
        shadows
        camera={{ position: [0, 5, 11], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene {...props} positions={positions} />
      </Canvas>

      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between text-[11px] text-ink-light/50">
        <span className="rounded-full bg-white/80 px-2.5 py-1 backdrop-blur">
          Clic sur un ongle pour le sélectionner · Glisse pour pivoter
        </span>
        <span className="rounded-full bg-white/80 px-2.5 py-1 backdrop-blur">
          {props.nails.length} ongles · pousse cumulée {props.nails.reduce((s, n) => s + n.growthSinceLastScan, 0).toFixed(1)} mm
        </span>
      </div>
    </div>
  );
}
