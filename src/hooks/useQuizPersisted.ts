import { useAtomValue } from "jotai/react";
import { effectivePersistedAtom } from "../quiz/atoms";

export function useQuizPersisted() {
  return useAtomValue(effectivePersistedAtom);
}
