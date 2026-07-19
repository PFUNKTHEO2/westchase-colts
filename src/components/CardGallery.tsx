/**
 * Colts Cards — the homepage shelf. Anchored by the curated showcase card
 * (real club photo, visible to everyone); cards created on this device join
 * it. Each card carries its live scoreboard (sold count + dollars back to the
 * club, joined from the Stripe-backed mint feed) and opens the full 3D
 * front-and-back view on tap.
 */
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Share2, Rotate3d } from "lucide-react";
import { Button } from "@/components/ui/button";
import CardFrame, { DEFAULT_PHOTO_TRANSFORM, type PhotoTransform } from "@/components/CardFrame";
import { listRegistrations } from "@/lib/registrations";
import { featuredCards } from "@/lib/featured";
import { statsForPlayer, useMintFeed } from "@/lib/mints";
import { teamConfig } from "@/lib/data";
import coltsLogo from "@/assets/westchase-colts-logo.png";

interface GalleryCard {
  id: string;
  playerName: string;
  jerseyNumber: string;
  position: string;
  program: string;
  division: string;
  photo: string;
  photoTransform?: PhotoTransform;
}

export function CardGallery() {
  const cards: GalleryCard[] = useMemo(
    () => [...featuredCards, ...listRegistrations().slice().reverse()],
    [],
  );
  const feed = useMintFeed();

  return (
    <section className="py-14 bg-gradient-to-b from-background to-secondary/30 border-b border-border/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="section-heading mb-2">
            Colts <span className="text-gradient">Cards</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Real Colts, real cards. Every sale sends money straight back to the club.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8">
          {cards.slice(0, 6).map((card, i) => {
            const teamLabel = `${card.division} ${card.program}`;
            const s = statsForPlayer(feed, card.playerName, teamLabel);
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="w-[230px]"
              >
                <Link to={`/card-preview/${card.id}`} className="group block">
                  <div
                    className="relative aspect-[2.5/3.5] overflow-hidden rounded-xl card-glow transition-transform group-hover:scale-[1.03]"
                    style={{ containerType: "inline-size" }}
                  >
                    <CardFrame
                      photo={card.photo}
                      photoTransform={card.photoTransform ?? DEFAULT_PHOTO_TRANSFORM}
                      name={card.playerName}
                      number={card.jerseyNumber}
                      position={card.position}
                      program={card.program}
                      teamLine={`${teamLabel} · ${teamConfig.name}`}
                      seasonLine={teamConfig.season}
                      logo={coltsLogo}
                      className="absolute inset-0"
                    />
                    <span className="absolute right-2 top-2 z-20 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                      <Rotate3d className="h-3 w-3" /> 3D
                    </span>
                  </div>
                </Link>

                {/* the card's scoreboard */}
                <div className="mt-3 rounded-lg border border-border bg-card/70 px-3 py-2.5 text-center">
                  {s ? (
                    <p className="flex items-center justify-center gap-1.5 font-display font-bold text-foreground">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      {s.sold} sold · ${s.raised.toLocaleString()} to the Colts
                    </p>
                  ) : (
                    <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                      <Share2 className="w-3.5 h-3.5" />
                      No sales yet — be the first
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Button asChild variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
            <Link to="/create-card">Create your Colt&apos;s card</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
