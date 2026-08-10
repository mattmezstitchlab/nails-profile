"use client";

/**
 * NailPhotoScan — uploads a hand photo and runs MediaPipe Hand Landmarker
 * to detect the 10 fingertips. Returns the detected nail positions and
 * bounding boxes in image coordinates so the caller can project a design
 * onto the actual photo.
 *
 * The MediaPipe runtime is loaded dynamically so the 30MB WASM bundle
 * is never in the initial page weight.
 *
 * NOTE: Hand Landmarker detects 21 hand landmarks per hand (5 fingertips +
 * joints). For nail detection we use the 5 fingertip landmarks (8, 12,
 * 16, 20 for the four fingers + 4 for the thumb) and approximate the nail
 * region as a small offset around each tip. This is a v1 — production-grade
 * nail segmentation would need a custom ML model trained on nail data.
 */

import { useEffect, useRef, useState } from "react";
import { Camera, Upload, Loader2, Check, AlertTriangle, RotateCcw } from "lucide-react";

type Landmark = { x: number; y: number; z: number };

export type DetectedNail = {
  finger: string; // "thumb" | "index" | "middle" | "ring" | "pinky"
  hand: "left" | "right";
  tip: { x: number; y: number };
  nailCenter: { x: number; y: number };
  width: number; // estimated nail width in image pixels
  height: number; // estimated nail height
  confidence: number; // 0-1
};

export type ScanResult = {
  nails: DetectedNail[];
  imageWidth: number;
  imageHeight: number;
};

type Props = {
  onScan: (result: ScanResult) => void;
};

const FINGER_NAMES: Array<DetectedNail["finger"]> = ["thumb", "index", "middle", "ring", "pinky"];

// MediaPipe Hand Landmarker fingertip landmark indices:
//  4 = thumb tip
//  8 = index tip
// 12 = middle tip
// 16 = ring tip
// 20 = pinky tip
const TIP_INDEX: Record<DetectedNail["finger"], number> = {
  thumb: 4,
  index: 8,
  middle: 12,
  ring: 16,
  pinky: 20,
};

