import { useAtomValue } from "jotai";
import { roundPlaceholderAtom } from "../quiz/atoms";

export function useRoundPlaceholder() {
  return useAtomValue(roundPlaceholderAtom);
}
