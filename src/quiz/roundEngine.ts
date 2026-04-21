import { getDefaultStore } from "jotai";
import {
  FEEDBACK_MS,
  PHOTO_PREFETCH_QUEUE_MAX,
  PHOTO_PREFETCH_RETRY_MS,
  PRESETS,
  SKIP_REVEAL_MS,
} from "./config";
import {
  fetchObservationForRandomCutoff,
  fetchObservationWithSoundForRandomCutoff,
  fetchTaxonById,
  preloadImageUrl,
  taxonSquareUrl,
} from "./inat";
import {
  commitPersistedAtom,
  patchPickerAtom,
  patchRoundDisplayAtom,
  persistedAtom,
  presetRowsAtom,
} from "./atoms";
import { startQuizAudioVisualizer } from "./audioVisualizer";
import { canonicalStatsPairKey } from "./stats";
import { getCurrentStatsFromState } from "./statsModel";
import type { RoundMutable } from "./roundMutable";
import type { InatTaxon, MediaMode, PersistedState, TaxonPair, TaxonSlot } from "./types";
import type { PresetRow, QuizDomRefs, RoundDisplayState } from "./viewTypes";

export interface RoundEngineDeps {
  getRefs: () => QuizDomRefs;
  getMutable: () => RoundMutable;
}

export interface RoundEngine {
  startRound: () => Promise<void>;
  applyGuess: (guess: TaxonSlot) => void;
  skipBadPhoto: () => void;
  onImageLoad: () => void;
  onImageError: () => void;
  schedulePhotoPrefetchPump: () => void;
  invalidatePhotoPrefetchQueue: () => void;
  rebuildPresetRows: () => Promise<void>;
  refreshPickerVisuals: () => Promise<void>;
  disposeQuizAudioRound: () => void;
  destroyQuizAudioVisualizer: () => void;
  tryPlayQuizAudio: () => Promise<void>;
}

