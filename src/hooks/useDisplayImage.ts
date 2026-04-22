import { useAtomValue } from "jotai";
import { displayImageAtom } from "../quiz/atoms";

export function useDisplayImage() {
  return useAtomValue(displayImageAtom);
}
