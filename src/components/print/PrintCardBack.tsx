/**
 * PrintCardBack — ported from prodigy-rankings/src/components/print/PrintCardBack.tsx.
 * Trimmed for this club microsite: no QR (no public ranked profile to link
 * to), no EP team-logo lookup (always a direct clubLogoUrl), no career-stats
 * table (Colts cards carry a family story, not a game log — see showStats
 * upstream, kept false here always) and no network-fetched curated blurb
 * (the family-authored story always wins). Same frame art, fonts, footer
 * badge layout as the canonical back.
 */
import { CardTemplate } from "@/lib/cardTemplates";
import { CardPlayer } from "@/lib/cardPlayer";
import { PRINT } from "@/lib/printSpec";

function accentFromGradient(gradient: string): string {
  const hexes = gradient.match(/#[0-9a-fA-F]{6}/g) ?? [];
  let best = "#9A4DFF";
  let bestSat = -1;
  for (const h of hexes) {
    const n = parseInt(h.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    if (sat > bestSat && lum > 45 && lum < 225) {
      best = h;
      bestSat = sat;
    }
  }
  return best;
}

const nameSize = (s: string) => (s.length > 22 ? "5cqw" : s.length > 16 ? "6cqw" : "7cqw");

const LEGAL =
  "This ProdigyCard is a certified collectible, serial-numbered in the ProdigyChain registry. All data and artwork are protected under ProdigyChain™. ©2026 ProdigyChain. All rights reserved.";

export interface PrintCardBackProps {
  player: CardPlayer;
  template: CardTemplate;
  serial?: string;
  /** the family's story. Falls back to a placeholder prompt when empty. */
  blurb?: string;
  jerseyNumber?: string;
  clubLogoUrl?: string;
  editionLabel?: string;
  accentColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

const PrintCardBack = ({
  player, template, serial = "1/1", blurb, jerseyNumber, clubLogoUrl, editionLabel, accentColor, className = "", style,
}: PrintCardBackProps) => {
  const accent = accentColor ?? accentFromGradient(template.background);
  const edition = editionLabel ?? template.label;
  const hasArt = Boolean(template.backFrame);
  const story = blurb?.trim() || "Their story goes here. Written by the family, printed on the card, kept forever.";

  const footerCols = 4 + (clubLogoUrl ? 1 : 0);
  const footerColsClass = footerCols === 5 ? "grid-cols-5" : "grid-cols-4";

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: PRINT.ARTBOARD_RATIO, background: "#0e0a16", ...style }}>
      {template.backFrame ? (
        <img src={template.backFrame} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <>
          <div className="absolute inset-0" style={{ background: `radial-gradient(120% 60% at 50% -10%, ${accent}22, transparent 60%)` }} />
          <div className="absolute inset-0 opacity-[0.14]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 0.5px, transparent 0.7px)", backgroundSize: "6px 6px" }} />
        </>
      )}

      {!hasArt && (
        <>
          <div className="absolute left-0 top-0 h-[24%] w-[34%]" style={{ background: `linear-gradient(135deg, ${accent}66, transparent 62%)`, clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
          <div className="absolute right-0 top-0 h-[20%] w-[28%]" style={{ background: `linear-gradient(225deg, ${accent}4d, transparent 62%)`, clipPath: "polygon(100% 0, 100% 100%, 0 0)" }} />
          <div className="absolute bottom-0 left-0 h-[20%] w-[28%]" style={{ background: `linear-gradient(45deg, ${accent}4d, transparent 62%)`, clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
          <div className="absolute bottom-0 right-0 h-[24%] w-[34%]" style={{ background: `linear-gradient(315deg, ${accent}66, transparent 62%)`, clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }} />
        </>
      )}

      <div
        className="absolute"
        style={{ top: `${PRINT.BLEED_PCT_H}%`, bottom: `${PRINT.BLEED_PCT_H}%`, left: `${PRINT.BLEED_PCT_W}%`, right: `${PRINT.BLEED_PCT_W}%`, containerType: "inline-size" }}
      >
        <div className="absolute inset-[5.5%] flex flex-col font-['Rift',Impact,sans-serif]">
          <div className="flex items-baseline gap-[2cqw]">
            <span
              className="w-[16%] font-bold italic"
              style={{ fontSize: "6.5cqw", background: template.background, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}
            >
              {jerseyNumber ? `#${jerseyNumber}` : ""}
            </span>
            <span className="flex-1 truncate text-center font-bold italic uppercase text-white" style={{ fontSize: nameSize(player.player_name) }}>
              {player.player_name}
            </span>
            <span className="w-[16%] text-right font-bold italic uppercase text-white" style={{ fontSize: "6.5cqw" }}>
              {player.position}
            </span>
          </div>
          <div className="mt-[1.5cqw] border-t" style={{ borderColor: `${accent}55` }} />

          {/* Story — the whole card back. No stats box: Colts cards carry a
              family story, never a game log. */}
          <div className="mt-[2.2cqw] flex min-h-0 flex-1 items-center rounded-[1.6cqw] border px-[2.4cqw] py-[2cqw]" style={{ borderColor: `${accent}66` }}>
            <p
              className={`w-full overflow-hidden text-center italic leading-relaxed ${blurb?.trim() ? "text-white/90" : "text-white/40"}`}
              style={{ fontSize: "3.4cqw", display: "-webkit-box", WebkitLineClamp: 12, WebkitBoxOrient: "vertical" }}
            >
              {story}
            </p>
          </div>

          <div className={`mt-[2.2cqw] grid items-center ${footerColsClass}`}>
            <div className="flex items-center justify-center">
              <img src="/prodigychain-mark.png" alt="ProdigyChain" className="h-[9cqw] w-auto object-contain" />
            </div>

            {clubLogoUrl && (
              <div className="flex items-center justify-center">
                <img src={clubLogoUrl} alt="" className="h-[10cqw] w-[10cqw] object-contain" />
              </div>
            )}

            <div className="flex flex-col items-center leading-none">
              <span className="whitespace-nowrap font-bold italic text-white" style={{ fontSize: "3.6cqw" }}>DAY ONE</span>
              <span className="whitespace-nowrap tracking-[0.45em] text-white/70" style={{ fontSize: "1.9cqw" }}>SERIES</span>
              <div className="mt-[0.6cqw] h-[0.5cqw] w-[8cqw] rounded-full" style={{ background: accent }} />
            </div>

            <div className="flex flex-col items-center leading-none">
              <span className="px-[1.6cqw] py-[0.5cqw] font-bold italic uppercase text-white" style={{ fontSize: "2.8cqw", background: accent, transform: "skewX(-10deg)" }}>
                <span className="inline-block" style={{ transform: "skewX(10deg)" }}>{edition}</span>
              </span>
              <span className="mt-[0.7cqw] tracking-[0.45em] text-white/70" style={{ fontSize: "1.9cqw" }}>EDITION</span>
            </div>

            <div className="flex items-center justify-center">
              <div className="rounded-full p-[0.45cqw]" style={{ background: template.background }}>
                <div className="flex h-[11cqw] w-[11cqw] items-center justify-center rounded-full" style={{ background: "#0e0a16" }}>
                  <span
                    className="font-bold italic"
                    style={{ fontSize: "3.4cqw", background: template.background, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}
                  >
                    {serial}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-[1.6cqw] text-center leading-[1.2] text-white/30" style={{ fontSize: "1.6cqw" }}>{LEGAL}</p>
        </div>
      </div>
    </div>
  );
};

export default PrintCardBack;
