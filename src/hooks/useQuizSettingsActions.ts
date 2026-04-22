import { useSetAtom } from "jotai/react";
import { useCallback } from "react";
import { applySettingsDraftAtom, getEffectivePersistedFromStore, patchModalAtom } from "../quiz/atoms";
import { PRESETS } from "../quiz/config";
import { applyPairInDraftState } from "../quiz/persist";
import type { MediaMode, TaxonPair } from "../quiz/types";
import { useQuizGameContext } from "./useQuizGameContext";
import { useCloseSettings } from "./useCloseSettings";

export function useQuizSettingsActions() {
  const { engine } = useQuizGameContext();
  const applySettingsDraft = useSetAtom(applySettingsDraftAtom);
  const patchModal = useSetAtom(patchModalAtom);
  const closeSettings = useCloseSettings();

  const applyTaxonPair = useCallback(
    (pair: TaxonPair) => {
      applySettingsDraft((d) => applyPairInDraftState(d, pair));
      void engine.rebuildPresetRows();
      void engine.refreshPickerVisuals();
      closeSettings();
      void engine.startRound();
    },
    [applySettingsDraft, closeSettings, engine]
  );

  const applyPresetById = useCallback(
    (presetId: string) => {
      const preset = PRESETS.find((p) => p.id === presetId);
      if (!preset) return;
      applyTaxonPair(preset.pair);
    },
    [applyTaxonPair]
  );

  const setMediaMode = useCallback(
    (mode: MediaMode) => {
      const cur = getEffectivePersistedFromStore().mediaMode;
      if (cur === mode) return;
      applySettingsDraft((p) => ({ ...p, mediaMode: mode }));
      void engine.startRound();
    },
    [applySettingsDraft, engine]
  );

  const onPickTaxonSlot = useCallback(
    (slot: "a" | "b") => {
      patchModal({
        taxonSearchSlot: slot,
        taxonSearchOpen: true,
        taxonSearchQuery: "",
        taxonSearchResults: [],
        taxonSearchHint: "",
      });
    },
    [patchModal]
  );

  return { applyTaxonPair, applyPresetById, setMediaMode, onPickTaxonSlot, closeSettings };
}
