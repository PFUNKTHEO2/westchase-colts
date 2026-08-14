/**
 * The Card Wall — live social proof, straight from Stripe via /api/mints.
 * Running count + dollars raised + the freshest cards as privacy-safe chips
 * (first name + last initial only; no photos of kids on the public wall).
 * Empty state sells the FIRST card; a filled wall sells the NEXT one.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { teamConfig } from "@/lib/data";
import { SportProgressTrack } from "@/components/SportProgressTrack";

interface Mint {
  name: string;
  teamLabel: string;
  variant: "digital" | "metal" | "postcard";
  ts: number;
}

interface MintFeed {
  count: number;
  raised: number;
  recent: Mint[];
}

function timeAgo(ts: number): string {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function MintWall() {
  const [feed, setFeed] = useState<MintFeed | null>(null);

  useEffect(() => {
    fetch("/api/mints")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && Number.isInteger(d.count)) setFeed(d);
      })
      .catch(() => {});
  }, []);

  const goal = teamConfig.fundraisingGoal;
  const pct = feed ? Math.min(100, (feed.raised / goal) * 100) : 0;

  return (
    <section className="py-14 bg-gradient-to-b from-secondary/40 to-background border-y border-border/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-accent" />
            <span className="text-xs font-bold tracking-widest text-accent uppercase">Live</span>
          </div>
          <h2 className="section-heading mb-2">
            The <span className="text-gradient">Card Wall</span>
          </h2>
          {feed && feed.count > 0 ? (
            <p className="text-muted-foreground text-lg">
              <span className="font-bold text-foreground">{feed.count}</span>{" "}
              {feed.count === 1 ? "card" : "cards"} created ·{" "}
              <span className="font-bold text-foreground">
                ${feed.raised.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>{" "}
              raised for the Colts
            </p>
          ) : (
            <p className="text-muted-foreground text-lg">
              Every card created lands here, in front of the whole Colts community.
            </p>
          )}
        </motion.div>

        {feed && feed.count > 0 ? (
          <>
            {/* progress toward the season goal, as a real football field */}
            <div className="mb-8">
              <SportProgressTrack sport="football" pct={pct} goalLabel={`$${goal.toLocaleString()} goal`} />
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {feed.recent.map((m, i) => (
                <motion.div
                  key={`${m.name}-${m.ts}-${i}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-lg border-2 px-4 py-3 bg-card min-w-[150px] text-left ${
                    m.variant === "metal"
                      ? "border-accent/60"
                      : m.variant === "postcard"
                        ? "border-yellow-400/60"
                        : "border-primary/60"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Sparkles
                      className={`w-3.5 h-3.5 ${
                        m.variant === "metal" ? "text-accent" : m.variant === "postcard" ? "text-yellow-400" : "text-primary"
                      }`}
                    />
                    <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                      {m.variant === "metal" ? "Metal card" : m.variant === "postcard" ? "Postcard" : "Digital card"}
                    </span>
                  </div>
                  <p className="font-display font-bold text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.teamLabel} · {timeAgo(m.ts)}
                  </p>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center mb-8">
            <p className="text-foreground font-display font-bold text-xl mb-1">
              The first card of the season is up for grabs.
            </p>
            <p className="text-muted-foreground">Your Colt could headline this wall.</p>
          </div>
        )}

        <div className="text-center">
          <Button asChild size="lg" className="btn-gold bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/create-card">Create your Colt&apos;s card</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
