/**
 * /create-card: hands the family to the hosted ProdigyChain creator.
 *
 * The creator used to live on this page. It is now the one shared creator on
 * prodigychain.ai (every club, studio and parent uses the identical one), so
 * this route only carries the edit-intent params across and sends the family
 * there; they come back to /create/return with the finished card. The route
 * stays so every existing link (nav, hero, gallery, roster modal, the Stripe
 * cancel URL) keeps working.
 */
import { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { teamConfig } from "@/lib/data";
import { teams } from "@/lib/teams";
import { creatorUrl } from "@/lib/creator";

export default function CreateCard() {
  const [searchParams] = useSearchParams();
  const href = useMemo(() => {
    const teamParam = searchParams.get("team") ?? "";
    const teamId = teams.some((t) => t.id === teamParam) ? teamParam : undefined;
    return creatorUrl({
      teamId,
      player: searchParams.get("player") ?? undefined,
      number: searchParams.get("number") ?? undefined,
      position: searchParams.get("position") ?? undefined,
      nationality: searchParams.get("nationality") ?? undefined,
    });
  }, [searchParams]);

  useEffect(() => {
    window.location.replace(href);
  }, [href]);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Create Your Card | {teamConfig.name}</title>
      </Helmet>
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-lg font-semibold">Opening the card creator</p>
        <p className="mt-2 text-sm text-muted-foreground">
          You are heading to ProdigyChain to build the card. You will come straight back here to order it.
        </p>
        <a href={href} className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          Continue to the creator
        </a>
      </main>
      <Footer />
    </div>
  );
}
