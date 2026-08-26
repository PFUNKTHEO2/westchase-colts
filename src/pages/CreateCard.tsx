/**
 * /create-card — the family self-serve flow (the "Wentworth Studio" pattern,
 * club edition): register, upload a photo, write the story, watch the card
 * build itself live, then order. The back of a Colts card carries the family's
 * BLURB, not stats — every kid gets a story, not a stat line.
 */
import { useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Check, PenLine, ShoppingCart, Sparkles, UserRound } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import coltsLogo from "@/assets/westchase-colts-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { teams, type Team, type TeamPlayer } from "@/lib/teams";
import { teamConfig } from "@/lib/data";
import PrintCardFront, { DEFAULT_PHOTO_TRANSFORM, type PhotoTransform } from "@/components/print/PrintCardFront";
import PrintCardBack from "@/components/print/PrintCardBack";
import { CARD_TEMPLATES, getTemplate } from "@/lib/cardTemplates";
import { synthCardPlayer } from "@/lib/cardPlayer";
import { NATIONALITY_OPTIONS } from "@/utils/countryFlags";
import { CARD_PRICES, CLUB_SHARE, useCart, type CardVariant } from "@/lib/cart";
import { listRegistrations, saveRegistration } from "@/lib/registrations";

const BLURB_MAX = 280;
const BLURB_PROMPTS = [
  "What do teammates love about them?",
  "A moment from this season the family will never forget.",
  "What does being a Colt mean to them?",
];

const FOOTBALL_POSITIONS = [
  "Quarterback", "Running Back", "Wide Receiver", "Tight End", "Offensive Line",
  "Defensive Line", "Linebacker", "Cornerback", "Safety", "Kicker", "Athlete",
];
const CHEER_POSITIONS = ["Flyer", "Base", "Backspot", "Tumbler", "Dancer"];

