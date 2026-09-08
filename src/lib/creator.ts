/**
 * The hosted card creator. Card creation no longer lives in this repo: the
 * family goes to prodigychain.ai/create/{club}, builds the card on the one
 * shared ProdigyChain creator, and comes back to /create/return?card=<slug>
 * with the finished card (playbook §3.8, docs/CARD_CREATOR.md in
 * prodigy-rankings). CLUB_CREATOR_SLUG is the `clubs.slug` on ProdigyChain,
 * not the Stripe CLUB_SLUG in api/checkout.ts.
 */

export const CREATOR_ORIGIN = "https://www.prodigychain.ai";
export const CLUB_CREATOR_SLUG = "westchase-colts";

export interface CreatorPrefill {
  teamId?: string;
  player?: string;
  number?: string;
  position?: string;
  nationality?: string;
}

export function creatorUrl(prefill: CreatorPrefill = {}): string {
  const q = new URLSearchParams();
  q.set("return", `${window.location.origin}/create/return`);
  if (prefill.teamId) q.set("team", prefill.teamId);
  if (prefill.player) q.set("player", prefill.player);
  if (prefill.number) q.set("number", prefill.number);
  if (prefill.position) q.set("position", prefill.position);
  if (prefill.nationality) q.set("nationality", prefill.nationality);
  return `${CREATOR_ORIGIN}/create/${CLUB_CREATOR_SLUG}?${q.toString()}`;
}

export interface HostedCard {
  slug: string;
  template: string;
  inline_card: {
    athlete_name: string;
    team?: string | null;
    position?: string | null;
    jersey_number?: string | null;
    nationality?: string | null;
    blurb?: string | null;
  };
  photo_transform: { x: number; y: number; scale: number; rotate?: number } | null;
  club_team_id: string | null;
  parent_name: string | null;
  /** Stable URL; re-signs the preview image on every hit. */
  photo_url: string;
  created_at: string;
}

export async function fetchHostedCard(slug: string): Promise<HostedCard | null> {
  const res = await fetch(`${CREATOR_ORIGIN}/api/club/${CLUB_CREATOR_SLUG}/card/${encodeURIComponent(slug)}`);
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  return json?.ok ? (json as HostedCard) : null;
}
