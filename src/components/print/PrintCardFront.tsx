/**
 * PrintCardFront — the real canonical ProdigyChain card chassis, ported from
 * prodigy-rankings/src/components/print/PrintCardFront.tsx for this club
 * microsite. Trimmed of everything that only makes sense for ranked hockey
 * players (Supabase photo lookup, EP team-logo fetch, nationality flags) —
 * this project's cards are always off-database (player_id 0), always carry a
 * direct-uploaded photo, and always carry a direct club-crest URL, so those
 * paths never fire in the original component anyway. Geometry, frame art,
 * fonts and layout are unchanged so a Colts card looks exactly like a real
 * ProdigyCard, not a lookalike.
 *
 * Adds one thing the original doesn't have: live pan/zoom editing (drag to
 * pan, +/− to zoom), using the SAME percent-based transform math the static
 * render uses — so what a parent drags into place during creation is pixel-
 * identical to what prints, no separate "editor" template to fall out of sync.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus, RotateCcw, RotateCcwSquare, RotateCwSquare } from "lucide-react";
import { CardTemplate } from "@/lib/cardTemplates";
import { CardPlayer } from "@/lib/cardPlayer";
import { PRINT } from "@/lib/printSpec";
import silhouetteFootball from "@/assets/silhouette-football.png";
import silhouetteCheer from "@/assets/silhouette-cheer.png";
import silhouetteSoccer from "@/assets/silhouette-soccer.png";
import { getFlagNode } from "@/utils/countryFlags";

export interface PhotoTransform {
  /** translate as a % of the photo element's own size (matches CSS % semantics). */
  x: number;
  y: number;
  /** zoom; 1 = cover fit. */
  scale: number;
  /** clockwise degrees, 0-359; turns a sideways phone photo upright. */
  rotate: number;
}

export const DEFAULT_PHOTO_TRANSFORM: PhotoTransform = { x: 0, y: 0, scale: 1, rotate: 0 };

/** Aspect (w/h) of the photo element: it fills the trim box. */
const PHOTO_BOX_ASPECT = PRINT.TRIM_W / PRINT.TRIM_H;

/**
 * Extra scale so a ROTATED photo still covers its box.
 *
 * object-cover only guarantees coverage at 0 degrees. Rotate the element and
 * its axis-aligned footprint changes, so the corners show card background. For
 * a w x h box turned by t the element spans w|cos t| + h|sin t| across and
 * w|sin t| + h|cos t| down, so covering again needs the larger ratio.
 *
 * The box is 5:7, so a quarter turn needs 1.4x. Measured without this: 28.57%
 * of the window renders as background at 90 degrees, which is exactly 2/7.
 */
export function photoCoverScale(rotateDeg: number, aspect = PHOTO_BOX_ASPECT): number {
  const t = (((rotateDeg % 360) + 360) % 360) * (Math.PI / 180);
  const c = Math.abs(Math.cos(t));
  const s = Math.abs(Math.sin(t));
  const w = aspect;
  const h = 1;
  return Math.max((w * c + h * s) / w, (w * s + h * c) / h);
}

/**
 * CSS transform for the photo. Order matters: scale, then rotate, then
 * translate, so panning stays screen-aligned instead of rotating with the
 * image. With no rotation this emits exactly the string it always did, so
 * every card made before rotation existed renders byte-identically.
 */
export function photoTransformCss(t: { x?: number; y?: number; scale?: number; rotate?: number }): string {
  const x = t.x ?? 0;
  const y = t.y ?? 0;
  const scale = t.scale ?? 1;
  const rotate = t.rotate ?? 0;
  if (!rotate) return `translate(${x}%, ${y}%) scale(${scale})`;
  return `translate(${x}%, ${y}%) rotate(${rotate}deg) scale(${scale * photoCoverScale(rotate)})`;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.2;

function clampTransform(t: PhotoTransform): PhotoTransform {
  return {
    scale: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, t.scale)),
    x: t.x,
    y: t.y,
    // wraps rather than clamps: clamping would turn a -90 quarter turn into 0.
    rotate: (((Math.round(t.rotate ?? 0) % 360) + 360) % 360),
  };
}

export interface PrintCardFrontProps {
  player: CardPlayer;
  template: CardTemplate;
  photoUrl?: string | null;
  jerseyNumber?: string;
  photoTransform?: PhotoTransform;
  /** when provided, the photo becomes editable: drag to pan, buttons to zoom. */
  onPhotoTransformChange?: (t: PhotoTransform) => void;
  clubLogoUrl?: string;
  /** "Football" | "Cheer" | "Soccer" — selects the no-photo silhouette. */
  program?: string;
  className?: string;
  style?: React.CSSProperties;
}

const nameSize = (s: string) => (s.length > 22 ? "6cqw" : s.length > 17 ? "7.2cqw" : s.length > 12 ? "8.4cqw" : "10cqw");

const getSilhouette = (program?: string) =>
  program === "Cheer" ? silhouetteCheer : program === "Soccer" ? silhouetteSoccer : silhouetteFootball;

/** The photo layer: static render when onChange is omitted, drag-to-pan +
 *  buttons-to-zoom when provided. Percent-based transform, matches the print
 *  export 1:1 — no separate editor coordinate system. */
