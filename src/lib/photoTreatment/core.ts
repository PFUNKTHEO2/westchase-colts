/**
 * Pure helpers for the photo treatment. No DOM, no canvas, no model: everything
 * here runs in Node so it can be unit-tested with sharp fixtures
 * (tests/photo-treatment/core.test.ts). The browser adapters live next door.
 */

import type { ShadowOptions } from "./types";
import { SHADOW_DEFAULTS } from "./types";

/** Print floor from api/_lib/photo-checks.ts: 825x1125 px. A treated photo must
 *  never drop below the 1125 short side or the photo gate rejects it as LOW_RES. */
export const MIN_SHORT_SIDE = 1125;
/** Cap the long side so a phone original does not become a 30 MB PNG. */
export const MAX_LONG_SIDE = 2400;
/** Upload endpoints cap at 4 MB decoded; Vercel body limit is ~4.5 MB and base64
 *  adds a third, so the raw file has to stay under about 3 MB. */
export const MAX_UPLOAD_RAW_BYTES = 3.0 * 1024 * 1024;

/** Apply a soft matte (0..255 per pixel) to an RGBA buffer, in place on a copy.
 *  Matte 0 → fully transparent, 255 → untouched. RGB is preserved so a later
 *  un-premultiplied export keeps the original colors at the edges. */
export function applyMatte(rgba: Uint8ClampedArray, matte: Uint8Array | Uint8ClampedArray, width: number, height: number): Uint8ClampedArray {
  const n = width * height;
  if (rgba.length !== n * 4) throw new Error(`applyMatte: rgba length ${rgba.length} != ${n * 4}`);
  if (matte.length !== n) throw new Error(`applyMatte: matte length ${matte.length} != ${n}`);
  const out = new Uint8ClampedArray(rgba);
  for (let i = 0; i < n; i++) {
    const a = out[i * 4 + 3];
    // Combine with any alpha the source already had (a PNG upload can carry one).
    out[i * 4 + 3] = Math.round((a * matte[i]) / 255);
  }
  return out;
}

/** True when any pixel is not fully opaque. */
export function hasAlpha(rgba: Uint8ClampedArray | Uint8Array): boolean {
  for (let i = 3; i < rgba.length; i += 4) {
    if (rgba[i] !== 255) return true;
  }
  return false;
}

/** Pixels of padding needed on every side so the shadow is never clipped:
 *  two blur radii plus the larger offset, all fractions of the long side. */
export function shadowPadding(width: number, height: number, opts: ShadowOptions = SHADOW_DEFAULTS): number {
  const long = Math.max(width, height);
  return Math.ceil(long * (2 * opts.blur + Math.max(Math.abs(opts.dx), Math.abs(opts.dy))));
}

/** Rotate the shadow offset so the light keeps falling down-right on a photo the
 *  creator has turned by a quarter (club sites allow 90-degree rotation). */
export function rotatedOffset(dx: number, dy: number, rotateDeg: number): { dx: number; dy: number } {
  const r = ((Math.round(rotateDeg / 90) % 4) + 4) % 4;
  switch (r) {
    case 1: return { dx: dy, dy: -dx };
    case 2: return { dx: -dx, dy: -dy };
    case 3: return { dx: -dy, dy: dx };
    default: return { dx, dy };
  }
}

/** Candidate output sizes for upload, largest first. Each keeps the aspect
 *  ratio, never exceeds MAX_LONG_SIDE, and never drops the short side below
 *  MIN_SHORT_SIDE (the last rung is the floor itself when the source allows). A
 *  source already under the floor is returned as-is: the gate will say LOW_RES
 *  with a useful message, which is better than upscaling. */
export function fitForUpload(
  size: { width: number; height: number },
  limits: { minShort?: number; maxLong?: number } = {},
): Array<{ width: number; height: number }> {
  const minShort = limits.minShort ?? MIN_SHORT_SIDE;
  const maxLong = limits.maxLong ?? MAX_LONG_SIDE;
  const { width, height } = size;
  const long = Math.max(width, height);
  const short = Math.min(width, height);
  if (short <= minShort) return [{ width, height }];
  const ratio = short / long;
  const rungs = [maxLong, 2000, 1600].filter((l) => l < long);
  const out: Array<{ width: number; height: number }> = [];
  const push = (l: number) => {
    const s = Math.round(l * ratio);
    if (s < minShort) return;
    const dims = width >= height ? { width: l, height: s } : { width: s, height: l };
    if (!out.some((d) => d.width === dims.width && d.height === dims.height)) out.push(dims);
  };
  if (long <= maxLong) push(long);
  for (const l of rungs) push(l);
  // Floor rung: short side exactly at the minimum.
  push(Math.round(minShort / ratio));
  return out;
}

export type ExportFormat = "image/webp" | "image/png" | "image/jpeg";

/** WebP keeps alpha at a fraction of PNG size, but only where the browser can
 *  encode it (Chrome, Firefox, Android). Safari falls back to PNG. Opaque photos
 *  keep going out as JPEG exactly as before. */
export function pickExportFormat(transparent: boolean, webpEncodable: boolean): ExportFormat {
  if (!transparent) return "image/jpeg";
  return webpEncodable ? "image/webp" : "image/png";
}

export function extensionFor(format: ExportFormat): "webp" | "png" | "jpg" {
  return format === "image/webp" ? "webp" : format === "image/png" ? "png" : "jpg";
}