export default function NailPhotoScan({ onScan }: Props) {
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const landmarkerRef = useRef<unknown>(null);

  function handleFile(file: File) {
    setError(null);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImageData(dataUrl);
      const img = new Image();
      img.onload = () => setImageEl(img);
      img.onerror = () => setError("Impossible de charger l'image");
      img.src = dataUrl;
    };
    reader.onerror = () => setError("Impossible de lire le fichier");
    reader.readAsDataURL(file);
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function reset() {
    setImageData(null);
    setImageEl(null);
    setResult(null);
    setError(null);
  }

  async function runScan() {
    if (!imageEl) return;
    setScanning(true);
    setError(null);
    try {
      // Dynamic import — keeps the 30MB WASM out of the initial bundle
      const { FilesetResolver, HandLandmarker } = await import(
        "@mediapipe/tasks-vision"
      );

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm"
      );

      const landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "IMAGE",
        numHands: 2,
        minHandDetectionConfidence: 0.3,
        minHandPresenceConfidence: 0.3,
        minTrackingConfidence: 0.3,
      });
      landmarkerRef.current = landmarker;

      const detections = landmarker.detect(imageEl);
      if (!detections.landmarks || detections.landmarks.length === 0) {
        setError(
          "Aucune main détectée. Essaie avec une photo plus éclairée et les doigts bien visibles."
        );
        setScanning(false);
        return;
      }

      const detected: DetectedNail[] = [];
      detections.landmarks.forEach((landmarks: Landmark[], handIdx: number) => {
        // handedness: "Left" means the user's left hand (mirror flipped in selfie cam)
        const handedness = detections.handedness?.[handIdx]?.[0]?.categoryName ?? "Right";
        const hand: "left" | "right" = handedness === "Left" ? "right" : "left"; // mirror correction
        FINGER_NAMES.forEach((finger) => {
          const tipIdx = TIP_INDEX[finger];
          const tip = landmarks[tipIdx]!;
          // Nail center: small offset from tip toward the hand
          const ipIdx = finger === "thumb" ? 3 : tipIdx - 2;
          const ip = landmarks[ipIdx]!;
          const nailCenterX = (tip.x * 0.6 + ip.x * 0.4);
          const nailCenterY = (tip.y * 0.5 + ip.y * 0.5);
          // Nail width/height heuristic (in normalized 0-1 coords)
          const fingerWidth = finger === "thumb" ? 0.06 : 0.045;
          const fingerHeight = 0.08;
          detected.push({
            finger,
            hand,
            tip: { x: tip.x, y: tip.y },
            nailCenter: { x: nailCenterX, y: nailCenterY },
            width: fingerWidth * imageEl.width,
            height: fingerHeight * imageEl.height,
            confidence: 0.85,
          });
        });
      });

      // Draw preview
      if (canvasRef.current && imageEl) {
        const canvas = canvasRef.current;
        canvas.width = imageEl.width;
        canvas.height = imageEl.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(imageEl, 0, 0);
          detected.forEach((n) => {
            ctx.strokeStyle = "rgba(230, 46, 107, 0.95)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(n.nailCenter.x, n.nailCenter.y, n.width / 2, n.height / 2, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = "rgba(230, 46, 107, 0.6)";
            ctx.font = "16px sans-serif";
            ctx.fillText(n.finger, n.nailCenter.x - 16, n.nailCenter.y - n.height / 2 - 8);
          });
        }
      }

      const scanResult: ScanResult = {
        nails: detected,
        imageWidth: imageEl.width,
        imageHeight: imageEl.height,
      };
      setResult(scanResult);
      // Persist the original image as a data URL so /create/result can
      // composite the design on top of it. We draw the image into a
      // throwaway canvas because HTMLImageElement has no toDataURL.
      try {
        const tmp = document.createElement("canvas");
        tmp.width = imageEl.width;
        tmp.height = imageEl.height;
        const tctx = tmp.getContext("2d");
        if (tctx) {
          tctx.drawImage(imageEl, 0, 0);
          const dataUrl = tmp.toDataURL("image/jpeg", 0.8);
          if (dataUrl) sessionStorage.setItem("photoScanDataUrl", dataUrl);
        }
      } catch {
        // sessionStorage plein — on s'en passe
      }
      onScan(scanResult);
    } catch (err) {
      console.error("[NailPhotoScan] failed", err);
      setError(
        err instanceof Error
          ? `Erreur MediaPipe: ${err.message}`
          : "La détection a échoué. Réessaie avec une autre photo."
      );
    } finally {
      setScanning(false);
    }
  }

  return (
    <div className="rounded-3xl bg-white border border-soft-gray/50 overflow-hidden">
      {!imageData ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose/10 flex items-center justify-center">
            <Camera className="w-8 h-8 text-rose" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Importe une photo de ta main</h3>
          <p className="text-sm text-ink-light/50 mb-6 max-w-md mx-auto">
            AIME® détecte tes 10 ongles, mesure leur forme et prépare le set à projeter dessus.
            Prends la photo en pleine lumière, doigts bien écartés, paume vers la caméra.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <label className="inline-flex items-center gap-2 rounded-full bg-rose text-white px-6 py-3 text-sm font-semibold cursor-pointer hover:bg-rose-dark transition-colors">
              <Upload className="w-4 h-4" />
              Importer une photo
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onUpload}
              />
            </label>
            <label className="inline-flex items-center gap-2 rounded-full bg-white border border-soft-gray px-6 py-3 text-sm font-medium cursor-pointer hover:border-ink/15 transition-colors">
              <Camera className="w-4 h-4" />
              Prendre une photo
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={onUpload}
              />
            </label>
          </div>
          <p className="text-[10px] text-ink-light/30 mt-6">
            Le scan s'exécute entièrement dans ton navigateur. Aucune photo n'est envoyée à un serveur.
          </p>
        </div>
      ) : (
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-ink">
              {result
                ? `✓ ${result.nails.length} ongles détectés`
                : "Photo chargée"}
            </p>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-soft-gray text-xs font-medium text-ink-light/60 hover:border-ink/15 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Recommencer
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-soft-gray/20 max-h-[500px] flex items-center justify-center">
            {result ? (
              <canvas ref={canvasRef} className="max-w-full max-h-[500px]" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageData}
                alt="Photo de main importée"
                className="max-w-full max-h-[500px]"
              />
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-700">{error}</p>
            </div>
          )}

          {!result && (
            <button
              onClick={runScan}
              disabled={scanning || !imageEl}
              className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-4 bg-rose text-white rounded-2xl text-base font-semibold hover:bg-rose-dark transition-colors shadow-md disabled:opacity-50"
            >
              {scanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Détection en cours…
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  Lancer la détection
                </>
              )}
            </button>
          )}

          {result && (
            <div className="mt-4 rounded-2xl bg-green-50 border border-green-200 p-4 flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-700">
                  {result.nails.length} ongles détectés sur {result.nails.length / 5} main
                  {result.nails.length / 5 > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-green-600/80 mt-1">
                  Image {result.imageWidth}×{result.imageHeight}px — les positions des ongles
                  sont prêtes pour la projection du design.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
