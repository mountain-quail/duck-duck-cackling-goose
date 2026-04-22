import { atom } from "jotai";
import { initialRoundPlaceholder, type RoundPlaceholderState } from "../viewTypes";

export const roundPlaceholderAtom = atom<RoundPlaceholderState>(initialRoundPlaceholder());
