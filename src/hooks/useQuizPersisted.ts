import { useAtomValue } from "jotai/react";
import { persistedAtom } from "../quiz/atoms";

export function useQuizPersisted() {
  return useAtomValue(persistedAtom);
}
