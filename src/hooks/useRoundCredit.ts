import { useAtomValue } from "jotai";
import { roundCreditAtom } from "../quiz/atoms";

export function useRoundCredit() {
  return useAtomValue(roundCreditAtom);
}