function PhotoLayer({
  src, transform, onChange,
}: { src: string; transform: PhotoTransform; onChange?: (t: PhotoTransform) => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const dragStart = useRef<{ px: number; py: number; tx: number; ty: number } | null>(null);

  const apply = (next: PhotoTransform) => onChange?.(clampTransform(next));

  const onPointerDown = (e: React.PointerEvent) => {
    if (!onChange) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    dragStart.current = { px: e.clientX, py: e.clientY, tx: transform.x, ty: transform.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!onChange || !dragStart.current || !boxRef.current) return;
    const w = boxRef.current.clientWidth || 1;
    const h = boxRef.current.clientHeight || 1;
    const dxPct = ((e.clientX - dragStart.current.px) / w) * 100;
    const dyPct = ((e.clientY - dragStart.current.py) / h) * 100;
    apply({ ...transform, x: dragStart.current.tx + dxPct, y: dragStart.current.ty + dyPct });
  };
  const onPointerEnd = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    dragStart.current = null;
  };

  return (
    <div
      ref={boxRef}
      className={`absolute inset-0 h-full w-full overflow-hidden ${onChange ? "cursor-grab active:cursor-grabbing" : ""}`}
      style={onChange ? { touchAction: "none" } : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-top"
        style={{ transform: photoTransformCss(transform) }}
      />
      {onChange && (
        <div className="absolute bottom-[4%] right-[4%] z-20 flex gap-1" onPointerDown={(e) => e.stopPropagation()}>
          {[
            { icon: Minus, act: () => apply({ ...transform, scale: transform.scale - ZOOM_STEP }), label: "Zoom out" },
            { icon: Plus, act: () => apply({ ...transform, scale: transform.scale + ZOOM_STEP }), label: "Zoom in" },
            { icon: RotateCcwSquare, act: () => apply({ ...transform, rotate: (transform.rotate ?? 0) - 90 }), label: "Rotate left" },
            { icon: RotateCwSquare, act: () => apply({ ...transform, rotate: (transform.rotate ?? 0) + 90 }), label: "Rotate right" },
            { icon: RotateCcw, act: () => onChange(DEFAULT_PHOTO_TRANSFORM), label: "Reset photo position" },
          ].map(({ icon: Icon, act, label }) => (
            <button
              key={label} type="button" aria-label={label} onClick={act}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white/90 backdrop-blur-sm transition hover:bg-black/80"
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const PrintCardFront = ({
  player, template, photoUrl, jerseyNumber, photoTransform, onPhotoTransformChange,
  clubLogoUrl, program, className = "", style,
}: PrintCardFrontProps) => {
  const [photoError, setPhotoError] = useState(false);
  useEffect(() => setPhotoError(false), [photoUrl]);

  // Defaults to USA for cards saved before nationality was collected (and the
  // homepage team-level featured card, which has no individual player).
  const flagNode = getFlagNode(player.nationality_name || "USA");

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: PRINT.ARTBOARD_RATIO, background: "transparent", ...style }}
    >
      <div
        className="absolute"
        style={{
          top: `${PRINT.BLEED_PCT_H}%`, bottom: `${PRINT.BLEED_PCT_H}%`,
          left: `${PRINT.BLEED_PCT_W}%`, right: `${PRINT.BLEED_PCT_W}%`,
          containerType: "inline-size",
        }}
      >
        <div className="absolute inset-0" style={{ background: template.background }} />

        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {photoUrl && !photoError ? (
            <PhotoLayer
              src={photoUrl}
              transform={photoTransform ?? DEFAULT_PHOTO_TRANSFORM}
              onChange={onPhotoTransformChange}
            />
          ) : (
            <img
              src={getSilhouette(program)}
              alt=""
              className="h-[70%] w-auto object-contain mix-blend-multiply"
              style={{ transform: "translateY(-4%) scale(1.12)" }}
            />
          )}
        </div>

        <img src={template.frame} alt="" className="absolute inset-0 h-full w-full object-cover" />

        {jerseyNumber && (
          <div className="absolute left-[6%] top-[3.5%] font-['Rift',Impact,sans-serif] font-bold italic text-white drop-shadow-lg" style={{ fontSize: "7cqw" }}>
            #{jerseyNumber}
          </div>
        )}
        <div className="absolute right-[6%] top-[3.5%] font-['Rift',Impact,sans-serif] font-bold italic text-white drop-shadow-lg" style={{ fontSize: "7cqw" }}>
          {player.position}
        </div>

        <div className="absolute inset-x-0 bottom-[7.5%] px-[6%] text-center">
          <div className="truncate font-['Rift',Impact,sans-serif] font-bold italic text-white drop-shadow-lg" style={{ fontSize: nameSize(player.player_name) }}>
            {player.player_name.toUpperCase()}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-[3.2%] px-[10%] text-center">
          <div className="truncate font-['Rift',Impact,sans-serif] font-bold italic text-white/90 drop-shadow" style={{ fontSize: "3.6cqw" }}>
            {player.current_team?.toUpperCase()}
          </div>
        </div>

        {/* Nationality flag, real per-player flag (ported 2026-08-21 from
            prodigy-rankings getFlagNode/cardFlagClass via @/utils/countryFlags,
            same package and framing as the ranked chassis). Families pick a
            nation in the card creator, default USA. Bottom-right mirrors the
            club crest bottom-left. */}
        {flagNode && (
          <div className="absolute bottom-[3.5%] right-[6%]" style={{ width: "11cqw", height: "11cqw" }}>
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
              {flagNode}
            </div>
          </div>
        )}
        {clubLogoUrl && (
          <div className="absolute bottom-[3.5%] left-[6%]" style={{ width: "11cqw", height: "11cqw" }}>
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
              <img src={clubLogoUrl} alt="" className="h-full w-full object-contain p-[1cqw]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintCardFront;
