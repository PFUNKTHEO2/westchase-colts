import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Star, Check, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TeamPlayer, Team } from "@/lib/teams";
import { useCart, CARD_VARIANT_COLORS, CARD_PRICES, type CardVariant } from "@/lib/cart";
import { toast } from "@/hooks/use-toast";
import CardFrame from "@/components/CardFrame";
import { teamConfig } from "@/lib/data";
import { statsForPlayer, useMintFeed } from "@/lib/mints";
import coltsLogo from "@/assets/westchase-colts-logo.png";

interface PlayerDetailModalProps {
  player: TeamPlayer | null;
  team: Team | null;
  onClose: () => void;
}

export function PlayerDetailModal({ player, team, onClose }: PlayerDetailModalProps) {
  const { addItem, items } = useCart();
  const [metalQty, setMetalQty] = useState(1);
  const feed = useMintFeed();

  if (!player || !team) return null;

  // this card's live scoreboard: sold count + dollars back to the club
  const cardStats = statsForPlayer(feed, player.name, `${team.ageGroup} ${team.gender}`);

  const digitalInCart = items.some((i) => i.id === `${player.id}-digital`);
  const metalInCart = items.find((i) => i.id === `${player.id}-metal`);

  const handlePurchaseDigital = () => {
    if (digitalInCart) {
      toast({ title: "Already in cart", description: "Digital ProdigyCard is already in your cart." });
      return;
    }
    addItem(player, team, "digital");
    toast({ title: "Added to Cart!", description: `${player.name} — Digital ProdigyCard` });
  };

  const handlePurchaseMetal = () => {
    addItem(player, team, "metal", metalQty);
    toast({ title: metalInCart ? "Updated Cart!" : "Added to Cart!", description: `${player.name} — ${metalQty}× Metal Physical ProdigyCard` });
    setMetalQty(1);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg max-h-[90vh] rounded-2xl border border-border bg-card shadow-2xl overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Player image + stats side by side */}
          <div className="flex gap-0">
            {/* The player's ProdigyCard — the template IS the profile image
               (photo when uploaded, position silhouette until then) */}
            <div className="w-[45%] shrink-0 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Star className="w-3 h-3 text-accent fill-accent" />
                <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">ProdigyCard</span>
              </div>
              <div className="relative aspect-[2.5/3.5] overflow-hidden rounded-xl" style={{ containerType: "inline-size" }}>
                <CardFrame
                  photo={player.photo || null}
                  photoTransform={player.photoTransform}
                  name={player.name}
                  number={player.number}
                  position={player.position}
                  program={team.gender}
                  teamLine={`${team.ageGroup} ${team.gender} · ${teamConfig.name}`}
                  seasonLine={teamConfig.season}
                  logo={coltsLogo}
                  className="absolute inset-0"
                />
              </div>
            </div>

            {/* Stats on the right */}
            <div className="flex-1 p-4 flex flex-col justify-center gap-2">
              {[
                { label: "Position", value: player.position },
                { label: "Number", value: `#${player.number}` },
                { label: "Age Category", value: team.ageGroup },
                { label: "Born", value: player.born },
              ].map((field) => (
                <div key={field.label} className="rounded-lg bg-muted/30 border border-border/50 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">{field.label}</p>
                  <p className="text-sm font-medium text-foreground">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 space-y-4">
            {cardStats && (
              <div className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-2.5 text-center">
                <p className="font-display font-bold text-foreground">
                  {cardStats.sold} {cardStats.sold === 1 ? "card" : "cards"} sold · $
                  {cardStats.raised.toLocaleString()} back to the Colts
                </p>
              </div>
            )}

            {player.blurb && (
              <p className="text-sm italic leading-relaxed text-foreground/80 text-center">
                &ldquo;{player.blurb}&rdquo;
              </p>
            )}

            {/* Purchase buttons side by side */}
            <div className="grid grid-cols-2 gap-3">
              {/* Digital column */}
              <div className="space-y-2">
                <Button
                  onClick={handlePurchaseDigital}
                  disabled={digitalInCart}
                  size="lg"
                  className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs h-auto py-3 px-2 disabled:opacity-60"
                >
                  {digitalInCart ? (
                    <>
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Digital — In Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 shrink-0" />
                      <span>Digital — $15</span>
                    </>
                  )}
                </Button>
                {/* Empty space to match metal qty height */}
                <div className="h-9" />
              </div>

              {/* Metal column */}
              <div className="space-y-2">
                <Button
                  onClick={handlePurchaseMetal}
                  size="lg"
                  className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90 btn-gold font-semibold text-xs h-auto py-3 px-2"
                >
                  <ShoppingCart className="w-4 h-4 shrink-0" />
                  <span>Metal — ${metalQty * CARD_PRICES.metal}</span>
                  {metalInCart && <Check className="w-4 h-4 shrink-0" />}
                </Button>
                {/* Quantity selector */}
                <div className="flex items-center justify-center rounded-lg border border-border bg-muted/30 h-9">
                  <button
                    onClick={() => setMetalQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-foreground">{metalQty}</span>
                  <button
                    onClick={() => setMetalQty((q) => q + 1)}
                    className="w-9 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <p><span className="font-semibold text-foreground">Digital ProdigyCard</span> can be uploaded directly to your Apple Wallet, shared on social media, kept in your Gallery.</p>
              <p><span className="font-semibold text-foreground">Metal ProdigyCard</span> in standard 2.5×3.5 trading card size, available for pickup at the Colts field house at Ed Radice.</p>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Proceeds support {team.ageGroup} {team.gender} and Colts programs
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
