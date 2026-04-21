import { useSetAtom } from "jotai/react";
import { commitPersistedAtom } from "../quiz/atoms";

export function useCommitPersisted() {
  return useSetAtom(commitPersistedAtom);
}
