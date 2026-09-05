/**
 * In-browser background removal via transformers.js (ONNX Runtime Web, WebGPU
 * with WASM fallback). The library and the model are loaded lazily on the first
 * call so the main bundle does not carry them; the browser Cache API keeps the
 * model after the first download.
 *
 * Model choice (Apache-2.0, commercial-safe): Xenova/modnet (portrait matting)
 * by default; onnx-community/ormbg-ONNX is the heavier, more general swap. Both
 * are served through the `background-removal` pipeline and return RGBA images.
 * Set VITE_PHOTO_TREATMENT_MODEL / VITE_PHOTO_TREATMENT_MODEL_HOST to override
 * without a code change (see docs/PHOTO_TREATMENT.md).
 */

import { TreatmentError, type TreatmentProgress } from "./types";
import { MAX_LONG_SIDE } from "./core";

type Env = Record<string, string | undefined>;
const viteEnv: Env = (typeof import.meta !== "undefined" && (import.meta as unknown as { env?: Env }).env) || {};

export const MODEL_ID = viteEnv.VITE_PHOTO_TREATMENT_MODEL || "Xenova/modnet";
/** When set, models are fetched from `${MODEL_HOST}/${model}/` (self-hosted
 *  mirror, e.g. a public Supabase bucket) instead of the Hugging Face Hub. */
export const MODEL_HOST = viteEnv.VITE_PHOTO_TREATMENT_MODEL_HOST || "";

type Segmenter = (input: unknown) => Promise<Array<{ width: number; height: number; toCanvas(): HTMLCanvasElement; toBlob(type?: string, quality?: number): Promise<Blob> }>>;

let segmenterPromise: Promise<Segmenter> | null = null;
let device: "webgpu" | "wasm" | null = null;

/** Canvas + Blob + WebAssembly are the floor; WebGPU is a bonus. */
export function isSupported(): boolean {
  if (typeof document === "undefined" || typeof WebAssembly === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!c.getContext("2d") && typeof c.toBlob === "function";
  } catch {
    return false;
  }
}

export function currentDevice(): "webgpu" | "wasm" | null {
  return device;
}

async function pickDevice(): Promise<"webgpu" | "wasm"> {
  const gpu = (navigator as unknown as { gpu?: { requestAdapter?: () => Promise<unknown> } }).gpu;
  if (gpu?.requestAdapter) {
    try {
      const adapter = await gpu.requestAdapter();
      if (adapter) return "webgpu";
    } catch {
      /* fall through */
    }
  }
  return "wasm";
}

function forwardProgress(onProgress?: (p: TreatmentProgress) => void) {
  return (info: { status?: string; loaded?: number; total?: number; progress?: number }) => {
    if (!onProgress) return;
    if (info.status === "progress" || info.status === "download") {
      const total = info.total ?? 0;
      const loaded = info.loaded ?? 0;
      onProgress({ phase: "download", pct: total ? loaded / total : info.progress != null ? info.progress / 100 : undefined, loaded, total });
    } else if (info.status === "initiate" || info.status === "done") {
      onProgress({ phase: "model" });
    } else if (info.status === "ready") {
      onProgress({ phase: "infer" });
    }
  };
}

/** Load (once) the library and the model. Call early (when the photo step
 *  mounts) to hide the download behind the creator's other steps. */
export function preloadModel(onProgress?: (p: TreatmentProgress) => void): Promise<void> {
  return getSegmenter(onProgress).then(() => undefined);
}

async function getSegmenter(onProgress?: (p: TreatmentProgress) => void): Promise<Segmenter> {
  if (!segmenterPromise) {
    segmenterPromise = (async () => {
      if (!isSupported()) throw new TreatmentError("UNSUPPORTED", "This browser cannot run background removal.");
      let tf: typeof import("@huggingface/transformers");
      try {
        tf = await import("@huggingface/transformers");
      } catch (cause) {
        throw new TreatmentError("MODEL_LOAD", "Could not load the photo tool.", { cause });
      }
      const { env, pipeline } = tf;
      if (MODEL_HOST) {
        env.remoteHost = MODEL_HOST.replace(/\/+$/, "") + "/";
        env.remotePathTemplate = "{model}/";
      }
      env.allowLocalModels = false;
      env.useBrowserCache = true;
      device = await pickDevice();
      try {
        const seg = await pipeline("background-removal", MODEL_ID, {
          device,
          dtype: device === "webgpu" ? "fp16" : "q8",
          progress_callback: forwardProgress(onProgress),
        });
        return seg as unknown as Segmenter;
      } catch (cause) {
        if (device === "webgpu") {
          // WebGPU adapters exist on machines whose driver still fails at
          // session creation; retry once on WASM before giving up.
          device = "wasm";
          try {
            const seg = await pipeline("background-removal", MODEL_ID, {
              device: "wasm",
              dtype: "q8",
              progress_callback: forwardProgress(onProgress),
            });
            return seg as unknown as Segmenter;
          } catch (cause2) {
            throw new TreatmentError("MODEL_LOAD", "Could not load the photo tool.", { cause: cause2 });
          }
        }
        throw new TreatmentError("MODEL_LOAD", "Could not load the photo tool.", { cause });
      }
    })();
    segmenterPromise.catch(() => {
      segmenterPromise = null; // allow a retry after a transient failure
    });
  }
  return segmenterPromise;
}

