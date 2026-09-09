/**
 * Auto-size the card-back story so a short blurb fills its box instead of
 * floating as two small lines in a lot of empty space (David 2026-09-09).
 *
 * Why it matters: 67,832 published blurbs, median 95 characters, 99.9% under
 * 120 — while the box is laid out for roughly 400 at the base size. Nearly
 * every card in the system under-fills.
 *
 * Deterministic on purpose: the size comes from the character count and the
 * box width, never from measuring the rendered page. The browser, the 3D
 * share page and the headless print render therefore agree, and nothing can
 * race the print engine's screenshot (it fires on document.body.dataset
 * .cardReady, which a post-layout measurement pass would land after).
 *
 * The line limit shrinks as the type grows, so the total block height stays
 * inside the box and a long blurb can never overflow it. The base size is the
 * floor: long blurbs render exactly as they did before this existed.
 */

export interface BlurbFitInput {
  /** cqw size used today, and the floor: long text still renders at this. */
  baseSize: number;
  /** Line limit at the base size (the box height, in lines). */
  maxLines: number;
  /** Never grow past this. Default keeps the story under the player's name. */
  maxSize?: number;
  /** Inner width of the blurb box in cqw. */
  boxWidth?: number;
}

export interface BlurbFit {
  /** CSS font-size, e.g. "4.4cqw". */
  fontSize: string;
  /** -webkit-line-clamp at that size. */
  lineClamp: number;
  /** Chosen size as a number, for tests. */
  size: number;
}

/**
 * Average glyph advance of the card font (Rift, italic) as a fraction of the
 * font size. Measured off a printed back: 77 characters filled one 84.2cqw
 * line at 2.9cqw, i.e. 0.377. Rounded up so the estimate errs toward more
 * lines and therefore a smaller size; overshooting the size is what would
 * truncate text, undershooting only leaves a little air.
 */
const AVG_CHAR_EM = 0.4;
/** Word wrapping never uses the full measure. */
const WRAP_FILL = 0.95;
/** Content box is inset 5.5% each side of the trim box, less 2.4cqw padding each side. */
export const BLURB_BOX_WIDTH_CQW = 100 - 2 * 5.5 - 2 * 2.4;
/**
 * The maximum, set against printed backs: the name is 7cqw bold, the bio line
 * 3cqw, the stats table 2.5-2.7cqw. At 5.6 the story is clearly the second
 * voice on the card, a median (95 character) blurb wraps to three lines and
 * fills the box, and there is still a fifth of a size step down to the name.
 * 4.8 and 5.2 both left the text on two lines with air above and below, which
 * is the thing David asked to remove.
 */
export const BLURB_MAX_SIZE_WITH_STATS = 5.6;
/** Same ceiling with no stats table; that box is taller, and its stories are longer. */
export const BLURB_MAX_SIZE_NO_STATS = 5.6;

const STEP = 0.1;

function linesNeeded(text: string, size: number, boxWidth: number): number {
  const perLine = (boxWidth * WRAP_FILL) / (size * AVG_CHAR_EM);
  if (perLine <= 0) return Number.MAX_SAFE_INTEGER;
  // Explicit breaks count as their own lines.
  return text
    .split("\n")
    .reduce((sum, para) => sum + Math.max(1, Math.ceil(para.trim().length / perLine)), 0);
}

export function fitBlurb(text: string, opts: BlurbFitInput): BlurbFit {
  const { baseSize, maxLines } = opts;
  const boxWidth = opts.boxWidth ?? BLURB_BOX_WIDTH_CQW;
  const maxSize = Math.max(baseSize, opts.maxSize ?? baseSize);
  const body = (text ?? "").trim();
  // Height budget in cqw of line boxes; leading cancels because both sides scale.
  const budget = baseSize * maxLines;

  if (!body) return { fontSize: `${baseSize}cqw`, lineClamp: maxLines, size: baseSize };

  for (let size = Math.round(maxSize * 10) / 10; size > baseSize; size -= STEP) {
    const s = Math.round(size * 10) / 10;
    const allowed = Math.floor(budget / s);
    if (allowed < 1) continue;
    if (linesNeeded(body, s, boxWidth) <= allowed) {
      return { fontSize: `${s}cqw`, lineClamp: allowed, size: s };
    }
  }
  return { fontSize: `${baseSize}cqw`, lineClamp: maxLines, size: baseSize };
}
