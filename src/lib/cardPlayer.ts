/**
 * Minimal player-shaped record for the shared print-card chassis. This is a
 * trimmed local stand-in for prodigy-rankings' full `Player` type (which
 * carries 37 ranking-algorithm factor fields this club site has no use for) —
 * PrintCardFront/PrintCardBack only ever read the fields below.
 */
export interface CardPlayer {
  player_id: number;
  player_name: string;
  position: string;
  current_team?: string;
  overall_rank?: number;
  country_rank?: number;
  nationality_name?: string;
  birth_year?: number;
  height_cm?: number;
  weight_kg?: number;
}

/**
 * Build a render-ready CardPlayer for a family-registered (off-database)
 * athlete — mirrors prodigy-rankings' synthPlayer() for the studio/custom-card
 * chassis. player_id stays 0: that's the off-DB sentinel the chassis checks
 * before doing any EP-lookup or QR-to-profile rendering, so it's the reason
 * ranks/QR/flags all correctly stay hidden for a club card with no ranking
 * profile behind it.
 */
/**
 * The chassis header badge was designed for 1-2 letter hockey positions
 * (C, LW, G); full football/cheer position names overrun the frame's wordmark.
 * Same abbreviation table the retired club CardFrame used.
 */
const POSITION_ABBREV: Record<string, string> = {
  Quarterback: "QB", "Running Back": "RB", "Wide Receiver": "WR", "Tight End": "TE",
  "Offensive Line": "OL", "Defensive Line": "DL", Linebacker: "LB", Cornerback: "CB",
  Safety: "S", Kicker: "K", Athlete: "ATH",
  Flyer: "FLY", Base: "BASE", Backspot: "BS", Tumbler: "TUM", Dancer: "DAN",
  // Soccer, added for the Hernando Premier FC clones (2026-08-20); kept in the
  // template so every club inherits the same table.
  Goalkeeper: "GK", "Center Back": "CB", Fullback: "FB", "Defensive Mid": "CDM",
  "Central Mid": "CM", Winger: "W", Forward: "F", Striker: "ST",
  "Head Coach": "HC",
};

export function synthCardPlayer(p: {
  name: string;
  position: string;
  team?: string;
  /** country name key into @/utils/countryFlags COUNTRY_ISO_CODES; missing = "USA" */
  nationality?: string;
}): CardPlayer {
  return {
    player_id: 0,
    player_name: p.name || "Player Name",
    position: POSITION_ABBREV[p.position] ?? p.position ?? "",
    current_team: p.team || "",
    // Family-picked in the card creator (2026-08-21), not looked up: there is
    // no EP profile behind a club card to read it from.
    nationality_name: p.nationality || "USA",
  };
}
