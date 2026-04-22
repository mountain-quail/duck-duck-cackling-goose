import { useAtomValue } from "jotai";
import { roundFeedbackAtom } from "../quiz/atoms";

export function useRoundFeedback() {
  return useAtomValue(roundFeedbackAtom);
}
