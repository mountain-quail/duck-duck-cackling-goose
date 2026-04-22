import { atom } from "jotai";

/** When true, the audio stage (visualizer + controls) is not shown. */
export const audioStageHiddenAtom = atom(true);

/** When true, show the "Tap to play" affordance (autoplay was blocked). */
export const showAudioTapPlayAtom = atom(false);
