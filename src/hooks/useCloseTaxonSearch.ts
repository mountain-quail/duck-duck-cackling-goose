import { useSetAtom } from "jotai/react";
import { useCallback } from "react";
import { patchModalAtom } from "../quiz/atoms";
import { useQuizGameContext } from "./useQuizGameContext";

export function useCloseTaxonSearch() {
  const patchModal = useSetAtom(patchModalAtom);
  const { roundMutableRef } = useQuizGameContext();

  return useCallback(() => {
    const t = roundMutableRef.current.taxonSearchDebounceTimer;
    if (t !== null) {
      clearTimeout(t);
      roundMutableRef.current.taxonSearchDebounceTimer = null;
    }
    patchModal({
      taxonSearchSlot: null,
      taxonSearchOpen: false,
      taxonSearchQuery: "",
      taxonSearchResults: [],
      taxonSearchHint: "",
    });
  }, [patchModal, roundMutableRef]);
}