export function createRoundEngine(deps: RoundEngineDeps): RoundEngine {
  const store = getDefaultStore();
  const { getRefs, getMutable } = deps;

  const patchDisplay = (partial: Partial<RoundDisplayState>): void => {
    store.set(patchRoundDisplayAtom, partial);
  };

  const destroyQuizAudioVisualizer = (): void => {
    const m = getMutable();
    if (m.quizVisualizerCleanup) {
      m.quizVisualizerCleanup();
      m.quizVisualizerCleanup = null;
    }
    getRefs().audioVisualizerWrapRef.current?.replaceChildren();
  };

  const stopQuizAudio = (): void => {
    const a = getRefs().quizAudioRef.current;
    if (!a) return;
    a.pause();
    a.removeAttribute("src");
    a.crossOrigin = null;
    a.load();
  };

  const disposeQuizAudioRound = (): void => {
    stopQuizAudio();
    destroyQuizAudioVisualizer();
    patchDisplay({ audioStageHidden: true, showAudioTapPlay: false });
  };

  const tryPlayQuizAudio = async (): Promise<void> => {
    patchDisplay({ showAudioTapPlay: false });
    const a = getRefs().quizAudioRef.current;
    if (!a) return;
    try {
      await a.play();
    } catch {
      patchDisplay({ showAudioTapPlay: true });
    }
  };

  const clearPendingMediaRetry = (): void => {
    getMutable().pendingMediaRetry = null;
  };

  const peekPendingMediaRetry = (mode: MediaMode, pair: TaxonPair) => {
    const p = getMutable().pendingMediaRetry;
    if (!p || p.mode !== mode) return null;
    const okSlot =
      (p.actual === "a" && p.taxonId === pair.idA) || (p.actual === "b" && p.taxonId === pair.idB);
    if (!okSlot) {
      getMutable().pendingMediaRetry = null;
      return null;
    }
    return { actual: p.actual, taxonId: p.taxonId };
  };

  const invalidatePhotoPrefetchQueue = (): void => {
    getMutable().photoPrefetchGen++;
    getMutable().photoRoundPrefetchQueue = [];
  };

  const ensurePhotoPrefetchQueueMatchesPair = (pair: TaxonPair): void => {
    const pk = canonicalStatsPairKey(pair);
    const q = getMutable().photoRoundPrefetchQueue;
    if (q.length > 0 && q.some((r) => r.pairKey !== pk)) {
      invalidatePhotoPrefetchQueue();
    }
  };

  const peekQueuedPhotoRound = (pair: TaxonPair) => {
    const pk = canonicalStatsPairKey(pair);
    ensurePhotoPrefetchQueueMatchesPair(pair);
    const head = getMutable().photoRoundPrefetchQueue[0];
    if (!head || head.pairKey !== pk) return null;
    return head;
  };

  let schedulePhotoPrefetchPump: () => void;

  schedulePhotoPrefetchPump = (): void => {
    const persisted = store.get(persistedAtom);
    if (persisted.mediaMode !== "photo") return;
    const m = getMutable();
    if (m.photoPrefetchPumpRunning) return;
    m.photoPrefetchPumpRunning = true;
    void (async () => {
      try {
        while (
          store.get(persistedAtom).mediaMode === "photo" &&
          getMutable().photoRoundPrefetchQueue.length < PHOTO_PREFETCH_QUEUE_MAX
        ) {
          const genBefore = getMutable().photoPrefetchGen;
          const lenBefore = getMutable().photoRoundPrefetchQueue.length;

          if (store.get(persistedAtom).mediaMode !== "photo") break;
          if (getMutable().photoRoundPrefetchQueue.length >= PHOTO_PREFETCH_QUEUE_MAX) break;

          const pair = store.get(persistedAtom).activePair;
          const capturedPairKey = canonicalStatsPairKey(pair);
          const actual: TaxonSlot = Math.random() < 0.5 ? "a" : "b";
          const taxonId = actual === "a" ? pair.idA : pair.idB;

          let added = false;
          for (let attempt = 0; attempt < 2; attempt++) {
            try {
              const { imageUrl, login } = await fetchObservationForRandomCutoff(taxonId);
              if (genBefore !== getMutable().photoPrefetchGen) break;
              if (store.get(persistedAtom).mediaMode !== "photo") break;
              if (canonicalStatsPairKey(store.get(persistedAtom).activePair) !== capturedPairKey) break;

              const ok = await preloadImageUrl(imageUrl);
              if (!ok) break;
              if (genBefore !== getMutable().photoPrefetchGen) break;
              if (store.get(persistedAtom).mediaMode !== "photo") break;
              if (canonicalStatsPairKey(store.get(persistedAtom).activePair) !== capturedPairKey) break;
              if (getMutable().photoRoundPrefetchQueue.length >= PHOTO_PREFETCH_QUEUE_MAX) break;

              getMutable().photoRoundPrefetchQueue.push({
                pairKey: capturedPairKey,
                actual,
                imageUrl,
                login,
              });
              added = true;
              break;
            } catch {
              if (attempt === 1) break;
            }
          }

          if (getMutable().photoPrefetchGen !== genBefore) break;
          if (getMutable().photoRoundPrefetchQueue.length >= PHOTO_PREFETCH_QUEUE_MAX) break;
          if (!added && getMutable().photoRoundPrefetchQueue.length === lenBefore) {
            await new Promise<void>((resolve) => {
              window.setTimeout(resolve, PHOTO_PREFETCH_RETRY_MS);
            });
            if (getMutable().photoPrefetchGen !== genBefore) break;
          }
        }
      } finally {
        getMutable().photoPrefetchPumpRunning = false;
      }
      if (
        store.get(persistedAtom).mediaMode === "photo" &&
        getMutable().photoRoundPrefetchQueue.length < PHOTO_PREFETCH_QUEUE_MAX
      ) {
        schedulePhotoPrefetchPump();
      }
    })();
  };

  const hideError = (): void => patchDisplay({ errorMsg: null });
  const hideFeedback = (): void => patchDisplay({ feedback: null });

  const bindPhotoQuizRound = (pair: TaxonPair, actual: TaxonSlot, imageUrl: string, login: string): void => {
    getMutable().roundActual = actual;
    patchDisplay({
      creditKind: "photo",
      creditLogin: login,
      imageAlt: `${actual === "a" ? pair.labelA : pair.labelB} (quiz image)`,
      showPlaceholder: true,
      showImage: false,
      guessDisabled: true,
      imageSrc: imageUrl,
    });
  };

  let startRound: () => Promise<void>;

  startRound = async (): Promise<void> => {
    const m = getMutable();
    const epoch = ++m.startRoundEpoch;

    hideError();
    hideFeedback();
    m.roundActual = null;
    disposeQuizAudioRound();

    const pair = store.get(persistedAtom).activePair;
    const mode = store.get(persistedAtom).mediaMode;

    if (m.pendingMediaRetry && m.pendingMediaRetry.mode !== mode) {
      clearPendingMediaRetry();
    }

    if (mode !== "photo") {
      invalidatePhotoPrefetchQueue();
    }

    if (mode === "photo") {
      const queued = peekQueuedPhotoRound(pair);
      if (queued) {
        if (epoch !== m.startRoundEpoch) return;
        m.photoRoundPrefetchQueue.shift();
        patchDisplay({ audioStageHidden: true });
        bindPhotoQuizRound(pair, queued.actual, queued.imageUrl, queued.login);
        return;
      }
    }

    if (epoch !== m.startRoundEpoch) return;

    patchDisplay({
      guessDisabled: true,
      showPlaceholder: true,
      placeholderText: mode === "photo" ? "Loading photo…" : "Loading recording…",
      showImage: false,
      ...(mode === "audio" ? { audioStageHidden: true } : {}),
    });

    const retrySlot = peekPendingMediaRetry(mode, pair);
    const actual: TaxonSlot = retrySlot ? retrySlot.actual : Math.random() < 0.5 ? "a" : "b";
    const taxonId = retrySlot ? retrySlot.taxonId : actual === "a" ? pair.idA : pair.idB;

    try {
      if (mode === "photo") {
        patchDisplay({ audioStageHidden: true });
        const { imageUrl, login } = await fetchObservationForRandomCutoff(taxonId);
        if (epoch !== m.startRoundEpoch) return;
        bindPhotoQuizRound(pair, actual, imageUrl, login);
      } else {
        patchDisplay({ imageSrc: undefined, showImage: false });
        const { soundUrl, login } = await fetchObservationWithSoundForRandomCutoff(taxonId);
        if (epoch !== m.startRoundEpoch) return;
        m.roundActual = actual;

        patchDisplay({ creditKind: "audio", creditLogin: login });

        const revealAudio = (): void => {
          clearPendingMediaRetry();
          patchDisplay({
            showPlaceholder: false,
            audioStageHidden: false,
            guessDisabled: false,
          });
          const wrap = getRefs().audioVisualizerWrapRef.current;
          const audio = getRefs().quizAudioRef.current;
          if (wrap && audio) {
            destroyQuizAudioVisualizer();
            m.quizVisualizerCleanup = startQuizAudioVisualizer(wrap, audio);
          }
          void tryPlayQuizAudio();
        };

        const audio = getRefs().quizAudioRef.current;
        if (!audio) return;

        audio.pause();
        audio.crossOrigin = null;
        const onAudioError = (): void => {
          m.roundActual = null;
          m.pendingMediaRetry = { mode: "audio", actual, taxonId };
          disposeQuizAudioRound();
          patchDisplay({ errorMsg: "Audio failed to load. Trying another…" });
          window.setTimeout(() => void startRound(), 800);
        };
        audio.addEventListener("error", onAudioError, { once: true });
        audio.addEventListener("canplaythrough", revealAudio, { once: true });
        audio.addEventListener("canplay", revealAudio, { once: true });
        audio.src = soundUrl;
        audio.load();
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      m.pendingMediaRetry = { mode, actual, taxonId };
      patchDisplay({
        errorMsg: `${msg} Retrying…`,
        showPlaceholder: true,
        showImage: false,
        creditLogin: null,
        creditKind: null,
        guessDisabled: true,
      });
      disposeQuizAudioRound();
      window.setTimeout(() => {
        hideError();
        void startRound();
      }, 2500);
    }
  };

  const applyGuess = (guess: TaxonSlot): void => {
    const m = getMutable();
    if (m.roundBusy || m.roundActual === null) return;
    const actual = m.roundActual;
    const correct = guess === actual;

    m.roundBusy = true;
    patchDisplay({ guessDisabled: true });
    getRefs().quizAudioRef.current?.pause();
    patchDisplay({ feedback: { kind: correct ? "correct" : "wrong", text: correct ? "✓" : "✗" } });

    const pair = store.get(persistedAtom).activePair;
    const stats = { ...getCurrentStatsFromState(store.get(persistedAtom)) };
    stats.totalAttempts += 1;
    if (correct) {
      stats.totalCorrect += 1;
      stats.currentStreak += 1;
      if (stats.currentStreak > stats.longestStreak) {
        stats.longestStreak = stats.currentStreak;
      }
    } else {
      stats.currentStreak = 0;
    }

    const low = Math.min(pair.idA, pair.idB);
    const correctTid = actual === "a" ? pair.idA : pair.idB;
    if (correctTid === low) {
      stats.shownA += 1;
      if (correct) stats.correctA += 1;
    } else {
      stats.shownB += 1;
      if (correct) stats.correctB += 1;
    }

    const key = canonicalStatsPairKey(pair);
    store.set(commitPersistedAtom, (p: PersistedState) => ({
      ...p,
      statsByPairKey: { ...p.statsByPairKey, [key]: { ...stats } },
    }));

    window.setTimeout(() => {
      hideFeedback();
      m.roundBusy = false;
      void startRound();
    }, FEEDBACK_MS);
  };

  const skipBadPhoto = (): void => {
    const m = getMutable();
    if (m.roundBusy || m.roundActual === null) return;
    const actual = m.roundActual;
    const pair = store.get(persistedAtom).activePair;
    const revealedLabel = actual === "a" ? pair.labelA : pair.labelB;

    m.roundBusy = true;
    patchDisplay({ guessDisabled: true });
    getRefs().quizAudioRef.current?.pause();
    patchDisplay({ feedback: { kind: "skip", text: revealedLabel } });

    const stats = { ...getCurrentStatsFromState(store.get(persistedAtom)) };
    const low = Math.min(pair.idA, pair.idB);
    const correctTid = actual === "a" ? pair.idA : pair.idB;
    if (correctTid === low) {
      stats.skipWhenA += 1;
    } else {
      stats.skipWhenB += 1;
    }
    const key = canonicalStatsPairKey(pair);
    store.set(commitPersistedAtom, (p: PersistedState) => ({
      ...p,
      statsByPairKey: { ...p.statsByPairKey, [key]: { ...stats } },
    }));

    window.setTimeout(() => {
      hideFeedback();
      m.roundBusy = false;
      void startRound();
    }, SKIP_REVEAL_MS);
  };

  const onImageLoad = (): void => {
    if (store.get(persistedAtom).mediaMode !== "photo") return;
    clearPendingMediaRetry();
    patchDisplay({
      showPlaceholder: false,
      showImage: true,
      guessDisabled: false,
    });
    schedulePhotoPrefetchPump();
  };

  const onImageError = (): void => {
    if (store.get(persistedAtom).mediaMode !== "photo") return;
    const m = getMutable();
    const actual = m.roundActual;
    const pair = store.get(persistedAtom).activePair;
    if (!actual) return;
    const taxonId = actual === "a" ? pair.idA : pair.idB;
    m.roundActual = null;
    m.pendingMediaRetry = { mode: "photo", actual, taxonId };
    patchDisplay({
      errorMsg: "Image failed to load. Trying another…",
      showPlaceholder: true,
      showImage: false,
    });
    window.setTimeout(() => void startRound(), 800);
  };

  const rebuildPresetRows = async (): Promise<void> => {
    const active = canonicalStatsPairKey(store.get(persistedAtom).activePair);
    const ids = [...new Set(PRESETS.flatMap((p) => [p.pair.idA, p.pair.idB]))];
    const fetched = await Promise.all(ids.map((id) => fetchTaxonById(id)));
    const byId = new Map<number, InatTaxon | null>();
    ids.forEach((id, i) => byId.set(id, fetched[i] ?? null));

    const rows: PresetRow[] = PRESETS.map((p) => {
      const ta = byId.get(p.pair.idA) ?? null;
      const tb = byId.get(p.pair.idB) ?? null;
      return {
        id: p.id,
        title: p.title,
        pair: p.pair,
        urlA: ta ? taxonSquareUrl(ta) : null,
        urlB: tb ? taxonSquareUrl(tb) : null,
        active: canonicalStatsPairKey(p.pair) === active,
      };
    });
    store.set(presetRowsAtom, rows);
  };

  const refreshPickerVisuals = async (): Promise<void> => {
    const pair = store.get(persistedAtom).activePair;
    const [ta, tb] = await Promise.all([fetchTaxonById(pair.idA), fetchTaxonById(pair.idB)]);
    const urlA = ta ? taxonSquareUrl(ta) : null;
    const urlB = tb ? taxonSquareUrl(tb) : null;
    store.set(patchPickerAtom, {
      bgA: urlA ? `url("${urlA}")` : undefined,
      bgB: urlB ? `url("${urlB}")` : undefined,
    });
  };

  return {
    startRound,
    applyGuess,
    skipBadPhoto,
    onImageLoad,
    onImageError,
    schedulePhotoPrefetchPump,
    invalidatePhotoPrefetchQueue,
    rebuildPresetRows,
    refreshPickerVisuals,
    disposeQuizAudioRound,
    destroyQuizAudioVisualizer,
    tryPlayQuizAudio,
  };
}
