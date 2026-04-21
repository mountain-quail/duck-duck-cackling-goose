import { useSetAtom } from "jotai/react";
import { useCallback } from "react";
import { patchModalAtom } from "../quiz/atoms";

export function useStatsModal() {
  const patchModal = useSetAtom(patchModalAtom);
  const openStats = useCallback(() => patchModal({ statsOpen: true }), [patchModal]);
  const closeStats = useCallback(() => patchModal({ statsOpen: false }), [patchModal]);
  return { openStats, closeStats };
}
