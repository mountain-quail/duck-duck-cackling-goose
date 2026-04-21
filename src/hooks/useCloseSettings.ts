import { useSetAtom } from "jotai/react";
import { useCallback } from "react";
import { patchModalAtom } from "../quiz/atoms";
import { useCloseTaxonSearch } from "./useCloseTaxonSearch";
import { useQuizGameContext } from "./useQuizGameContext";

export function useCloseSettings() {
  const patchModal = useSetAtom(patchModalAtom);
  const { taxonSearchDialogRef } = useQuizGameContext();
  const closeTaxonSearch = useCloseTaxonSearch();

  return useCallback(() => {
    if (taxonSearchDialogRef.current?.open) closeTaxonSearch();
    patchModal({ settingsOpen: false });
  }, [closeTaxonSearch, patchModal, taxonSearchDialogRef]);
}
