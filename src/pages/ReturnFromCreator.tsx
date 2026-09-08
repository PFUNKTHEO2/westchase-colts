/**
 * /create/return?card=<slug>: the family lands here from the hosted
 * ProdigyChain creator with the finished card. We pull the card back, save
 * it as a registration (so the gallery, roster and cart see it exactly like
 * before), show it on the real chassis and offer the order. Idempotent on
 * refresh: a registration with the same listing slug is reused.
 */
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { Check, Loader2, ShoppingCart } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import coltsLogo from "@/assets/westchase-colts-logo.png";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { teams, type Team, type TeamPlayer } from "@/lib/teams";
import { teamConfig } from "@/lib/data";
import PrintCardFront from "@/components/print/PrintCardFront";
import { getTemplate } from "@/lib/cardTemplates";
import { synthCardPlayer } from "@/lib/cardPlayer";
import { CARD_PRICES, CLUB_SHARE, useCart, type CardVariant } from "@/lib/cart";
import { findByListingSlug, saveRegistration, type CardRegistration } from "@/lib/registrations";
import { creatorUrl, fetchHostedCard } from "@/lib/creator";

export default function ReturnFromCreator() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("card") ?? "";
  const { addItem } = useCart();
  const { toast } = useToast();
  const [reg, setReg] = useState<CardRegistration | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");
  const [variant, setVariant] = useState<CardVariant>("metal");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!slug) {
      setState("missing");
      return;
    }
    const existing = findByListingSlug(slug);
    if (existing) {
      setReg(existing);
      setState("ready");
      return;
    }
    let cancelled = false;
    fetchHostedCard(slug).then((card) => {
      if (cancelled) return;
      if (!card) {
        setState("missing");
        return;
      }
      const team = teams.find((t) => t.id === card.club_team_id) ?? teams[0];
      const saved = saveRegistration({
        listingSlug: card.slug,
        parentName: card.parent_name ?? "",
        parentEmail: "",
        playerName: card.inline_card.athlete_name,
        jerseyNumber: card.inline_card.jersey_number || "00",
        division: team.ageGroup,
        program: team.gender,
        position: card.inline_card.position ?? "",
        nationality: card.inline_card.nationality ?? "USA",
        blurb: card.inline_card.blurb ?? "",
        photo: card.photo_url,
        photoTransform: card.photo_transform
          ? { x: card.photo_transform.x, y: card.photo_transform.y, scale: card.photo_transform.scale, rotate: card.photo_transform.rotate ?? 0 }
          : undefined,
        templateId: card.template,
      });
      setReg(saved);
      setState("ready");
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const team = useMemo(
    () => teams.find((t) => t.ageGroup === reg?.division && t.gender === reg?.program) ?? teams[0],
    [reg],
  );
  const player = useMemo(
    () =>
      reg
        ? synthCardPlayer({
            name: reg.playerName,
            position: reg.position,
            team: `${team.ageGroup} ${team.gender} · ${teamConfig.name}`,
            nationality: reg.nationality ?? "USA",
          })
        : null,
    [reg, team],
  );

  const order = () => {
    if (!reg) return;
    const p: TeamPlayer = {
      id: reg.id,
      name: reg.playerName,
      number: reg.jerseyNumber,
      position: reg.position,
      born: "",
      photo: reg.photo,
      blurb: reg.blurb,
      photoTransform: reg.photoTransform,
      templateId: reg.templateId,
      nationality: reg.nationality,
    };
    addItem(p, team as Team, variant);
    setDone(true);
    toast({ title: "Card added to cart", description: `${reg.playerName}, ${team.ageGroup} ${team.gender}` });
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Your Card | {teamConfig.name}</title>
      </Helmet>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        {state === "loading" && (
          <div className="flex justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {state === "missing" && (
          <div className="mx-auto max-w-md py-24 text-center">
            <p className="font-semibold">We could not find that card.</p>
            <p className="mt-1 text-sm text-muted-foreground">Start again and we will bring you back here.</p>
            <a href={creatorUrl()} className="mt-4 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
              Create a card
            </a>
          </div>
        )}
        {state === "ready" && reg && player && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div>
              <h1 className="text-2xl font-bold">{reg.playerName}'s card is ready</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {team.ageGroup} {team.gender}. What you see is exactly what prints.
              </p>
              <div className="relative mx-auto mt-6 w-full max-w-[420px]">
                <div className="aspect-[2.5/3.5]" style={{ containerType: "inline-size" }}>
                  <PrintCardFront
                    player={player}
                    template={getTemplate(reg.templateId)}
                    photoUrl={reg.photo}
                    jerseyNumber={reg.jerseyNumber}
                    photoTransform={reg.photoTransform ? { ...reg.photoTransform, rotate: reg.photoTransform.rotate ?? 0 } : undefined}
                    clubLogoUrl={coltsLogo}
                    program={team.gender}
                    className="absolute inset-0"
                  />
                </div>
              </div>
            </div>

            <section className="rounded-xl border border-border bg-card/60 p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <ShoppingCart className="h-4 w-4 text-accent" /> Order
              </h2>
              <div className="mt-3 grid gap-3">
                {(["digital", "metal", "postcard"] as CardVariant[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    className={`rounded-lg border p-4 text-left transition ${
                      variant === v ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <p className="font-semibold">{v === "metal" ? "Trading Card" : v === "postcard" ? "Postcard" : "Digital Card"}</p>
                    <p className="text-2xl font-bold text-primary">${CARD_PRICES[v]}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {v === "metal" ? "2.5x3.5 metal card, pickup at the club." : v === "postcard" ? "5.5x8.5 metal postcard, pickup at the club." : "Shareable digital collectible."}
                    </p>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                50% of every sale (${CLUB_SHARE[variant]} on this one) goes straight to the Colts. The other 50% covers card
                creation, payment processing, and the platform fee.
              </p>
              {done ? (
                <div className="mt-4 space-y-2">
                  <p className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400">
                    <Check className="h-4 w-4" /> In your cart. Open the cart up top to check out.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/">See it in the gallery</Link>
                  </Button>
                  <a href={creatorUrl()} className="block text-center text-xs text-muted-foreground underline">Create another card</a>
                </div>
              ) : (
                <Button className="mt-4 w-full" size="lg" onClick={order}>
                  Add to cart, ${CARD_PRICES[variant]}
                </Button>
              )}
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
