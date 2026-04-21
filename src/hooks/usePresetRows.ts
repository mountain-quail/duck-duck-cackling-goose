import { useAtomValue } from "jotai/react";
import { presetRowsAtom } from "../quiz/atoms";

export function usePresetRows() {
  return useAtomValue(presetRowsAtom);
}
