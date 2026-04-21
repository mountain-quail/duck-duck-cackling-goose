import { useSetAtom } from "jotai/react";
import { useCallback } from "react";
import { patchModalAtom } from "../quiz/atoms";
import { useQuizGameContext } from "./useQuizGameContext";

export function useOpenSettings() {
  const patchModal = useSetAtom(patchModalAtom);
  const { engine } = useQuizGameContext();

  return useCallback(() => {
    patchModal({ settingsOpen: true });
    void engine.refreshPickerVisuals();
  }, [engine, patchModal]);
}
