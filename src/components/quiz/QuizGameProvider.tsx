import { getDefaultStore } from "jotai";
import { useAtomValue, useSetAtom } from "jotai/react";
import { type ReactNode, useEffect, useMemo, useRef } from "react";
import { commitPersistedAtom, modalAtom, persistedAtom } from "../../quiz/atoms";
import { URL_PARAM_TAXON_A, URL_PARAM_TAXON_B } from "../../quiz/config";
import { fetchTaxonById, taxonDisplayLabel } from "../../quiz/inat";
import { readPositiveIntParam, setActivePairInState, syncUrlToPair } from "../../quiz/persist";
import { QuizGameContext, type QuizGameContextValue } from "../../quiz/QuizGameContext";
import { createRoundEngine } from "../../quiz/roundEngine";
import { createRoundMutable } from "../../quiz/roundMutable";
import type { TaxonPair } from "../../quiz/types";

export function QuizGameProvider({ children }: { children: ReactNode }) {
  const modal = useAtomValue(modalAtom);
  const commitPersisted = useSetAtom(commitPersistedAtom);

  const mutableRef = useRef(createRoundMutable());
  const quizAudioRef = useRef<HTMLAudioElement>(null);
  const audioVisualizerWrapRef = useRef<HTMLDivElement>(null);
  const taxonSearchDialogRef = useRef<HTMLDialogElement>(null);
  const statsDialogRef = useRef<HTMLDialogElement>(null);
  const settingsDialogRef = useRef<HTMLDialogElement>(null);

  const engineRef = useRef<ReturnType<typeof createRoundEngine> | null>(null);
  if (engineRef.current === null) {
    engineRef.current = createRoundEngine({
      getRefs: () => ({
        quizAudioRef,
        audioVisualizerWrapRef,
        taxonSearchDialogRef,
      }),
      getMutable: () => mutableRef.current,
    });
  }
  const engine = engineRef.current;

  const contextValue = useMemo<QuizGameContextValue>(
    () => ({
      engine,
      quizAudioRef,
      audioVisualizerWrapRef,
      statsDialogRef,
      settingsDialogRef,
      taxonSearchDialogRef,
      roundMutableRef: mutableRef,
    }),
    [engine]
  );

  useEffect(() => {
    engine.destroyQuizAudioVisualizer();
    return () => engine.destroyQuizAudioVisualizer();
  }, [engine]);

  useEffect(() => {
    const d = statsDialogRef.current;
    if (!d) return;
    if (modal.statsOpen) {
      if (!d.open) d.showModal();
    } else if (d.open) d.close();
  }, [modal.statsOpen]);

  useEffect(() => {
    const d = settingsDialogRef.current;
    if (!d) return;
    if (modal.settingsOpen) {
      if (!d.open) d.showModal();
    } else if (d.open) d.close();
  }, [modal.settingsOpen]);

  useEffect(() => {
    const d = taxonSearchDialogRef.current;
    if (!d) return;
    if (modal.taxonSearchOpen) {
      if (!d.open) d.showModal();
      window.setTimeout(() => {
        d.querySelector<HTMLInputElement>("#taxonSearchInput")?.focus();
      }, 0);
    } else if (d.open) d.close();
  }, [modal.taxonSearchOpen]);

  useEffect(() => {
    let cancelled = false;
    const m = mutableRef.current;

    void (async () => {
      try {
        localStorage.removeItem("ddcg_inat_jwt");
      } catch {
        /* ignore */
      }

      const params = new URLSearchParams(window.location.search);
      const idA = readPositiveIntParam(params, URL_PARAM_TAXON_A, "a");
      const idB = readPositiveIntParam(params, URL_PARAM_TAXON_B, "b");
      if (idA !== null && idB !== null && idA !== idB) {
        const [ta, tb] = await Promise.all([fetchTaxonById(idA), fetchTaxonById(idB)]);
        if (!cancelled && ta && tb && ta.id === idA && tb.id === idB) {
          const pair: TaxonPair = {
            idA,
            idB,
            labelA: taxonDisplayLabel(ta),
            labelB: taxonDisplayLabel(tb),
          };
          commitPersisted((p) => setActivePairInState(p, pair));
          syncUrlToPair(pair);
        }
      } else if (!cancelled) {
        syncUrlToPair(getDefaultStore().get(persistedAtom).activePair);
      }

      if (cancelled) return;
      void engine.rebuildPresetRows();
      void engine.refreshPickerVisuals();
      void engine.startRound();
      engine.schedulePhotoPrefetchPump();
    })();

    return () => {
      cancelled = true;
      m.startRoundEpoch++;
      engine.invalidatePhotoPrefetchQueue();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <QuizGameContext.Provider value={contextValue}>{children}</QuizGameContext.Provider>;
}
