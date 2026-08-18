/**
 * /checkout/success — the card is CREATED. Stripe redirects here after
 * payment. Reads the pre-checkout snapshot from localStorage, celebrates
 * with confetti and the actual card, hands the family a one-tap share, and
 * clears the cart. This page is the ignition point of the viral loop:
 * pride → share → next card.
 */
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Share2, Twitter, Facebook, Copy } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { teamConfig } from "@/lib/data";
import PrintCardFront, { DEFAULT_PHOTO_TRANSFORM } from "@/components/print/PrintCardFront";
import { getTemplate } from "@/lib/cardTemplates";
import { synthCardPlayer } from "@/lib/cardPlayer";
import coltsLogo from "@/assets/westchase-colts-logo.png";

interface MintItem {
  playerName: string;
  number: string;
  position: string;
  program: string;
  ageGroup: string;
  photo?: string;
  photoTransform?: { x: number; y: number; scale: number };
  templateId?: string;
  variant: "digital" | "metal" | "postcard";
  quantity: number;
}

const SNAPSHOT_KEY = "wc:last-mint";
const SNAPSHOT_MAX_AGE = 60 * 60 * 1000; // 1h — refreshes still celebrate

function readSnapshot(): MintItem[] {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!parsed?.ts || Date.now() - parsed.ts > SNAPSHOT_MAX_AGE) return [];
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

const CONFETTI_COLORS = ["#3b82f6", "#93c5fd", "#facc15", "#ffffff", "#1d4ed8"];

/** dependency-free confetti: 50 pieces raining once via framer-motion */
function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.4 + Math.random() * 1.6,
        size: 6 + Math.random() * 8,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rotate: Math.random() * 720 - 360,
        drift: Math.random() * 30 - 15,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -40, x: 0, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", x: p.drift, opacity: [1, 1, 0.9, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          style={{
            position: "absolute",
            top: 0,
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  const [items] = useState<MintItem[]>(readSnapshot);
  const [mintNumber, setMintNumber] = useState<number | null>(null);

  useEffect(() => {
    clearCart();
    // cache-buster: the edge caches /api/mints for the wall; the mint number
    // must count THIS order, so always bypass with a unique query
    fetch(`/api/mints?fresh=${Date.now()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && Number.isInteger(d.count) && d.count > 0) setMintNumber(d.count);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const star = items[0];
  const firstName = star?.playerName?.split(/\s+/)[0] ?? "";
  const extraCount = items.reduce((sum, i) => sum + i.quantity, 0) - (star ? 1 : 0);

  const shareUrl = "https://colts.prodigychain.ai";
  const caption = star
    ? `I just supported the ${teamConfig.name} by creating ${firstName}'s ProdigyCard! Every card puts money straight into the club. Create yours: ${shareUrl}`
    : `I just supported the ${teamConfig.name} by creating a ProdigyCard! Every card puts money straight into the club. Create yours: ${shareUrl}`;

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const share = async (platform: "native" | "twitter" | "facebook" | "copy") => {
    switch (platform) {
      case "native":
        try {
          await navigator.share({ title: `${teamConfig.name} ProdigyCards`, text: caption, url: shareUrl });
        } catch {
          /* user closed the sheet — nothing to do */
        }
        return;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`,
          "_blank",
          "width=600,height=400",
        );
        return;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(caption)}`,
          "_blank",
          "width=600,height=400",
        );
        return;
      case "copy":
        navigator.clipboard.writeText(caption);
        toast.success("Caption copied. Paste it anywhere!");
        return;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Created! | {teamConfig.name}</title>
      </Helmet>
      <Confetti />
      <Navbar />
      <main className="flex-1 px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 12 }}
          >
            <CheckCircle2 className="w-14 h-14 mx-auto text-primary mb-4" />
            <h1 className="font-display font-bold text-4xl text-foreground mb-2">
              CREATED<span className="text-gradient-gold">!</span>
            </h1>
            <p className="text-lg text-foreground mb-1">
              {star ? (
                <>
                  {star.playerName}&apos;s ProdigyCard is officially in the books
                  {extraCount > 0 ? ` (+${extraCount} more)` : ""}.
                </>
              ) : (
                <>Your ProdigyCard order is officially in the books.</>
              )}
            </p>
            <p className="text-muted-foreground mb-6">
              {mintNumber
                ? `Colts Card #${mintNumber} of the Fall 2026 season. `
                : ""}
              A receipt is on its way to your email, and your purchase just put money in the club&apos;s pocket.
            </p>
          </motion.div>

          {star && (
            <motion.div
              initial={{ y: 40, opacity: 0, rotate: -3 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.25, type: "spring", damping: 14 }}
              className="mx-auto w-64 sm:w-72 mb-8"
            >
              {/* same container contract as CreateCard: the frame sizes itself
                  in cqw units, so it needs an inline-size container + aspect */}
              <div
                className="relative aspect-[2.5/3.5] overflow-hidden rounded-xl card-glow"
                style={{ containerType: "inline-size" }}
              >
                <PrintCardFront
                  player={synthCardPlayer({ name: star.playerName, position: star.position, team: `${star.ageGroup} ${star.program} · ${teamConfig.name}` })}
                  template={getTemplate(star.templateId)}
                  photoUrl={star.photo || null}
                  jerseyNumber={star.number}
                  program={star.program}
                  clubLogoUrl={coltsLogo}
                  className="absolute inset-0"
                  photoTransform={star.photoTransform ?? DEFAULT_PHOTO_TRANSFORM}
                />
              </div>
            </motion.div>
          )}

          {/* The loop: pride wants an audience. Make sharing one tap. */}
          <div className="rounded-xl border border-border bg-card p-5 mb-8">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Share2 className="w-4 h-4 text-primary" />
              <h2 className="font-display font-bold text-lg text-foreground">Show it off</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Every share sells the next card. That&apos;s how the Colts hit the goal.
            </p>
            <div className="flex flex-col gap-2">
              {canNativeShare && (
                <Button size="lg" className="w-full gap-2" onClick={() => share("native")}>
                  <Share2 className="w-5 h-5" />
                  Share {firstName ? `${firstName}'s` : "the"} card
                </Button>
              )}
              <div className="flex gap-2 justify-center">
                <Button
                  variant={canNativeShare ? "outline" : "default"}
                  className="flex-1 gap-2"
                  onClick={() => share("twitter")}
                >
                  <Twitter className="w-4 h-4" /> Post
                </Button>
                <Button
                  variant={canNativeShare ? "outline" : "default"}
                  className="flex-1 gap-2"
                  onClick={() => share("facebook")}
                >
                  <Facebook className="w-4 h-4" /> Share
                </Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={() => share("copy")}>
                  <Copy className="w-4 h-4" /> Copy
                </Button>
              </div>
              <p className="text-xs text-muted-foreground italic mt-1">&ldquo;{caption}&rdquo;</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link to="/create-card">Create another Colt</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/">See the Card Wall</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
