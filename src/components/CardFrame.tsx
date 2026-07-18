/**
 * CardFrame — the ProdigyChain card template, club edition.
 *
 * The frame IS the value-add (David 2026-07-16): dark field, chevron sidebars,
 * octagonal photo window, header (jersey · club crest · position), footer name
 * plate. Geometry follows the canonical ProdigyCard front; every color rides the
 * `accent` prop, so re-skinning for another club (FC Tampa Rangers, etc.) is a
 * color + logo swap, not a redesign. When there's no photo yet, a position
 * silhouette holds the window (David's Tampa Rangers pattern).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import silhouetteFootball from "@/assets/silhouette-football.png";
import silhouetteCheer from "@/assets/silhouette-cheer.png";
import silhouetteSoccer from "@/assets/silhouette-soccer.png";

/**
 * Photo placement inside the octagon window. x/y are the photo-center offset
 * from the window center as a fraction of window width/height; scale is zoom
 * (1 = cover fit). Size-independent, so a crop set in the creator renders the
 * same on any card size.
 */
export interface PhotoTransform {
  x: number;
  y: number;
  scale: number;
}

export const DEFAULT_PHOTO_TRANSFORM: PhotoTransform = { x: 0, y: 0, scale: 1 };

export interface CardFrameProps {
  photo?: string | null;
  name: string;
  number: string;
  /** full position label; abbreviated for the header badge */
  position?: string;
  /** "Football" | "Cheer" (drives the silhouette fallback) */
  program?: string;
  teamLine: string;    // "13U Football · Westchase Colts"
  seasonLine?: string; // "Fall 2026"
  logo?: string;
  /** hex or hsl() accent; defaults to the club primary via CSS var */
  accent?: string;
  serial?: string;
  className?: string;
  /** crop/zoom to apply to the photo; omit for the legacy top-cover crop */
  photoTransform?: PhotoTransform;
  /** when provided the photo becomes editable: drag to pan, pinch/buttons to zoom */
  onPhotoTransformChange?: (t: PhotoTransform) => void;
}

const POSITION_ABBREV: Record<string, string> = {
  Quarterback: "QB", "Running Back": "RB", "Wide Receiver": "WR", "Tight End": "TE",
  "Offensive Line": "OL", "Defensive Line": "DL", Linebacker: "LB", Cornerback: "CB",
  Safety: "S", Kicker: "K", Athlete: "ATH",
  Flyer: "FLY", Base: "BASE", Backspot: "BS", Tumbler: "TUM", Dancer: "DAN",
};

/** octagon: clipped corners, the canonical shield window */
const OCTAGON = "polygon(12% 0%, 88% 0%, 100% 8%, 100% 92%, 88% 100%, 12% 100%, 0% 92%, 0% 8%)";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.2;

/** clamp so the photo always covers the window: no gaps at any edge */
function clampTransform(t: PhotoTransform, baseW: number, baseH: number): PhotoTransform {
  const scale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, t.scale));
  const maxX = Math.max(0, (baseW * scale - 1) / 2);
  const maxY = Math.max(0, (baseH * scale - 1) / 2);
  return {
    scale,
    x: Math.min(maxX, Math.max(-maxX, t.x)),
    y: Math.min(maxY, Math.max(-maxY, t.y)),
  };
}

/**
 * The photo inside the window, with optional pan/zoom editing (David's
 * requirement: drag to the edges, zoom in and out, position in every
 * direction). Renders the image at its cover-fit size and moves it with a
 * clamped translate+scale, so whatever the parent frames is exactly what
 * prints.
 */
