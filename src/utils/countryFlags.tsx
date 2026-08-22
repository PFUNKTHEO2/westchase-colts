/**
 * Ported from prodigy-rankings/src/utils/countryFlags.tsx (the real
 * ranked-player platform) so club microsite cards use the exact same flags,
 * not an approximation. Keep in sync with that file if it changes.
 */
import * as flags from "country-flag-icons/react/3x2";
import scotlandFlag from "@/assets/flags/scotland.png";
import walesFlag from "@/assets/flags/wales.png";
import englandFlag from "@/assets/flags/england.png";

// Country name to ISO code mapping
export const COUNTRY_ISO_CODES: Record<string, keyof typeof flags> = {
  "Canada": "CA",
  "USA": "US",
  "Russia": "RU",
  "Sweden": "SE",
  "Finland": "FI",
  "Czechia": "CZ",
  "Czech": "CZ",
  "Czech Republic": "CZ",
  "Germany": "DE",
  "Slovakia": "SK",
  "Switzerland": "CH",
  "Australia": "AU",
  "Austria": "AT",
  "Belarus": "BY",
  "Bulgaria": "BG",
  "China": "CN",
  "Croatia": "HR",
  "Denmark": "DK",
  "England": "GB",
  "Estonia": "EE",
  "France": "FR",
  "Hungary": "HU",
  "Iceland": "IS",
  "Israel": "IL",
  "Italy": "IT",
  "Japan": "JP",
  "Kazakhstan": "KZ",
  "Latvia": "LV",
  "Lithuania": "LT",
  "Netherlands": "NL",
  "Norway": "NO",
  "Poland": "PL",
  "Romania": "RO",
  "Scotland": "GB",
  "Slovenia": "SI",
  "South Korea": "KR",
  "Spain": "ES",
  "Turkey": "TR",
  "Ukraine": "UA",
  "Wales": "GB",
  "Belgium": "BE",
  "Ireland": "IE",
  "Luxembourg": "LU",
  "Mexico": "MX",
  "Brazil": "BR",
  "Argentina": "AR",
  "Chile": "CL",
  "South Africa": "ZA",
  "New Zealand": "NZ",
  "Singapore": "SG",
  "Thailand": "TH",
  "Vietnam": "VN",
  "India": "IN",
  "Philippines": "PH",
  "Indonesia": "ID",
  "Malaysia": "MY",
  "Hong Kong": "HK",
  "Taiwan": "TW",
  "Portugal": "PT",
  "Greece": "GR",
  "Serbia": "RS",
  "Bosnia and Herzegovina": "BA",
  "North Macedonia": "MK",
  "Albania": "AL",
  "Moldova": "MD",
  "Montenegro": "ME",
  "Kosovo": "XK",
  "Armenia": "AM",
  "Georgia": "GE",
  "Azerbaijan": "AZ",
  "Uzbekistan": "UZ",
  "Kyrgyzstan": "KG",
  "Tajikistan": "TJ",
  "Turkmenistan": "TM",
  "Mongolia": "MN",
};

/** Alphabetized list of pickable nationalities, for the card-creator dropdown. */
export const NATIONALITY_OPTIONS = Object.keys(COUNTRY_ISO_CODES).sort((a, b) => a.localeCompare(b));

// Nordic-cross flags (Finland, Sweden, …) carry the cross left of center, so in the
// round card slot it reads as off-center to the left — nudge them right to recenter.
const NORDIC_CROSS = new Set(["Finland", "Sweden", "Norway", "Denmark", "Iceland"]);

/**
 * className for a flag rendered in the round nationality slot on a ProdigyCard.
 * Tighter zoom than a plain flag so it fills the slot with no white edge, plus a
 * horizontal nudge to recenter Nordic-cross flags. Shared by every place that
 * renders the card chassis, so the framing stays identical everywhere.
 */
export const cardFlagClass = (country: string): string =>
  `h-full w-full object-cover scale-[1.65]${NORDIC_CROSS.has(country) ? " translate-x-[10%]" : ""}`;

/** The flag node for the round nationality slot on a ProdigyCard. Falls back
 * to null (badge is simply omitted) for an unrecognized/unset country — the
 * card creator defaults to "USA", so this should only be null for very old
 * saved cards from before nationality was collected. */
export const getFlagNode = (country?: string) => {
  if (!country) return null;
  const cls = cardFlagClass(country);
  if (country === "Scotland") return <img src={scotlandFlag} alt="" className={cls} />;
  if (country === "Wales") return <img src={walesFlag} alt="" className={cls} />;
  if (country === "England") return <img src={englandFlag} alt="" className={cls} />;
  const iso = COUNTRY_ISO_CODES[country];
  if (!iso) return null;
  const Flag = flags[iso];
  return Flag ? <Flag className={cls} /> : null;
};
