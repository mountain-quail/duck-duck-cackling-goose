import { getDefaultStore } from "jotai";
import { useCallback } from "react";
import { useSetAtom } from "jotai/react";
import { applySettingsDraftAtom, getEffectivePersistedFromStore, modalAtom } from "../quiz/atoms";
import { TAXON_SEARCH_DEBOUNCE_MS } from "../quiz/config";
import { searchTaxaForPicker, taxonDisplayLabel } from "../quiz/inat";
import { applyPairInDraftState } from "../quiz/persist";
import type { InatTaxon, TaxonPair } from "../quiz/types";
import { useCloseTaxonSearch } from "./useCloseTaxonSearch";
import { useQuizGameContext } from "./useQuizGameContext";
import { useQuizModal } from "./useQuizModal";

export function useTaxonSearch() {
  const { modal, patchModal, taxonSearchTitle } = useQuizModal();
  const { engine, taxonSearchDialogRef, roundMutableRef } = useQuizGameContext();
  const applySettingsDraft = useSetAtom(applySettingsDraftAtom);
  const closeTaxonSearch = useCloseTaxonSearch();

  const runTaxonSearchQuery = useCallback(
    async (q: string) => {
      patchModal({ taxonSearchHint: "", taxonSearchResults: [] });
      if (q.trim().length < 2) {
        patchModal({ taxonSearchHint: "Type at least 2 characters." });
        return;
      }
      try {
        const results = await searchTaxaForPicker(q);
        if (results.length === 0) {
          patchModal({ taxonSearchHint: "No species found with observations. Try another name." });
          return;
        }
        const mod = getDefaultStore().get(modalAtom);
        const slotLive = mod.taxonSearchSlot;
        if (!slotLive) return;
        const pair = getEffectivePersistedFromStore().activePair;
        const otherId = slotLive === "a" ? pair.idB : pair.idA;
        const filtered = results.filter((t) => t.id !== otherId);
        patchModal({ taxonSearchResults: filtered });
        if (filtered.length === 0 && results.length > 0) {
          patchModal({
            taxonSearchHint: "All matching species are already the other slot. Try a different search.",
          });
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Search failed.";
        patchModal({ taxonSearchHint: msg });
      }
    },
    [patchModal]
  );

  const scheduleTaxonSearch = useCallback(
    (q: string) => {
      const m = roundMutableRef.current;
      if (m.taxonSearchDebounceTimer !== null) clearTimeout(m.taxonSearchDebounceTimer);
      m.taxonSearchDebounceTimer = setTimeout(() => {
        m.taxonSearchDebounceTimer = null;
        void runTaxonSearchQuery(q);
      }, TAXON_SEARCH_DEBOUNCE_MS);
    },
    [roundMutableRef, runTaxonSearchQuery]
  );

  const setTaxonSearchQuery = useCallback(
    (q: string) => {
      patchModal({ taxonSearchQuery: q });
      scheduleTaxonSearch(q);
    },
    [patchModal, scheduleTaxonSearch]
  );

  const onPickTaxonSearchResult = useCallback(
    (t: InatTaxon) => {
      const store = getDefaultStore();
      const mod = store.get(modalAtom);
      const slot = mod.taxonSearchSlot;
      if (!slot) return;
      const pair = getEffectivePersistedFromStore().activePair;
      const otherId = slot === "a" ? pair.idB : pair.idA;
      if (t.id === otherId) {
        patchModal({ taxonSearchHint: "Pick a different species than the other slot." });
        return;
      }
      const label = taxonDisplayLabel(t);
      const next: TaxonPair =
        slot === "a"
          ? { idA: t.id, idB: pair.idB, labelA: label, labelB: pair.labelB }
          : { idA: pair.idA, idB: t.id, labelA: pair.labelA, labelB: label };

      applySettingsDraft((p) => applyPairInDraftState(p, next));
      void engine.rebuildPresetRows();
      void engine.refreshPickerVisuals();
      closeTaxonSearch();
      void engine.startRound();
    },
    [applySettingsDraft, closeTaxonSearch, engine, patchModal]
  );

  return {
    dialogRef: taxonSearchDialogRef,
    title: taxonSearchTitle,
    query: modal.taxonSearchQuery,
    setTaxonSearchQuery,
    hint: modal.taxonSearchHint,
    results: modal.taxonSearchResults,
    onPickTaxonSearchResult,
    closeTaxonSearch,
  };
}
