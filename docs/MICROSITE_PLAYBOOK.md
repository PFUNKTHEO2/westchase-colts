# ProdigyChain Club Microsite Playbook — v1 (2026-07-19)

The canonical guide for spinning up a fundraising microsite for any youth sports
organization. The template is this repo (westchase-colts); the live reference is
https://colts.prodigychain.ai. One club = one site = one weekend of season-long
fundraising infrastructure they could never build themselves.

Owners: Philippe (build + outreach), David (pricing, agreements, product review).
Status: v1 for David's review. Nothing here is locked.

---

## 1. What every microsite ships with

| Block | What it does | Why it sells |
|---|---|---|
| Hero | Club colors, logo, THEIR action photo, season framing | "The photo makes the site" (David) |
| Card Gallery | Curated featured card + every family-created card, 3D viewer (drag, flip, zoom) | The product demo IS the homepage |
| Mint Wall | Live count, dollars raised, goal thermometer, recent mints | Social proof + FOMO, straight from Stripe |
| Create Your Card | Name, number, position, photo upload into the frame, story on the back | 3 minutes on a phone, zero club homework |
| Checkout | Stripe, server-side prices, sandbox until signed | "Nothing gets charged until launch day" |
| Mint Moment | Confetti, the actual card, mint number, one-tap share with prewritten caption | Every purchase recruits the next one |
| Roster | Placeholder rows that family cards claim by jersey number | The site fills itself in |

The viral loop: purchase → celebration → parent shares the card → other parents
see it + the wall → next purchase. Ship the whole loop or none of it.

## 2. Intake sheet (fill this before touching code)

From the 7/18 spec. Most of it comes from the club's public website + Instagram
without asking them anything.

- Organization name, city, league affiliation (Pop Warner, AYSO, USA Hockey...)
- Sport(s) and programs (Football / Cheer / Soccer / Boys / Girls)
- Age categories (U6–U17, 6U–14U — use THEIR notation)
- Logo (transparent PNG), two brand colors (one accent drives the whole card recolor)
- Hero photo: real action shot from their site or IG (rights: their own media, used in a demo FOR them)
- ONE featured-card photo: a real player moment from public club media (the anchor card)
- Fundraising goal in dollars (ask, or default $25K)
- The HOOK: famous alum, championship, anniversary (Colts = Dillon Mitchell, Boston Celtics)
- Club president / decision maker + email
- Instagram handle + follower count
- Season start date (drives urgency and send timing)
- Subdomain slug: `<club>.prodigychain.ai`

## 3. Build procedure (clone → live demo)

1. **Clone the template repo** into a new repo (one repo per org for now; commit
   identity PFUNKTHEO2).
2. **Swap the data layer:**
   - `src/lib/data.ts` — teamConfig (name, tagline, goal, season), milestones, sponsors copy
   - `src/lib/teams.ts` — age groups, programs, sport-correct position lists
   - `src/lib/featured.ts` — the ONE curated featured card (real photo, real kid moment)
3. **Swap assets:** logo, hero photo, per-sport position silhouettes
   (football/cheer/soccer wired; a new sport needs a silhouette set first).
4. **Recolor (2026-08-09 update):** CSS brand variables recolor the SITE
   (chrome, buttons, hero). The CARD does not recolor per club: every card
   surface renders the canonical ProdigyCard chassis (`PrintCardFront` +
   one of the 5 shared templates in `lib/cardTemplates.ts`; David's rule —
   no 6th template without real frame artwork). Pick the closest of the 5
   colorways for the club and set the club crest via `clubLogoUrl`. The old
   per-club recolorable CardFrame is retired and deleted.
5. **Copy pass:** sport-correct language everywhere. No football-isms on a
   soccer site. Non-profit line, programs, city.
6. **Pricing:** server-side in `api/checkout.ts`. Defaults below (§5) until the
   org's agreement says otherwise. STRIPE KEY STAYS SANDBOX until signed.
7. **Deploy:** new Vercel project on philippe-7201s-projects.
   ⚠️ These repos are NOT git-linked — push does NOT deploy. Always
   `npx vercel deploy --prod --yes` from the repo.
8. **Subdomain:** add `<club>.prodigychain.ai` to the Vercel project, then in
   GoDaddy add CNAME `<club>` → `cname.vercel-dns.com` plus the `_vercel` TXT
   verification record Vercel prints. GoDaddy DNS saves need an SMS code to
   Philippe's phone, so a human is in the loop for this step.
9. **Verify (blocking, in a real browser):** create a card with a photo →
   frame renders → cart → sandbox checkout with 4242 card → Mint Moment shows
   the card + mint number → wall updates. If any step fails, the demo is not
   ready and nothing gets sent.

## 4. Hard-won build rules (violate these and the demo breaks)

- **PrintCardFront container contract:** the chassis sizes itself in `cqw`
  units. Every usage needs the wrapper: `aspect-[2.5/3.5]` +
  `style={{ containerType: "inline-size" }}` + PrintCardFront
  `className="absolute inset-0"`, plus `player={synthCardPlayer(...)}`,
  `template={getTemplate("prodigychain")}` and `clubLogoUrl`. Skip the
  wrapper and fonts blow up and the photo window collapses.
