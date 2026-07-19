/**
 * Shared client for the live mint feed (/api/mints, Stripe-backed).
 * One fetch per page load, shared by Hero, Mint Wall, Milestones,
 * Leaderboard, the card gallery, and the sponsor page — so every number a
 * visitor sees is real, including the zeros before the first sale.
 */
import { useEffect, useState } from "react";

export interface Mint {
  name: string;
  teamLabel: string;
  variant: "digital" | "metal";
  ts: number;
}

export interface PlayerMintStats {
  /** privacy-safe: first name + last initial */
  name: string;
  teamLabel: string;
  sold: number;
  raised: number;
}

export interface MintFeed {
  count: number;
  raised: number;
  supporters: number;
  recent: Mint[];
  players: PlayerMintStats[];
}

let cached: MintFeed | null = null;
let inflight: Promise<MintFeed | null> | null = null;

function load(): Promise<MintFeed | null> {
  if (cached) return Promise.resolve(cached);
  inflight ??= fetch("/api/mints")
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (d && Number.isInteger(d.count)) {
        cached = {
          count: d.count,
          raised: d.raised ?? 0,
          supporters: d.supporters ?? 0,
          recent: Array.isArray(d.recent) ? d.recent : [],
          players: Array.isArray(d.players) ? d.players : [],
        };
      }
      return cached;
    })
    .catch(() => null);
  return inflight;
}

/** null while loading or unavailable — render the zero state in that case */
export function useMintFeed(): MintFeed | null {
  const [feed, setFeed] = useState<MintFeed | null>(cached);
  useEffect(() => {
    let alive = true;
    load().then((f) => {
      if (alive && f) setFeed(f);
    });
    return () => {
      alive = false;
    };
  }, []);
  return feed;
}

/** "Jayden Cruz" → "Jayden C." — must match the server's publicName exactly */
export function publicName(full: string): string {
  const parts = full.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A Colt";
  const first = parts[0];
  const lastInitial = parts.length > 1 ? ` ${parts[parts.length - 1][0].toUpperCase()}.` : "";
  return `${first}${lastInitial}`;
}

/** metrics for one card, joined by privacy-safe name + team line */
export function statsForPlayer(
  feed: MintFeed | null,
  fullName: string,
  teamLabel: string,
): PlayerMintStats | null {
  if (!feed) return null;
  const key = `${publicName(fullName)}|${teamLabel}`.toLowerCase();
  return (
    feed.players.find((p) => `${p.name}|${p.teamLabel}`.toLowerCase() === key) ?? null
  );
}
