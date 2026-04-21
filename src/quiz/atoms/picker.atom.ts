import { atom } from "jotai";
import { initialPickerState, type PickerState } from "../viewTypes";

export const pickerAtom = atom<PickerState>(initialPickerState());

export const patchPickerAtom = atom(null, (get, set, patch: Partial<PickerState>) => {
  set(pickerAtom, { ...get(pickerAtom), ...patch });
});
