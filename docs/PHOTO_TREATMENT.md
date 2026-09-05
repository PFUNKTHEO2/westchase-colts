# Photo treatment: Remove background + Shadow

Added 2026-09-05. Two options a card creator can apply to their photo, on every
card editor: **Remove background** (a switch, with Undo) and **Shadow** (one fixed
drop shadow behind the cutout, only available once the background is removed).
Nothing else from the old card creator came back.

## How it works

- Runs **in the browser**. `@huggingface/transformers` loads lazily on the first
  toggle, picks WebGPU when available (fp16 model) and falls back to WASM (q8),
  and caches the model with the browser Cache API. No server compute, no upload
  before the creator decides to buy.
- Model: `Xenova/modnet` (Apache-2.0, portrait matting). Swap candidate:
  `onnx-community/ormbg-ONNX` (Apache-2.0, IS-Net family, heavier). Rejected for
  licensing: BRIA RMBG 1.4/2.0 (non-commercial), `@imgly/background-removal`
  (AGPL). Override with `VITE_PHOTO_TREATMENT_MODEL`; point at a self-hosted
  mirror with `VITE_PHOTO_TREATMENT_MODEL_HOST` (expects `<host>/<model>/...`).
- **Baked, not propped.** The shadow is drawn into the exported image
  (`applyShadow.ts`), so the treated photo is just a PNG/WebP with alpha that
  flows through every existing photo path. `PrintCardFront`, `buildRenderUrl`,
  `RenderPrintCard`, the print pipeline, `custom_cards`, `player_cards`, studio
  `pdata` and the club-site copies are untouched. What the creator approved is
  what prints.
- Fixed shadow look: blur 3% of the long side, offset 1% right and 1.5% down,
  `rgba(0,0,0,0.55)`, canvas padded so nothing clips. On editors that allow a
  90-degree rotation the offset is counter-rotated so the light keeps falling
  down-right on the card.

## Module (copy verbatim into club repos)

`src/lib/photoTreatment/`
- `types.ts` — `PhotoTreatment`, progress and error types, `SHADOW_DEFAULTS`.
- `core.ts` — pure helpers (matte, alpha check, padding, size ladder, format
  pick). Unit-tested in `tests/photo-treatment/core.test.ts` (`npm run test:photo-treatment`).
- `removeBackground.ts` — lazy model load, device pick, inference, PNG out.
- `applyShadow.ts` — canvas shadow pass.
- `export.ts` — WebP-with-alpha where the browser encodes it, else PNG, stepping
  down the size ladder (never below the 1125 px short side the photo gate
  requires, never above 2400 px long side) until under the 3 MB upload budget.
- `usePhotoTreatment.ts` — React state: original kept for Undo, cutout cached,
  shadow forces off when the cutout goes off, failure snaps the switch back.

`src/components/photo/PhotoTreatmentControls.tsx` — the one control cluster.

## Rules that still apply

`docs/CARD_PHOTO_RULES.md` is unchanged: clean framings only, no limb cuts, no
watermarks on the subject, real photos. Background removal is not a way to hide
a watermark; the photo gate still runs on the treated file.

## Sync with the club microsites

The club sites are independent copies. Copy `src/lib/photoTreatment/*` and
`PhotoTreatmentControls.tsx` byte-identical, the same rule the microsite
playbook already applies to `printSpec.ts`. Reference implementation for the
club Create Card page: `westchase-colts`.
