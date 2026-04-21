import { useAtomValue } from "jotai/react";
import { pickerAtom } from "../quiz/atoms";

export function usePickerState() {
  return useAtomValue(pickerAtom);
}
