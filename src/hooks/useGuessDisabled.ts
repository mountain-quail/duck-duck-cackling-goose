import { useAtomValue } from "jotai";
import { guessDisabledAtom } from "../quiz/atoms";

export function useGuessDisabled() {
  return useAtomValue(guessDisabledAtom);
}
