/**
 * Ready Comics print geometry for the canonical ProdigyCard. Ported verbatim
 * from prodigy-rankings/src/components/print/printSpec.ts so this project
 * renders the exact same chassis geometry — keep in sync if that file changes.
 */
export const PRINT = {
  ARTBOARD_W: 825,
  ARTBOARD_H: 1125,
  TRIM_W: 750,
  TRIM_H: 1050,
  SAFE_W: 675,
  SAFE_H: 975,
  ARTBOARD_RATIO: "825 / 1125",
  BLEED_PCT_W: (37.5 / 825) * 100,
  BLEED_PCT_H: (37.5 / 1125) * 100,
} as const;
