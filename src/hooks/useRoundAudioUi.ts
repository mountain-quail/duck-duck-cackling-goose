import { useAtomValue } from "jotai";
import { audioStageHiddenAtom, showAudioTapPlayAtom } from "../quiz/atoms";

export function useRoundAudioUi() {
  return {
    audioStageHidden: useAtomValue(audioStageHiddenAtom),
    showAudioTapPlay: useAtomValue(showAudioTapPlayAtom),
  };
}
