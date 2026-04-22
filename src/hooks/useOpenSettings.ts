import { useSetAtom } from "jotai/react";
import { useCallback } from "react";
import { beginSettingsSessionAtom, patchModalAtom } from "../quiz/atoms";
import { useQuizGameContext } from "./useQuizGameContext";

export function useOpenSettings() {
  const patchModal = useSetAtom(patchModalAtom);
  const beginSettingsSession = useSetAtom(beginSettingsSessionAtom);
  const { engine } = useQuizGameContext();

  return useCallback(() => {
    beginSettingsSession();
    patchModal({ settingsOpen: true });
    void engine.refreshPickerVisuals();
  }, [beginSettingsSession, engine, patchModal]);
}
