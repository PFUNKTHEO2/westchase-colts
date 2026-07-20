/**
 * POST /api/checkout — creates a Stripe Checkout Session from the cart.
 * Prices are resolved server-side from the variant; the client never sends
 * amounts. Talks to Stripe over raw REST so no SDK dependency is needed.
 * STRIPE_SECRET_KEY decides the mode: sk_test_ = test mode, sk_live_ = live.
 *
 * CLUB_SLUG tags every session (metadata.club) so /api/mints can filter to
 * this club only — club sites share one Stripe sandbox account, and without
 * this tag each site's live wall would read every other club's sales too
 * (caught 7/20 building the Rangers clone: Rangers' wall was showing a stray
 * Colts-era test charge).
 */
const CLUB_SLUG = "colts";
// 50/50 split, per David's pricing pass (7/20): half to the club, half
// covers card creation, payment processing, and the platform fee.
const PRICES_CENTS: Record<string, number> = {
  digital: 1000,
  metal: 2000,
  postcard: 3800,
};

const LABELS: Record<string, string> = {
  digital: "Digital ProdigyCard",
  metal: "Physical Trading Card",
  postcard: "ProdigyCard Postcard (5.5x8.5)",
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return res.status(500).json({ error: "Payments are not configured" });
  }

  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  const valid = items.filter(
    (i: any) =>
      typeof i?.variant === "string" &&
      PRICES_CENTS[i.variant] !== undefined &&
      Number.isInteger(i?.quantity) &&
      i.quantity > 0 &&
      i.quantity <= 25,
  );
  if (valid.length === 0 || valid.length > 20) {
    return res.status(400).json({ error: "Cart is empty or invalid" });
  }

  const proto = req.headers["x-forwarded-proto"] ?? "https";
  const host = req.headers["x-forwarded-host"] ?? req.headers.host;
  const origin = `${proto}://${host}`;

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${origin}/checkout/success`);
  params.set("cancel_url", `${origin}/create-card`);
  params.set("metadata[club]", CLUB_SLUG);
  valid.forEach((item: any, idx: number) => {
    const detail = [item.playerName, item.teamLabel]
      .filter((v: any) => typeof v === "string" && v.trim())
      .join(", ")
      .slice(0, 120);
    const name = detail ? `${LABELS[item.variant]} (${detail})` : LABELS[item.variant];
    params.set(`line_items[${idx}][quantity]`, String(item.quantity));
    params.set(`line_items[${idx}][price_data][currency]`, "usd");
    params.set(`line_items[${idx}][price_data][unit_amount]`, String(PRICES_CENTS[item.variant]));
    params.set(`line_items[${idx}][price_data][product_data][name]`, name);
  });
  if (valid.some((i: any) => i.variant === "metal" || i.variant === "postcard")) {
    params.set("shipping_address_collection[allowed_countries][0]", "US");
  }

  const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  const session = await resp.json();
  if (!resp.ok || !session?.url) {
    console.error("Stripe checkout session failed:", session?.error?.message);
    return res.status(502).json({ error: "Could not start checkout" });
  }

  return res.status(200).json({ url: session.url });
}