export default function CreateCard() {
  const { toast } = useToast();
  const { addItem } = useCart();
  const [searchParams] = useSearchParams();

  // Arriving from a roster popup ("Upload Your Own Photo & Story" /
  // "Edit Card" in PlayerDetailModal) carries the clicked player's team,
  // number, name and position in the URL so this save lands back on that
  // exact roster slot instead of asking the parent to re-pick everything.
  // Photo/blurb/template/parent contact aren't URL-safe (data-URL photos),
  // so for an edit of an already-customized player we look up their most
  // recent saved registration from the same localStorage teamsWithCards()
  // reads, matched on team + jersey number, and prefill from that instead.
  // Computed once from the URL this page loaded with, not tracked live.
  const editIntent = useMemo(() => {
    const teamParam = searchParams.get("team");
    const playerParam = searchParams.get("player");
    if (!teamParam || !playerParam) return null;
    const matchedTeam = teams.find((t) => t.id === teamParam);
    if (!matchedTeam) return null;
    const numberParam = searchParams.get("number") ?? "";
    const existing = numberParam
      ? listRegistrations()
          .filter((r) => r.division === matchedTeam.ageGroup && r.program === matchedTeam.gender && r.jerseyNumber === numberParam)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
      : undefined;
    return {
      teamId: matchedTeam.id,
      playerName: playerParam,
      jerseyNumber: numberParam,
      position: searchParams.get("position") ?? "",
      nationality: searchParams.get("nationality") ?? "USA",
      existing,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // player
  const [playerName, setPlayerName] = useState(editIntent?.existing?.playerName ?? editIntent?.playerName ?? "");
  const [jerseyNumber, setJerseyNumber] = useState(editIntent?.existing?.jerseyNumber ?? editIntent?.jerseyNumber ?? "");
  const [teamId, setTeamId] = useState(editIntent?.teamId ?? teams[0].id);
  const [position, setPosition] = useState(editIntent?.existing?.position ?? editIntent?.position ?? "");
  const [nationality, setNationality] = useState(editIntent?.existing?.nationality ?? editIntent?.nationality ?? "USA");

  // photo
  const fileRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState(editIntent?.existing?.photo ?? "");
  const [photoTransform, setPhotoTransform] = useState<PhotoTransform>(editIntent?.existing?.photoTransform ?? DEFAULT_PHOTO_TRANSFORM);
  const [photoWarning, setPhotoWarning] = useState("");

  // story
  const [blurb, setBlurb] = useState(editIntent?.existing?.blurb ?? "");

  // parent
  const [parentName, setParentName] = useState(editIntent?.existing?.parentName ?? "");
  const [parentEmail, setParentEmail] = useState(editIntent?.existing?.parentEmail ?? "");

  // order
  const [variant, setVariant] = useState<CardVariant>("metal");
  const [side, setSide] = useState<"front" | "back">("front");
  const [done, setDone] = useState(false);

  const team = useMemo(() => teams.find((t) => t.id === teamId) ?? teams[0], [teamId]);
  const positions = team.gender === "Cheer" ? CHEER_POSITIONS : FOOTBALL_POSITIONS;

  // The real ProdigyChain card chassis (same one used everywhere else on the
  // platform). Families pick one of the 5 canonical templates, the same picker
  // the studio Card Generator offers; the set stays shared platform-wide and
  // is not per-club recolorable (David's rule: no 6th template without real
  // new frame artwork).
  const [templateId, setTemplateId] = useState(editIntent?.existing?.templateId ?? "prodigychain");
  const cardTemplate = useMemo(() => getTemplate(templateId), [templateId]);
  const cardPlayer = useMemo(
    () => synthCardPlayer({ name: playerName, position, team: `${team.ageGroup} ${team.gender} · ${teamConfig.name}`, nationality }),
    [playerName, position, team, nationality],
  );

  const onPickFile = (file: File | undefined) => {
    if (!file) return;
    setPhotoWarning("");
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      const img = new Image();
      img.onload = () => {
        if (img.height < 700 || img.width < 500) {
          setPhotoWarning("This photo is on the small side; it may look soft when printed. A larger original prints sharper.");
        }
        setPhotoTransform(DEFAULT_PHOTO_TRANSFORM);
        setPhoto(url);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const emailOk = /.+@.+\..+/.test(parentEmail);
  const ready = playerName.trim() && photo && blurb.trim().length >= 20 && parentName.trim() && emailOk && position;

  const order = () => {
    if (!ready) return;
    const reg = saveRegistration({
      parentName: parentName.trim(),
      parentEmail: parentEmail.trim(),
      playerName: playerName.trim(),
      jerseyNumber: jerseyNumber.trim() || "00",
      division: team.ageGroup,
      program: team.gender,
      position,
      nationality,
      blurb: blurb.trim(),
      photo,
      photoTransform,
      templateId,
    });
    const player: TeamPlayer = {
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
    addItem(player, team as Team, variant);
    setDone(true);
    toast({ title: "Card added to cart", description: `${reg.playerName}, ${team.ageGroup} ${team.gender}` });
  };

  const reset = () => {
    setPlayerName(""); setJerseyNumber(""); setPosition(""); setNationality("USA"); setPhoto("");
    setPhotoTransform(DEFAULT_PHOTO_TRANSFORM);
    setBlurb(""); setDone(false); setSide("front"); setTemplateId("prodigychain");
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Create Your Card | {teamConfig.name}</title>
        <meta name="description" content="Upload a photo, write their story, and turn your Colt into a collectible trading card. Every sale supports the Westchase Colts." />
      </Helmet>
      <Navbar />

      <main className="container mx-auto px-4 pb-24 pt-28">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Colts Families</p>
          <h1 className="section-heading mt-2">Turn Your Colt Into a Trading Card</h1>
          <p className="mt-3 text-muted-foreground">
            Upload your favorite photo, write their story for the back of the card, and we handle
            the rest. Every card sold puts money directly into the Colts program.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
          {/* ── LIVE PREVIEW ── */}
          <div className="mx-auto w-full max-w-[380px] lg:sticky lg:top-28">
            <div className="mb-3 flex justify-center">
              <div className="inline-flex rounded-lg border border-border bg-card/60 p-1">
                {(["front", "back"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSide(s)}
                    className={`rounded-md px-4 py-1.5 text-sm font-semibold capitalize transition ${
                      side === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="perspective-1000">
              <div className="relative aspect-[2.5/3.5] overflow-hidden rounded-xl card-glow" style={{ containerType: "inline-size" }}>
                {side === "front" ? (
                  /* The real ProdigyChain card chassis — the frame is the same
                     art used everywhere else on the platform, not a lookalike.
                     Photo drag-to-pan/zoom is unchanged; it just writes into
                     the chassis's own percent-based transform now. */
                  <PrintCardFront
                    player={cardPlayer}
                    template={cardTemplate}
                    photoUrl={photo || null}
                    jerseyNumber={jerseyNumber}
                    program={team.gender}
                    clubLogoUrl={coltsLogo}
                    className="absolute inset-0"
                    photoTransform={photoTransform}
                    onPhotoTransformChange={setPhotoTransform}
                  />
                ) : (
                  /* Back in the same chassis — the family's story fills the
                     space a stats table would occupy on a ranked player's card. */
                  <PrintCardBack
                    player={cardPlayer}
                    template={cardTemplate}
                    blurb={blurb}
                    jerseyNumber={jerseyNumber}
                    clubLogoUrl={coltsLogo}
                    className="absolute inset-0"
                  />
                )}
              </div>
            </div>
            {/* Card color — the same 5 canonical templates the studio Card
               Generator offers; each swatch is that template's background. */}
            <div className="mt-3 flex items-center justify-center gap-2">
              {CARD_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplateId(t.id)}
                  title={t.label}
                  aria-label={`${t.label} template`}
                  className={`h-8 w-8 rounded-full ring-2 transition ${
                    templateId === t.id ? "ring-primary" : "ring-border hover:ring-muted-foreground"
                  }`}
                  style={{ background: t.background }}
                />
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {photo && side === "front"
                ? "Drag the photo to position it. Pinch or use the + and − buttons to zoom."
                : "Live preview. Pick a card color above; the printed card carries the same design."}
            </p>
          </div>

          {/* ── FORM ── */}
          <div className="space-y-8">
            {/* 1 · player */}
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <UserRound className="h-4 w-4 text-accent" /> 1 · Your Colt
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Input value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Player name" maxLength={40} />
                <Input value={jerseyNumber} onChange={(e) => setJerseyNumber(e.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="Jersey #" inputMode="numeric" />
                <select
                  value={teamId}
                  onChange={(e) => { setTeamId(e.target.value); setPosition(""); }}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.ageGroup} {t.gender}</option>
                  ))}
                </select>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="" disabled>Position</option>
                  {positions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <select
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  aria-label="Nationality"
                >
                  {NATIONALITY_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </section>

            {/* 2 · photo */}
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <Camera className="h-4 w-4 text-accent" /> 2 · The Photo
              </h2>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => onPickFile(e.target.files?.[0])} />
              <div className="mt-3 flex items-center gap-3">
                <Button variant="outline" onClick={() => fileRef.current?.click()}>
                  <Camera className="mr-1 h-4 w-4" /> {photo ? "Replace photo" : "Upload photo"}
                </Button>
                {photo && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                    <Check className="h-3.5 w-3.5" /> looking good
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Game action, team photo day, or your favorite sideline shot. JPEG or PNG.
              </p>
              {photoWarning && <p className="mt-1 text-xs text-amber-400">{photoWarning}</p>}
            </section>

            {/* 3 · story */}
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <PenLine className="h-4 w-4 text-accent" /> 3 · Their Story
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                This prints on the back of the card. No stats needed, just what makes them who they are.
              </p>
              <Textarea
                value={blurb}
                onChange={(e) => setBlurb(e.target.value.slice(0, BLURB_MAX))}
                placeholder={BLURB_PROMPTS[0]}
                className="mt-3 min-h-28"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex flex-wrap gap-2">
                  {BLURB_PROMPTS.map((p) => (
                    <button key={p} onClick={() => setBlurb((b) => (b ? b : p))} className="rounded-full border border-border px-2 py-0.5 hover:text-foreground">
                      {p}
                    </button>
                  ))}
                </div>
                <span className={blurb.length > BLURB_MAX - 30 ? "text-amber-400" : ""}>{blurb.length}/{BLURB_MAX}</span>
              </div>
            </section>

            {/* 4 · parent */}
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <Sparkles className="h-4 w-4 text-accent" /> 4 · Parent or Guardian
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Input value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="Your name" maxLength={60} />
                <Input value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} placeholder="Email" type="email" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                We only use this to send your order confirmation and card proof.
              </p>
            </section>

            {/* 5 · order */}
            <section className="rounded-xl border border-border bg-card/60 p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <ShoppingCart className="h-4 w-4 text-accent" /> 5 · Order
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {(["digital", "metal", "postcard"] as CardVariant[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    className={`rounded-lg border p-4 text-left transition ${
                      variant === v ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <p className="font-semibold">
                      {v === "metal" ? "Trading Card" : v === "postcard" ? "Postcard" : "Digital Card"}
                    </p>
                    <p className="text-2xl font-bold text-primary">${CARD_PRICES[v]}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {v === "metal"
                        ? "2.5x3.5 metal card, pickup at the club."
                        : v === "postcard"
                          ? "5.5x8.5 metal postcard, pickup at the club."
                          : "Shareable digital collectible."}
                    </p>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                50% of every sale (${CLUB_SHARE[variant]} on this one) goes straight to the Colts. The
                other 50% covers card creation, payment processing, and the platform fee.
              </p>
              {done ? (
                <div className="mt-4 space-y-2">
                  <p className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400">
                    <Check className="h-4 w-4" /> In your cart. Open the cart up top to check out.
                  </p>
                  <Button variant="outline" className="w-full" onClick={reset}>Create another card</Button>
                </div>
              ) : (
                <Button className="mt-4 w-full" size="lg" disabled={!ready} onClick={order}>
                  Add to cart — ${CARD_PRICES[variant]}
                </Button>
              )}
              {!ready && !done && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Needs: player name, position, a photo, a story (at least 20 characters), and your contact info.
                </p>
              )}
            </section>

            <p className="text-xs leading-relaxed text-muted-foreground">
              The Westchase Colts are a 501(c)(3) non-profit. Card proceeds fund equipment, field
              time, cheer competitions, and scholarships so every kid can play.{" "}
              <Link to="/roster" className="text-accent underline">See all teams</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
