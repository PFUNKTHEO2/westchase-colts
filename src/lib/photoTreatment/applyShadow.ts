/**
 * Draw the fixed drop shadow behind a cutout, on a canvas padded so nothing
 * clips. Browser only (canvas 2D). The shadow is part of the exported pixels,
 * which is why no renderer, render URL, or database column knows about it.
 */

import { SHADOW_DEFAULTS, type ShadowOptions } from "./types";
import { rotatedOffset, shadowPadding } from "./core";

export interface ApplyShadowOptions extends Partial<ShadowOptions> {
  /** Quarter-turn rotation the creator applied to the photo (club sites). The
   *  offset is counter-rotated so the light still falls down-right on the card. */
  rotateDeg?: number;
}

/** Source types the canvas can draw directly. */
export type DrawableImage = HTMLImageElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas;

function sizeOf(img: DrawableImage): { width: number; height: number } {
  if (img instanceof HTMLImageElement) return { width: img.naturalWidth || img.width, height: img.naturalHeight || img.height };
  return { width: img.width, height: img.height };
}

/**
 * Returns a new canvas: [padding][cutout with shadow][padding]. The cutout is
 * drawn at its native pixel size; only the canvas grows, by `shadowPadding`
 * on every side (about 3 to 4 percent, absorbed by object-cover on the card).
 */
export function applyShadow(cutout: DrawableImage, options: ApplyShadowOptions = {}): HTMLCanvasElement {
  const opts: ShadowOptions = {
    blur: options.blur ?? SHADOW_DEFAULTS.blur,
    dx: options.dx ?? SHADOW_DEFAULTS.dx,
    dy: options.dy ?? SHADOW_DEFAULTS.dy,
    color: options.color ?? SHADOW_DEFAULTS.color,
  };
  const { width, height } = sizeOf(cutout);
  const long = Math.max(width, height);
  const pad = shadowPadding(width, height, opts);
  const { dx, dy } = rotatedOffset(opts.dx, opts.dy, options.rotateDeg ?? 0);

  const canvas = document.createElement("canvas");
  canvas.width = width + pad * 2;
  canvas.height = height + pad * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("applyShadow: 2D context unavailable");

  // Shadow pass: draw the cutout with canvas shadow enabled, then erase the
  // cutout itself so only the shadow remains. destination-out with the same
  // shape leaves the blurred silhouette behind the subject.
  ctx.save();
  ctx.shadowColor = opts.color;
  ctx.shadowBlur = long * opts.blur;
  ctx.shadowOffsetX = long * dx;
  ctx.shadowOffsetY = long * dy;
  ctx.drawImage(cutout, pad, pad, width, height);
  ctx.restore();
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.drawImage(cutout, pad, pad, width, height);
  ctx.restore();

  // Subject pass on top, no shadow.
  ctx.drawImage(cutout, pad, pad, width, height);
  return canvas;
}
