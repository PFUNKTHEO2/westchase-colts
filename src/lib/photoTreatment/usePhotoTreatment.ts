/**
 * React state for the two photo options. One hook per editor; the editor feeds
 * `working` into its preview and calls `exportWorking()` when it is time to
 * upload. The original is never discarded during the session (Undo), the cutout
 * is cached so re-enabling is instant, and any failure snaps the switch back and
 * keeps the original photo.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_TREATMENT, TreatmentError, type ExportedPhoto, type PhotoTreatment, type TreatmentProgress } from "./types";
import { isSupported, loadDrawable, removeBackground } from "./removeBackground";
import { applyShadow } from "./applyShadow";
import { exportForUpload, type ExportOptions } from "./export";

export type TreatmentStatus = "idle" | "loading-model" | "processing" | "ready" | "error";

export interface TreatmentState {
  /** The photo as uploaded (data URL or object URL). Never changed by the hook. */
  original: string | null;
  /** Cached cutout (PNG data URL) once background removal has run. */
  cutout: string | null;
  treatment: PhotoTreatment;
  status: TreatmentStatus;
  progress: TreatmentProgress | null;
  error: string | null;
  supported: boolean;
}

export interface UsePhotoTreatment {
  state: TreatmentState;
  /** What the preview should show right now: shadowed cutout, cutout, or original. */
  working: string | null;
  setRemoveBackground: (on: boolean) => void;
  setShadow: (on: boolean) => void;
  undo: () => void;
  /** Encode `working` for upload. Returns null when nothing was treated so the
   *  caller keeps its existing (JPEG) path untouched. */
  exportWorking: (options?: Partial<ExportOptions>) => Promise<ExportedPhoto | null>;
  busy: boolean;
}

export interface UsePhotoTreatmentOptions {
  /** Quarter-turn rotation applied to the photo by the editor (club sites). */
  rotateDeg?: number;
}

const FAIL_MESSAGE = "Couldn't cleanly separate the player from this background. Your original photo is kept.";
const LOAD_MESSAGE = "The photo tool could not be downloaded right now. Your original photo is kept.";

export function usePhotoTreatment(original: string | null, options: UsePhotoTreatmentOptions = {}): UsePhotoTreatment {
  const rotateDeg = options.rotateDeg ?? 0;
  const [cutout, setCutout] = useState<string | null>(null);
  const [shadowed, setShadowed] = useState<string | null>(null);
  const [treatment, setTreatment] = useState<PhotoTreatment>(DEFAULT_TREATMENT);
  const [status, setStatus] = useState<TreatmentStatus>("idle");
  const [progress, setProgress] = useState<TreatmentProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supported = useMemo(() => isSupported(), []);
  const abortRef = useRef<AbortController | null>(null);
  const shadowCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // A new photo resets everything; the previous cutout belongs to the old file.
  useEffect(() => {
    abortRef.current?.abort();
    setCutout(null);
    setShadowed(null);
    shadowCanvasRef.current = null;
    setTreatment(DEFAULT_TREATMENT);
    setStatus("idle");
    setProgress(null);
    setError(null);
  }, [original]);

  const composeShadow = useCallback(async (cutoutUrl: string) => {
    setStatus("processing");
    setProgress({ phase: "compose" });
    const img = await loadDrawable(cutoutUrl);
    const canvas = applyShadow(img, { rotateDeg });
    shadowCanvasRef.current = canvas;
    setShadowed(canvas.toDataURL("image/png"));
    setStatus("ready");
    setProgress(null);
  }, [rotateDeg]);

  // Re-compose when the creator rotates a shadowed cutout (club sites).
  useEffect(() => {
    if (treatment.shadow && cutout) void composeShadow(cutout).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotateDeg]);

  const setRemoveBackground = useCallback((on: boolean) => {
    setError(null);
    if (!on) {
      abortRef.current?.abort();
      setTreatment(DEFAULT_TREATMENT);
      setStatus(cutout ? "ready" : "idle");
      setProgress(null);
      return;
    }
    if (!original || !supported) return;
    if (cutout) {
      setTreatment((t) => ({ ...t, removeBackground: true }));
      setStatus("ready");
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("loading-model");
    setProgress({ phase: "model" });
    setTreatment((t) => ({ ...t, removeBackground: true }));
    removeBackground(original, {
      signal: controller.signal,
      onProgress: (p) => {
        setProgress(p);
        setStatus(p.phase === "infer" ? "processing" : "loading-model");
      },
    })
      .then((png) => {
        if (controller.signal.aborted) return;
        setCutout(png);
        setStatus("ready");
        setProgress(null);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        // Keep the real cause visible to whoever is debugging; the UI shows a
        // parent-friendly line only.
        console.warn("[photoTreatment] removeBackground failed:", err, (err as { cause?: unknown })?.cause);
        const code = err instanceof TreatmentError ? err.code : "INFER";
        setError(code === "MODEL_LOAD" || code === "UNSUPPORTED" ? LOAD_MESSAGE : FAIL_MESSAGE);
        setTreatment(DEFAULT_TREATMENT);
        setStatus("error");
        setProgress(null);
      });
  }, [original, supported, cutout]);

  const setShadow = useCallback((on: boolean) => {
    setError(null);
    if (!on) {
      setTreatment((t) => ({ ...t, shadow: false }));
      return;
    }
    if (!cutout) return;
    setTreatment((t) => ({ ...t, shadow: true }));
    if (!shadowed) {
      void composeShadow(cutout).catch(() => {
        setTreatment((t) => ({ ...t, shadow: false }));
        setError(FAIL_MESSAGE);
        setStatus("error");
      });
    }
  }, [cutout, shadowed, composeShadow]);

  const undo = useCallback(() => {
    abortRef.current?.abort();
    setTreatment(DEFAULT_TREATMENT);
    setError(null);
    setStatus(cutout ? "ready" : "idle");
    setProgress(null);
  }, [cutout]);

  const working = useMemo(() => {
    if (!treatment.removeBackground || !cutout) return original;
    if (treatment.shadow && shadowed) return shadowed;
    return cutout;
  }, [original, cutout, shadowed, treatment]);

  const exportWorking = useCallback(async (opts: Partial<ExportOptions> = {}) => {
    if (!treatment.removeBackground || !cutout) return null;
    let canvas: HTMLCanvasElement;
    if (treatment.shadow && shadowCanvasRef.current) {
      canvas = shadowCanvasRef.current;
    } else {
      const img = await loadDrawable(cutout);
      canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
    }
    return exportForUpload(canvas, { transparent: true, ...opts });
  }, [treatment, cutout]);

  const busy = status === "loading-model" || status === "processing";

  return {
    state: { original, cutout, treatment, status, progress, error, supported },
    working,
    setRemoveBackground,
    setShadow,
    undo,
    exportWorking,
    busy,
  };
}