- **Positions must stay short on the card.** The chassis header was built for
  1-2 letter hockey positions; `synthCardPlayer` abbreviates long football and
  cheer names (Offensive Line → OL). Route every card render through
  `synthCardPlayer` — never hand-build a CardPlayer — or long positions smear
  across the frame wordmark.
- **The cart dies on the Stripe redirect** (in-memory). The Mint Moment reads a
  localStorage snapshot (`wc:last-mint`) saved right before redirect, with a
  photo-stripping fallback if the quota is hit.
- **Stripe is the only database.** `/api/mints` reads completed checkout
  sessions: count, club cut, supporters, per-player sold/raised. Edge-cached
  60s; anything that must count THIS order (mint number) bypasses with
  `?fresh=<timestamp>`.
- **Zero-state honesty:** no fake numbers, ever. Empty wall says "the first
  mint is up for grabs." Test orders named Demo/Test/Sample/Mint are filtered
  server-side. Go-live key swap resets stats to real automatically.
- **Privacy (non-negotiable):** public surfaces show first name + last initial
  only. No kids' photos on the wall or in stats. The full card travels only
  when the family that made it shares it. Parents create the card, parents own
  the share.
- **Registrations are device-local** (localStorage) in v1 — perfect for the
  self-demo motion, not for cross-device. Cross-device gallery needs the studio
  backend (later).

## 5. Pricing defaults (David's review requested)

Per the Colts December agreement + 7/18 session. Starting posture for new orgs;
David owns final numbers per deal.

| Product | Price | Club cut | Notes |
|---|---|---|---|
| Digital ProdigyCard | $15 | 75% ($11.25) | 1 per player |
| Metal physical card | $30 | 60% ($18) | pickup at club |
| 5.5×8.5 print | $40 | 50% ($20) | ~$8.39 cost + tax + ~$2 processing (Emma) |
| Coach's Edition framed team poster | $300 | auction item | ~$250 cost; team mom collects ~$10/family |

Revenue picture per org: 200 families × 30% adoption × ~$30 average =
~$1,800 season sales, ~$700–900 to ProdigyChain. The real product is the
repeatable machine: 50 orgs = a business line, and the story feeds the
investor deck ("we can raise your club 10K and you do not need to do a thing").

## 6. Go-live checklist (after the org says yes)

1. Agreement signed (one-season pilot on existing paper where possible — keeps
   their lawyer out).
2. Swap `STRIPE_SECRET_KEY` sandbox → live on the Vercel project + redeploy.
3. One real $15 test purchase + refund to prove the live rail.
4. First-drop cohort: the championship team or marquee squad mints first
   (scarcity + story).
5. Club announces on their IG; we supply the post + first-comment link.
6. Coach's Edition poster listed as the season auction item.

---

## 7. The Demo Factory — weekly sales process (proposal for David)

Principle proven with Eric Lopez: we do not pitch decks, we hand a club
president a working site with his own kids' colors on it and say "try the demo
from your phone." The demo is automated; the relationship is not — every org
gets a real call (David's rule from the photographer discussion: the calls are
where the intel comes from).

**Weekly cadence, 3 orgs/week:**

- **Monday — target.** Pick 3 orgs against the criteria: season starting in
  4–8 weeks, 150+ families, active Instagram, a hook (alum / championship /
  anniversary), and ideally one warm path (Kelly's photographer network,
  David's soccer contacts, Eric's Pop Warner network, later CZ/SK clubs).
- **Tuesday–Wednesday — build.** Claude builds the 3 custom demo sites from
  public info per §2–3. Sandbox checkout. Real subdomains.
- **Thursday — draft + review.** Outreach emails drafted in the Eric format
  (personal hook first, "we already built this for the <Club>", the
  3-minute phone demo steps, soft 20-minute call ask). David reviews sites +
  emails Thursday/Friday.
- **Monday 8:00 AM local — send.** (Monday-morning send rule.) Each email
  scheduled from prodigychain.
- **Friday — pipeline review.** 15 minutes: replies, calls booked, what the
  next 3 targets are. Pipeline lives in a shared tracker.

**Targets to start (proposal):** 3/week = ~12 demos/month. Early success bar:
1 in 4 books the call, 1 signed org every 2 weeks. Adjust after 4 weeks of
data.

**Roles:** Claude builds sites, drafts outreach, maintains the tracker.
Philippe sends, runs calls, owns Kelly/Eric referral channels. David reviews
every site before it ships, owns pricing and agreements, brings soccer + EU
targets when ready.

**Open questions for David:**
1. Weekly number: 3 orgs/week right, or start with 2?
2. Sport priority: football/cheer (Pop Warner window is NOW) then soccer, or
   run one soccer target/week from the start (Rangers as the soccer reference)?
3. Pricing defaults in §5: sign off or adjust before the first non-Colts demo?
4. US-only first month, or one CZ/SK club in the mix?
5. Referral economics for photographers/connectors who bring a club (Kelly 5%
   pattern): apply to clubs too?

---

*Everything in this doc is running in production at colts.prodigychain.ai.
Change the doc when the template changes; this file is the source of truth.*
