import { useAtomValue } from "jotai/react";
import { roundDisplayAtom } from "../quiz/atoms";

export function useRoundDisplay() {
  return useAtomValue(roundDisplayAtom);
}
