/**
 * Turn a treated canvas into an upload-ready file: WebP with alpha where the
 * browser can encode it, PNG otherwise, stepping down the size ladder until the
 * file fits the 3 MB raw budget. Browser only.
 */

import { TreatmentError, type ExportedPhoto } from "./types";
import { fitForUpload, pickExportFormat, MAX_UPLOAD_RAW_BYTES, type ExportFormat } from "./core";

let webpProbe: boolean | null = null;

/** Safari says yes to toBlob("image/webp") and hands back a PNG. Probe once. */
export function canEncodeWebp(): boolean {
  if (webpProbe !== null) return webpProbe;
  try {
    const c = document.createElement("canvas");
    c.width = 2; c.height = 2;
    webpProbe = c.toDataURL("image/webp").startsWith("data:image/webp");
  } catch {
    webpProbe = false;
  }
  return webpProbe;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: ExportFormat, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob returned null"))), type, quality);
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error ?? new Error("FileReader failed"));
    r.readAsDataURL(blob);
  });
}

function scaled(src: HTMLCanvasElement, width: number, height: number): HTMLCanvasElement {
  if (src.width === width && src.height === height) return src;
  const c = document.createElement("canvas");
  c.width = width; c.height = height;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("export: 2D context unavailable");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src, 0, 0, width, height);
  return c;
}

export interface ExportOptions {
  /** True when the canvas carries alpha (cutout). Opaque photos stay JPEG. */
  transparent: boolean;
  /** Override the raw byte budget (tests). */
  maxBytes?: number;
  /** Override the size ladder limits (club sites use a smaller ladder for localStorage). */
  limits?: { minShort?: number; maxLong?: number };
}

/**
 * Walk the size ladder largest-first and return the first encoding under budget.
 * Throws TreatmentError("TOO_LARGE") when even the floor rung is over budget.
 */
export async function exportForUpload(canvas: HTMLCanvasElement, options: ExportOptions): Promise<ExportedPhoto> {
  const format = pickExportFormat(options.transparent, canEncodeWebp());
  const quality = format === "image/webp" ? 0.92 : format === "image/jpeg" ? 0.9 : undefined;
  const budget = options.maxBytes ?? MAX_UPLOAD_RAW_BYTES;
  const rungs = fitForUpload({ width: canvas.width, height: canvas.height }, options.limits);
  let last: { blob: Blob; width: number; height: number } | null = null;
  for (const rung of rungs) {
    const c = scaled(canvas, rung.width, rung.height);
    const blob = await canvasToBlob(c, format, quality);
    last = { blob, width: rung.width, height: rung.height };
    if (blob.size <= budget) {
      return { blob, dataUrl: await blobToDataUrl(blob), contentType: format, width: rung.width, height: rung.height };
    }
  }
  throw new TreatmentError(
    "TOO_LARGE",
    `Even at ${last?.width}x${last?.height} the ${format} is ${last ? Math.round(last.blob.size / 1024) : "?"} KB, over the ${Math.round(budget / 1024)} KB upload limit.`,
  );
}

/** Smaller ladder for browser storage (club sites keep the photo in localStorage). */
export async function exportForStorage(canvas: HTMLCanvasElement, transparent: boolean): Promise<ExportedPhoto> {
  const maxLong = canEncodeWebp() ? 1400 : 1200;
  return exportForUpload(canvas, { transparent, limits: { minShort: 0, maxLong }, maxBytes: 1.6 * 1024 * 1024 });
}
