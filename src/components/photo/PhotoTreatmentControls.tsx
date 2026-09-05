/**
 * The one control cluster for photo treatment, identical on every card editor:
 * a Remove background switch, a Shadow switch (disabled until a cutout exists),
 * a status line, and Undo. Imports only ui primitives and lucide so the club
 * microsites can copy it verbatim next to src/lib/photoTreatment.
 */

import { Loader2, Undo2, Wand2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { TreatmentState } from "@/lib/photoTreatment/usePhotoTreatment";

export interface PhotoTreatmentControlsProps {
  state: TreatmentState;
  onRemoveBackground: (on: boolean) => void;
  onShadow: (on: boolean) => void;
  onUndo: () => void;
  /** Disable everything (no photo yet, or the parent is uploading). */
  disabled?: boolean;
  className?: string;
}

function progressLabel(state: TreatmentState): string {
  const p = state.progress;
  if (state.status === "loading-model") {
    if (p?.phase === "download" && p.total) {
      const mb = (n: number) => (n / 1048576).toFixed(1);
      return `Downloading photo tool ${mb(p.loaded ?? 0)} / ${mb(p.total)} MB`;
    }
    return "Preparing photo tool…";
  }
  if (state.status === "processing") return p?.phase === "compose" ? "Adding shadow…" : "Cutting out the player…";
  return "";
}

export default function PhotoTreatmentControls({
  state, onRemoveBackground, onShadow, onUndo, disabled, className,
}: PhotoTreatmentControlsProps) {
  const busy = state.status === "loading-model" || state.status === "processing";
  const hasCutout = state.treatment.removeBackground && !!state.cutout;
  const canUndo = state.treatment.removeBackground || state.treatment.shadow;
  const label = progressLabel(state);

  return (
    <div className={`rounded-lg border border-border/60 bg-card/40 p-3 text-sm ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-primary" />
          <span className="font-medium">Remove background</span>
        </label>
        <Switch
          checked={state.treatment.removeBackground}
          onCheckedChange={onRemoveBackground}
          disabled={disabled || busy || !state.supported}
          aria-label="Remove background"
        />
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <label className="flex flex-col">
          <span className={`font-medium ${hasCutout ? "" : "text-muted-foreground"}`}>Shadow</span>
          {!hasCutout && <span className="text-xs text-muted-foreground">Turn on Remove background first</span>}
        </label>
        <Switch
          checked={state.treatment.shadow}
          onCheckedChange={onShadow}
          disabled={disabled || busy || !hasCutout}
          aria-label="Shadow behind the player"
        />
      </div>

      {(busy || label) && (
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground" role="status" aria-live="polite">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>{label}</span>
          {state.progress?.phase === "download" && typeof state.progress.pct === "number" && (
            <span className="ml-auto h-1.5 w-24 overflow-hidden rounded-full bg-muted">
              <span className="block h-full bg-primary transition-[width]" style={{ width: `${Math.round(state.progress.pct * 100)}%` }} />
            </span>
          )}
        </div>
      )}

      {!busy && !state.supported && (
        <p className="mt-2 text-xs text-muted-foreground">Background removal is not available in this browser. Your photo is used as is.</p>
      )}
      {!busy && state.supported && !state.cutout && !state.error && !state.treatment.removeBackground && (
        <p className="mt-2 text-xs text-muted-foreground">Downloads a small photo tool the first time (kept on this device).</p>
      )}
      {state.error && (
        <p className="mt-2 text-xs text-amber-400" role="alert">{state.error}</p>
      )}

      {canUndo && !busy && (
        <button
          type="button"
          onClick={onUndo}
          className="mt-3 inline-flex items-center gap-1 text-xs text-primary/80 transition hover:text-primary"
        >
          <Undo2 className="h-3.5 w-3.5" />
          Undo, use the original photo
        </button>
      )}
    </div>
  );
}
