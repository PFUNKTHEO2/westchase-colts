/**
 * Photo treatment: the two options a card creator can apply to their photo
 * before it becomes the card asset. Both are baked into the exported image, so
 * nothing downstream (PrintCardFront, buildRenderUrl, print, club-site copies)
 * needs to know about them. See docs/PHOTO_TREATMENT.md.
 *
 * This folder is copied verbatim into each club microsite repo (same rule as
 * printSpec.ts). Keep it free of app-specific imports.
 */

export interface PhotoTreatment {
  /** Background removed (matte applied, transparent PNG/WebP). */
  removeBackground: boolean;
  /** Fixed drop shadow drawn behind the cutout. Only meaningful when removeBackground is on. */
  shadow: boolean;
}

export const DEFAULT_TREATMENT: PhotoTreatment = { removeBackground: false, shadow: false };

export type TreatmentPhase = "download" | "model" | "infer" | "compose";

export interface TreatmentProgress {
  phase: TreatmentPhase;
  /** 0..1 when known (download), undefined for indeterminate phases. */
  pct?: number;
  /** Bytes for the download phase, when the loader reports them. */
  loaded?: number;
  total?: number;
}

export type TreatmentErrorCode = "UNSUPPORTED" | "MODEL_LOAD" | "INFER" | "TOO_LARGE" | "ABORTED";

export class TreatmentError extends Error {
  code: TreatmentErrorCode;
  constructor(code: TreatmentErrorCode, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "TreatmentError";
    this.code = code;
  }
}

/** Fixed shadow look, decided 2026-09-05: soft, dark, slightly down and right.
 *  Fractions are of the cutout's LONG side so the look scales with the photo. */
export const SHADOW_DEFAULTS = {
  /** Gaussian blur radius as a fraction of the long side. */
  blur: 0.03,
  /** Horizontal offset (positive = right). */
  dx: 0.01,
  /** Vertical offset (positive = down). */
  dy: 0.015,
  color: "rgba(0,0,0,0.55)",
} as const;

export type ShadowOptions = { blur: number; dx: number; dy: number; color: string };

export interface ExportedPhoto {
  blob: Blob;
  dataUrl: string;
  contentType: "image/png" | "image/webp" | "image/jpeg";
  width: number;
  height: number;
}
