/**
 * Family card registrations — the parent/kid self-serve flow.
 *
 * Demo persistence is localStorage; `saveRegistration` is the single seam to
 * swap for the real backend (ProdigyChain studio API) without touching the UI.
 */

export interface CardRegistration {
  id: string;
  createdAt: string;
  parentName: string;
  parentEmail: string;
  playerName: string;
  jerseyNumber: string;
  division: string;
  program: "Football" | "Cheer";
  position: string;
  /** country name key into @/utils/countryFlags COUNTRY_ISO_CODES; missing = "USA" */
  nationality?: string;
  blurb: string;
  /** data-URL of the uploaded photo (demo); becomes a storage path in prod. */
  photo: string;
  /** crop/zoom the parent set in the frame (CardFrame PhotoTransform) */
  photoTransform?: { x: number; y: number; scale: number };
  /** one of the 5 canonical CARD_TEMPLATES ids; missing = "prodigychain" */
  templateId?: string;
}

const KEY = "colts_card_registrations";

export function listRegistrations(): CardRegistration[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as CardRegistration[];
  } catch {
    return [];
  }
}

export function saveRegistration(reg: Omit<CardRegistration, "id" | "createdAt">): CardRegistration {
  const full: CardRegistration = {
    ...reg,
    id: `reg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  const all = listRegistrations();
  all.push(full);
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage full (big photos) — registration still proceeds in-session */
  }
  return full;
}
