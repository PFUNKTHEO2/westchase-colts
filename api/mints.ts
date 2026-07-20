/**
 * GET /api/mints — live card feed straight from Stripe (no database).
 * Reads completed Checkout Sessions, counts card line items, computes the
 * club's 50/50 cut (metal $10 of $20, digital $5 of $10, postcard $19 of
 * $38) and returns the most recent cards as privacy-safe chips (first name
 * + last initial, team, variant) for the public Card Wall. Cached 60s.
 */
const CLUB_CUT: Record<string, number> = { metal: 10, digital: 5, postcard: 19 };

// Must match checkout.ts CLUB_SLUG — club sites share one Stripe sandbox
// account, so without this filter every club's wall would show every other
// club's sales. Sessions from before this tag existed (or from unrelated
// manual Stripe testing) carry no club metadata and are excluded.
const CLUB_SLUG = "colts";

// Match on keywords, not a fragile prefix — survives label wording changes
// (checkout.ts LABELS is the source of truth for what ships in the name).
// "Physical Trading Card (Demo Colt, 6U Football)" → variant/player/team
function parseItem(desc: string): { variant: string | null; playerName: string; teamLabel: string } {
  const d = desc.toLowerCase();
  const variant = d.includes("postcard")
    ? "postcard"
    : d.includes("digital")
      ? "digital"
      : d.includes("metal") || d.includes("physical") || d.includes("trading card")
        ? "metal"
        : null;
  const m = desc.match(/\(([^)]*)\)\s*$/);
  let playerName = "";
  let teamLabel = "";
  if (m) {
    const parts = m[1].split(",").map((s) => s.trim());
    playerName = parts[0] ?? "";
    teamLabel = parts.slice(1).join(", ");
  }
  return { variant, playerName, teamLabel };
}

/** "Demo Test" → "Demo T." — first name + last initial only, never the full name */
function publicName(full: string): string {
  const parts = full.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A Colt";
  const first = parts[0];
  const lastInitial = parts.length > 1 ? ` ${parts[parts.length - 1][0].toUpperCase()}.` : "";
  return `${first}${lastInitial}`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return res.status(500).json({ error: "Not configured" });
  const auth = { Authorization: `Bearer ${key}` };

  const sessResp = await fetch(
    "https://api.stripe.com/v1/checkout/sessions?status=complete&limit=100",
    { headers: auth },
  );
  const sessions = await sessResp.json();
  if (!sessResp.ok || !Array.isArray(sessions?.data)) {
    return res.status(502).json({ error: "Could not load mints" });
  }

  const lineItemLists = await Promise.all(
    sessions.data.map((s: any) =>
      fetch(`https://api.stripe.com/v1/checkout/sessions/${s.id}/line_items?limit=100`, { headers: auth })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ),
  );

  let count = 0;
  let raised = 0;
  let supporters = 0;
  const recent: { name: string; teamLabel: string; variant: string; ts: number }[] = [];
  // per-card metrics for the gallery/roster: how many sold, dollars to the club
  const byPlayer = new Map<string, { name: string; teamLabel: string; sold: number; raised: number }>();

  sessions.data.forEach((s: any, idx: number) => {
    if (s?.metadata?.club !== CLUB_SLUG) return;
    const items = lineItemLists[idx]?.data;
    if (!Array.isArray(items)) return;
    let sessionHadCard = false;
    for (const li of items) {
      const desc = typeof li.description === "string" ? li.description : "";
      const { variant, playerName, teamLabel } = parseItem(desc);
      if (!variant) continue;
      // internal test orders never reach the public wall
      if (/^(demo|test|sample|mint|verify)\b/i.test(playerName)) continue;
      const qty = Number.isInteger(li.quantity) ? li.quantity : 1;
      sessionHadCard = true;
      count += qty;
      raised += CLUB_CUT[variant] * qty;
      recent.push({
        name: publicName(playerName),
        teamLabel,
        variant,
        ts: (s.created ?? 0) * 1000,
      });
      const pubName = publicName(playerName);
      const pKey = `${pubName}|${teamLabel}`.toLowerCase();
      const p = byPlayer.get(pKey) ?? { name: pubName, teamLabel, sold: 0, raised: 0 };
      p.sold += qty;
      p.raised += CLUB_CUT[variant] * qty;
      byPlayer.set(pKey, p);
    }
    if (sessionHadCard) supporters += 1;
  });

  recent.sort((a, b) => b.ts - a.ts);
  const players = [...byPlayer.values()]
    .map((p) => ({ ...p, raised: Math.round(p.raised * 100) / 100 }))
    .sort((a, b) => b.raised - a.raised);

  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return res.status(200).json({
    count,
    raised: Math.round(raised * 100) / 100,
    supporters,
    recent: recent.slice(0, 12),
    players: players.slice(0, 50),
  });
}
