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
import { useMemo } from "react";
import silhouetteFootball from "@/assets/silhouette-football.png";
import silhouetteCheer from "@/assets/silhouette-cheer.png";
import silhouetteSoccer from "@/assets/silhouette-soccer.png";

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
}

const POSITION_ABBREV: Record<string, string> = {
  Quarterback: "QB", "Running Back": "RB", "Wide Receiver": "WR", "Tight End": "TE",
  "Offensive Line": "OL", "Defensive Line": "DL", Linebacker: "LB", Cornerback: "CB",
  Safety: "S", Kicker: "K", Athlete: "ATH",
  Flyer: "FLY", Base: "BASE", Backspot: "BS", Tumbler: "TUM", Dancer: "DAN",
};

/** octagon: clipped corners, the canonical shield window */
const OCTAGON = "polygon(12% 0%, 88% 0%, 100% 8%, 100% 92%, 88% 100%, 12% 100%, 0% 92%, 0% 8%)";

export default function CardFrame({
  photo, name, number, position, program, teamLine, seasonLine, logo,
  accent, serial = "1/1", className = "",
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
            <div className="h-full w-full bg-cover bg-top" style={{ backgroundImage: `url('${photo}')` }} />
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
