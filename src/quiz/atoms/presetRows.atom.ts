import { atom } from "jotai";
import type { PresetRow } from "../viewTypes";

export const presetRowsAtom = atom<PresetRow[]>([]);
