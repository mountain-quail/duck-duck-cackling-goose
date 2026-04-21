import { useAtomValue, useSetAtom } from "jotai/react";
import { modalAtom, patchModalAtom, taxonSearchTitleAtom } from "../quiz/atoms";

export function useQuizModal() {
  const modal = useAtomValue(modalAtom);
  const patchModal = useSetAtom(patchModalAtom);
  const taxonSearchTitle = useAtomValue(taxonSearchTitleAtom);
  return { modal, patchModal, taxonSearchTitle };
}
