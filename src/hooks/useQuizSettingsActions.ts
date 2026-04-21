import { getDefaultStore } from "jotai";
import { useSetAtom } from "jotai/react";
import { useCallback } from "react";
import { patchModalAtom, persistedAtom } from "../quiz/atoms";
import { PRESETS } from "../quiz/config";
import { setActivePairInState, syncUrlToPair } from "../quiz/persist";
import type { MediaMode } from "../quiz/types";
import { useCommitPersisted } from "./useCommitPersisted";
import { useQuizGameContext } from "./useQuizGameContext";
import { useCloseSettings } from "./useCloseSettings";

export function useQuizSettingsActions() {
  const { engine } = useQuizGameContext();
  const commitPersisted = useCommitPersisted();
  const patchModal = useSetAtom(patchModalAtom);
  const closeSettings = useCloseSettings();

  const applyPresetById = useCallback(
    (presetId: string) => {
      const preset = PRESETS.find((p) => p.id === presetId);
      if (!preset) return;
      commitPersisted((p) => setActivePairInState(p, preset.pair));
      syncUrlToPair(preset.pair);
      void engine.rebuildPresetRows();
      void engine.refreshPickerVisuals();
      patchModal({ settingsOpen: false });
      void engine.startRound();
    },
    [commitPersisted, engine, patchModal]
  );

  const setMediaMode = useCallback(
    (mode: MediaMode) => {
      const cur = getDefaultStore().get(persistedAtom).mediaMode;
      if (cur === mode) return;
      commitPersisted((p) => ({ ...p, mediaMode: mode }));
      void engine.startRound();
    },
    [commitPersisted, engine]
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

  return { applyPresetById, setMediaMode, onPickTaxonSlot, closeSettings };
}
