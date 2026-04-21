import { useAtomValue } from "jotai/react";
import { gameModeAtom } from "../quiz/atoms";
import type { MediaMode } from "../quiz/types";

/** Active quiz stimulus: photo observations vs. audio recordings. */
export function useGameMode(): MediaMode {
  return useAtomValue(gameModeAtom);
}
