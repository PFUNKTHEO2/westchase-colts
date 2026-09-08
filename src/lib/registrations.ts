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
  /** Photo URL. Cards made on the hosted creator carry a stable ProdigyChain
   *  URL that re-signs the image on every hit; older rows hold a data URL. */
  photo: string;
  /** crop/zoom the parent set in the frame (PrintCardFront PhotoTransform) */
  photoTransform?: { x: number; y: number; scale: number; rotate?: number };
  /** legacy: treatment applied in-browser by the old on-site creator */
  treatment?: { removeBackground: boolean; shadow: boolean };
  /** ProdigyChain listing slug when the card was made on the hosted creator. */
  listingSlug?: string;
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

export function findByListingSlug(slug: string): CardRegistration | undefined {
  return listRegistrations().find((r) => r.listingSlug === slug);
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
