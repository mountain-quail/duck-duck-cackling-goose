import { atom } from "jotai";
import { initialRoundDisplay, type RoundDisplayState } from "../viewTypes";

export const roundDisplayAtom = atom<RoundDisplayState>(initialRoundDisplay());

export const patchRoundDisplayAtom = atom(null, (get, set, patch: Partial<RoundDisplayState>) => {
  set(roundDisplayAtom, { ...get(roundDisplayAtom), ...patch });
});