function CroppedPhoto({
  src,
  transform,
  onChange,
}: {
  src: string;
  transform: PhotoTransform;
  onChange?: (t: PhotoTransform) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [imgAspect, setImgAspect] = useState<number | null>(null);
  const tRef = useRef(transform);
  tRef.current = transform;
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const A = box.w > 0 && box.h > 0 ? box.w / box.h : 1;
  const I = imgAspect ?? A;
  const baseW = I > A ? I / A : 1;
  const baseH = I > A ? 1 : A / I;
  const t = clampTransform(transform, baseW, baseH);

  const apply = (next: PhotoTransform) => onChange?.(clampTransform(next, baseW, baseH));

  const onPointerDown = (e: React.PointerEvent) => {
    if (!onChange) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [p1, p2] = [...pointers.current.values()];
      pinchStart.current = { dist: Math.hypot(p1.x - p2.x, p1.y - p2.y), scale: tRef.current.scale };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!onChange || !pointers.current.has(e.pointerId)) return;
    const prev = pointers.current.get(e.pointerId)!;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinchStart.current) {
      const [p1, p2] = [...pointers.current.values()];
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      apply({ ...tRef.current, scale: (pinchStart.current.scale * dist) / pinchStart.current.dist });
    } else if (pointers.current.size === 1 && box.w > 0) {
      apply({
        ...tRef.current,
        x: tRef.current.x + (e.clientX - prev.x) / box.w,
        y: tRef.current.y + (e.clientY - prev.y) / box.h,
      });
    }
  };

  const onPointerEnd = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
  };

  return (
    <div
      ref={boxRef}
      className={`relative h-full w-full overflow-hidden ${onChange ? "cursor-grab active:cursor-grabbing" : ""}`}
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
        onLoad={(e) => setImgAspect(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)}
        className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
        style={{
          width: `${baseW * 100}%`,
          height: `${baseH * 100}%`,
          transform: `translate(-50%, -50%) translate(${t.x * box.w}px, ${t.y * box.h}px) scale(${t.scale})`,
        }}
      />
      {onChange && (
        <div className="absolute bottom-[4%] right-[4%] z-20 flex gap-1" onPointerDown={(e) => e.stopPropagation()}>
          {[
            { icon: Minus, act: () => apply({ ...t, scale: t.scale - ZOOM_STEP }), label: "Zoom out" },
            { icon: Plus, act: () => apply({ ...t, scale: t.scale + ZOOM_STEP }), label: "Zoom in" },
            { icon: RotateCcw, act: () => onChange(DEFAULT_PHOTO_TRANSFORM), label: "Reset photo position" },
          ].map(({ icon: Icon, act, label }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              onClick={act}
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

export default function CardFrame({
  photo, name, number, position, program, teamLine, seasonLine, logo,
  accent, serial = "1/1", className = "", photoTransform, onPhotoTransformChange,
}: CardFrameProps) {
  const ac = accent ?? "hsl(var(--primary))";
  // program → silhouette; Soccer is wired so the FC Tampa Rangers recolor is a
  // config swap, not new code.
  const silhouette =
    program === "Cheer" ? silhouetteCheer : program === "Soccer" ? silhouetteSoccer : silhouetteFootball;
  const posAbbrev = position
    ? POSITION_ABBREV[position] ??
      (position.length <= 3
        ? position.toUpperCase()
        : position.split(/\s+/).map((w) => w[0]).join("").slice(0, 3).toUpperCase())
    : "";

  // chevron sidebar texture in the accent color
  const chevron = useMemo(
    () => ({
      backgroundImage: `repeating-linear-gradient(45deg, ${ac} 0 6px, transparent 6px 14px)`,
      opacity: 0.85,
    }),
    [ac],
  );

  return (
    <div
      className={`relative flex h-full w-full flex-col overflow-hidden rounded-xl ${className}`}
      style={{ background: "linear-gradient(160deg, #0b0e14 0%, #10141d 55%, #0b0e14 100%)" }}
    >
      {/* dotted texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 0.5px, transparent 0.7px)", backgroundSize: "7px 7px" }}
      />
      {/* chevron sidebars */}
      <div className="pointer-events-none absolute bottom-[6%] left-[3%] top-[14%] w-[4.5%]" style={chevron} />
      <div className="pointer-events-none absolute bottom-[6%] right-[3%] top-[14%] w-[4.5%]" style={{ ...chevron, transform: "scaleX(-1)" }} />

      {/* header: number · crest · position */}
      <div className="relative z-10 flex items-center justify-between px-[7%] pt-[4.5%]">
        <span className="font-display text-[9cqw] font-bold italic leading-none text-white drop-shadow">#{number || "00"}</span>
        {logo ? <img src={logo} alt="" className="h-[9cqw] w-auto object-contain drop-shadow" /> : <span />}
        <span className="font-display text-[9cqw] font-bold italic leading-none text-white drop-shadow">{posAbbrev || "—"}</span>
      </div>

      {/* octagonal photo window */}
      <div className="relative z-10 mx-auto mt-[3%] w-[78%] flex-1" style={{ maxHeight: "58%" }}>
        <div className="absolute inset-0" style={{ clipPath: OCTAGON, background: ac }} />
        <div className="absolute inset-[2px]" style={{ clipPath: OCTAGON, background: "#141922" }}>
          {photo ? (
            photoTransform || onPhotoTransformChange ? (
              <CroppedPhoto
                src={photo}
                transform={photoTransform ?? DEFAULT_PHOTO_TRANSFORM}
                onChange={onPhotoTransformChange}
              />
            ) : (
              /* legacy top-cover crop for curated roster photos */
              <div className="h-full w-full bg-cover bg-top" style={{ backgroundImage: `url('${photo}')` }} />
            )
          ) : (
            <div className="flex h-full w-full items-end justify-center" style={{ background: `radial-gradient(90% 70% at 50% 30%, ${ac}33, transparent 70%)` }}>
              <img src={silhouette} alt="" className="h-[88%] w-auto object-contain opacity-80" />
            </div>
          )}
        </div>
      </div>

      {/* footer plate */}
      <div className="relative z-10 px-[8%] pb-[5%] pt-[3%] text-center">
        <div className="mx-auto mb-[2%] h-[2px] w-[62%]" style={{ background: `linear-gradient(90deg, transparent, ${ac}, transparent)` }} />
        <p className="truncate font-display text-[7.5cqw] font-bold uppercase italic leading-tight text-white">
          {name || "Player Name"}
        </p>
        <p className="mt-[1%] truncate text-[3.4cqw] font-semibold uppercase tracking-[0.22em] text-white/70">{teamLine}</p>
        <div className="mt-[2.5%] flex items-center justify-between text-[3cqw] font-semibold uppercase tracking-[0.18em] text-white/50">
          <span>{seasonLine ?? ""}</span>
          <span className="rounded-full border px-[2.5%] py-[0.8%]" style={{ borderColor: `${typeof ac === "string" && ac.startsWith("#") ? ac + "88" : ac}`, color: "white" }}>
            {serial}
          </span>
        </div>
      </div>
    </div>
  );
}

export interface CardBackFrameProps {
  name: string;
  number: string;
  teamLine: string;
  seasonLine?: string;
  /** the family's story; placeholder shown until written */
  blurb?: string;
  logo?: string;
  accent?: string;
  serial?: string;
  className?: string;
}

/**
 * The card back in the same template as the front (David 2026-07-18: "the back
 * template has to match the front template"): identical dark field, chevron
 * sidebars, header, and footer plate; the octagon window carries the family's
 * story instead of the photo. Recolors with the same `accent` prop.
 */
export function CardBackFrame({
  name, number, teamLine, seasonLine, blurb, logo, accent, serial = "1/1", className = "",
}: CardBackFrameProps) {
  const ac = accent ?? "hsl(var(--primary))";
  const chevron = {
    backgroundImage: `repeating-linear-gradient(45deg, ${ac} 0 6px, transparent 6px 14px)`,
    opacity: 0.85,
  };

  return (
    <div
      className={`relative flex h-full w-full flex-col overflow-hidden rounded-xl ${className}`}
      style={{ background: "linear-gradient(160deg, #0b0e14 0%, #10141d 55%, #0b0e14 100%)" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 0.5px, transparent 0.7px)", backgroundSize: "7px 7px" }}
      />
      <div className="pointer-events-none absolute bottom-[6%] left-[3%] top-[14%] w-[4.5%]" style={chevron} />
      <div className="pointer-events-none absolute bottom-[6%] right-[3%] top-[14%] w-[4.5%]" style={{ ...chevron, transform: "scaleX(-1)" }} />

      {/* header mirrors the front: number · crest · story marker */}
      <div className="relative z-10 flex items-center justify-between px-[7%] pt-[4.5%]">
        <span className="font-display text-[9cqw] font-bold italic leading-none text-white drop-shadow">#{number || "00"}</span>
        {logo ? <img src={logo} alt="" className="h-[9cqw] w-auto object-contain drop-shadow" /> : <span />}
        <span className="font-display text-[4cqw] font-bold italic uppercase leading-none tracking-[0.14em] text-white/60 drop-shadow">Story</span>
      </div>

      {/* octagonal story window, same geometry as the photo window */}
      <div className="relative z-10 mx-auto mt-[3%] w-[78%] flex-1" style={{ maxHeight: "58%" }}>
        <div className="absolute inset-0" style={{ clipPath: OCTAGON, background: ac }} />
        <div className="absolute inset-[2px] flex items-center overflow-hidden px-[8%] py-[6%]" style={{ clipPath: OCTAGON, background: "#141922" }}>
          <p className={`w-full text-center text-[3.8cqw] leading-relaxed ${blurb ? "text-white/90" : "italic text-white/40"}`}>
            {blurb || "Their story goes here. Written by the family, printed on the card, kept forever."}
          </p>
        </div>
      </div>

      {/* footer plate identical to the front */}
      <div className="relative z-10 px-[8%] pb-[5%] pt-[3%] text-center">
        <div className="mx-auto mb-[2%] h-[2px] w-[62%]" style={{ background: `linear-gradient(90deg, transparent, ${ac}, transparent)` }} />
        <p className="truncate font-display text-[7.5cqw] font-bold uppercase italic leading-tight text-white">
          {name || "Player Name"}
        </p>
        <p className="mt-[1%] truncate text-[3.4cqw] font-semibold uppercase tracking-[0.22em] text-white/70">{teamLine}</p>
        <div className="mt-[2.5%] flex items-center justify-between text-[3cqw] font-semibold uppercase tracking-[0.18em] text-white/50">
          <span>{seasonLine ?? ""}</span>
          <span className="rounded-full border px-[2.5%] py-[0.8%]" style={{ borderColor: `${typeof ac === "string" && ac.startsWith("#") ? ac + "88" : ac}`, color: "white" }}>
            {serial}
          </span>
        </div>
      </div>
    </div>
  );
}
