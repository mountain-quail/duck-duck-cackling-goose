import { useAtomValue } from "jotai";
import { showImageAtom } from "../quiz/atoms";

export function useShowImage() {
  return useAtomValue(showImageAtom);
}