/** Decode a data/object URL into something a canvas can draw, capped in size so
 *  Safari's canvas-area limit is never hit (same gotcha cropImage.ts documents). */
export async function loadDrawable(src: string, maxSide = MAX_LONG_SIDE * 2): Promise<HTMLImageElement | HTMLCanvasElement> {
  // Plain <img> decode + canvas scale. createImageBitmap with resize options
  // throws "The ImageBitmap could not be allocated" on large sources in some
  // Chromium builds (seen headless, 3558 px), and Safari ignores the options.
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.decoding = "async";
    el.onload = () => resolve(el);
    el.onerror = () => reject(new TreatmentError("INFER", "image decode failed"));
    el.src = src;
  });
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  const long = Math.max(w, h);
  if (long <= maxSide) return img;
  const scale = maxSide / long;
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w * scale));
  c.height = Math.max(1, Math.round(h * scale));
  const ctx = c.getContext("2d");
  if (!ctx) throw new TreatmentError("UNSUPPORTED", "2D canvas unavailable");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, c.width, c.height);
  return c;
}

export interface RemoveBackgroundOptions {
  onProgress?: (p: TreatmentProgress) => void;
  signal?: AbortSignal;
  /** Long-side cap for the cutout. Defaults to the upload cap. */
  maxSide?: number;
}

/**
 * Remove the background from a photo (data URL, object URL, or http URL) and
 * return a PNG data URL with alpha at the capped source resolution.
 */
export async function removeBackground(src: string, options: RemoveBackgroundOptions = {}): Promise<string> {
  const { onProgress, signal } = options;
  const maxSide = options.maxSide ?? MAX_LONG_SIDE;
  const throwIfAborted = () => {
    if (signal?.aborted) throw new TreatmentError("ABORTED", "Cancelled.");
  };

  const seg = await getSegmenter(onProgress);
  throwIfAborted();

  // Feed the model a capped copy: it downsamples internally anyway and a full
  // 12 MP phone JPEG only costs decode time and memory.
  const drawable = await loadDrawable(src, maxSide);
  const input = document.createElement("canvas");
  input.width = drawable.width;
  input.height = drawable.height;
  input.getContext("2d")!.drawImage(drawable, 0, 0);
  throwIfAborted();

  onProgress?.({ phase: "infer" });
  let out: Awaited<ReturnType<Segmenter>>;
  try {
    out = await seg(input);
  } catch (cause) {
    throw new TreatmentError("INFER", "Background removal failed.", { cause });
  }
  throwIfAborted();
  const first = out?.[0];
  if (!first) throw new TreatmentError("INFER", "Background removal returned nothing.");

  // The pipeline returns the input with the matte applied as alpha. If it comes
  // back at a different size (some processors square the tensor), stretch it
  // back to the input dimensions so aspect and resolution are preserved.
  const result = first.toCanvas();
  const full = document.createElement("canvas");
  full.width = input.width;
  full.height = input.height;
  const ctx = full.getContext("2d", { willReadFrequently: true })!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(result, 0, 0, full.width, full.height);

  // Sanity gate, learned from the 2026-09-05 bake-off: a portrait matter can
  // erase most of an action shot (a goalie against white boards came back as
  // a few floating pads). If almost nothing survived, report a failure so the
  // creator keeps the original instead of shipping a fragment.
  const coverage = opaqueFraction(ctx, full.width, full.height);
  if (coverage < MIN_SUBJECT_COVERAGE) {
    throw new TreatmentError("INFER", `Background removal kept only ${(coverage * 100).toFixed(1)}% of the photo.`);
  }
  return full.toDataURL("image/png");
}

/** Fraction of the frame a cutout must keep to count as a usable subject. A
 *  half-body portrait fills 35 to 60 percent; a lost subject is under 5. */
export const MIN_SUBJECT_COVERAGE = 0.08;

function opaqueFraction(ctx: CanvasRenderingContext2D, width: number, height: number): number {
  // Sample on a coarse grid; exact counts are not needed for a sanity gate.
  const step = Math.max(1, Math.floor(Math.min(width, height) / 96));
  const { data } = ctx.getImageData(0, 0, width, height);
  let opaque = 0, total = 0;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      total++;
      if (data[(y * width + x) * 4 + 3] > 128) opaque++;
    }
  }
  return total ? opaque / total : 0;
}
