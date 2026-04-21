import type { MediaMode, PrefetchedPhotoRound, TaxonSlot } from "./types";

export interface RoundMutable {
  roundActual: TaxonSlot | null;
  roundBusy: boolean;
  startRoundEpoch: number;
  photoPrefetchGen: number;
  photoPrefetchPumpRunning: boolean;
  photoRoundPrefetchQueue: PrefetchedPhotoRound[];
  pendingMediaRetry: { mode: MediaMode; actual: TaxonSlot; taxonId: number } | null;
  taxonSearchDebounceTimer: ReturnType<typeof setTimeout> | null;
  quizVisualizerCleanup: (() => void) | null;
}

export function createRoundMutable(): RoundMutable {
  return {
    roundActual: null,
    roundBusy: false,
    startRoundEpoch: 0,
    photoPrefetchGen: 0,
    photoPrefetchPumpRunning: false,
    photoRoundPrefetchQueue: [],
    pendingMediaRetry: null,
    taxonSearchDebounceTimer: null,
    quizVisualizerCleanup: null,
  };
}
