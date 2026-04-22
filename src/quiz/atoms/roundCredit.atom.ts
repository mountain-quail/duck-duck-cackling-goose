import { atom } from "jotai";
import { initialRoundCredit, type RoundCreditState } from "../viewTypes";

export const roundCreditAtom = atom<RoundCreditState>(initialRoundCredit());
