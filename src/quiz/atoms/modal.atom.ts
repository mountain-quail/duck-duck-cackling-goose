import { atom } from "jotai";
import { initialModalState, type ModalState } from "../viewTypes";

export const modalAtom = atom<ModalState>(initialModalState());

export const patchModalAtom = atom(null, (get, set, patch: Partial<ModalState>) => {
  set(modalAtom, { ...get(modalAtom), ...patch });
});
