/**
 * The fundraising progress bar, drawn as the sport's own field/court/rink
 * with the ball or puck moving toward the goal. David's ask (7/20): make
 * the progress feel like the actual sport, not one generic bar — and keep
 * it swappable per club so the template stays sport-correct on clone.
 */
import { motion } from "framer-motion";

export type Sport = "football" | "soccer" | "hockey" | "cheer";

interface SportProgressTrackProps {
  sport: Sport;
  pct: number; // 0-100
  goalLabel: string;
}

const SPORT_COPY: Record<Sport, { unit: string; ballEmoji: string; goalEmoji: string; trackLabel: string }> = {
  football: { unit: "yard line", ballEmoji: "\u{1F3C8}", goalEmoji: "\u{1F945}", trackLabel: "Down the field" },
  soccer: { unit: "the pitch", ballEmoji: "⚽", goalEmoji: "\u{1F945}", trackLabel: "Down the pitch" },
  hockey: { unit: "the ice", ballEmoji: "\u{1F3D2}", goalEmoji: "\u{1F945}", trackLabel: "Down the ice" },
  cheer: { unit: "the mat", ballEmoji: "⭐", goalEmoji: "\u{1F3C6}", trackLabel: "Toward the trophy" },
};

export function SportProgressTrack({ sport, pct, goalLabel }: SportProgressTrackProps) {
  const copy = SPORT_COPY[sport];
  const clamped = Math.max(2, Math.min(100, pct));

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
        <span>{copy.trackLabel}</span>
        <span>{goalLabel}</span>
      </div>

      {sport === "football" ? (
        <FootballField pct={clamped} />
      ) : (
        // generic fallback track for sports without a bespoke field yet —
        // still sport-labeled, never silently a plain gray bar
        <div className="relative h-8 rounded-lg bg-gradient-to-r from-emerald-950/60 to-emerald-900/40 border border-emerald-800/40 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${clamped}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/40 to-accent/50"
          />
          <motion.span
            initial={{ left: "0%" }}
            whileInView={{ left: `${clamped}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-lg"
            style={{ left: `${clamped}%` }}
          >
            {copy.ballEmoji}
          </motion.span>
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-sm">{copy.goalEmoji}</span>
        </div>
      )}
    </div>
  );
}

/** a real yard-marked football field, ball advancing toward the end zone */
function FootballField({ pct }: { pct: number }) {
  const yardLines = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  return (
    <div className="relative h-12 rounded-md overflow-hidden border border-green-900/50 shadow-inner"
         style={{ background: "repeating-linear-gradient(90deg, #14532d 0%, #14532d 10%, #166534 10%, #166534 20%)" }}>
      {/* yard lines */}
      {yardLines.map((y) => (
        <div key={y} className="absolute inset-y-0 w-px bg-white/25" style={{ left: `${y}%` }} />
      ))}
      {/* end zone */}
      <div className="absolute inset-y-0 right-0 w-[6%] bg-yellow-500/20 border-l border-yellow-400/50 flex items-center justify-center">
        <span className="text-[9px] font-bold text-yellow-300 rotate-90 tracking-widest">GOAL</span>
      </div>
      {/* midfield stripe */}
      <div className="absolute inset-y-0 w-0.5 bg-white/40" style={{ left: "50%" }} />

      {/* the ball, advancing */}
      <motion.div
        initial={{ left: "2%" }}
        whileInView={{ left: `${Math.min(pct, 92)}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 text-xl drop-shadow"
      >
        🏈
      </motion.div>
    </div>
  );
}
