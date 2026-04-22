import { useAtomValue } from "jotai";
import { errorMessageAtom } from "../quiz/atoms";

export function useErrorMessage() {
  return useAtomValue(errorMessageAtom);
}
