import { atom } from "jotai";
import { formatStreak, pct } from "../stats";
import { buildStatsMatrixView, getCurrentStatsFromState } from "../statsModel";
import { modalAtom } from "./modal.atom";
import { persistedAtom } from "./persisted.atom";
import type { MediaMode } from "../types";

export const gameModeAtom = atom((get): MediaMode => get(persistedAtom).mediaMode);

export const currentStatsAtom = atom((get) => getCurrentStatsFromState(get(persistedAtom)));

export const statsMatrixAtom = atom((get) => {
  const p = get(persistedAtom);
  const s = get(currentStatsAtom);
  return buildStatsMatrixView(p.activePair, s);
});

export const taxonSearchTitleAtom = atom((get) => {
  const { activePair } = get(persistedAtom);
  const slot = get(modalAtom).taxonSearchSlot;
  if (slot === "a") return `Replace: ${activePair.labelA}`;
  if (slot === "b") return `Replace: ${activePair.labelB}`;
  return "Replace species";
});

export const statCurrentStreakLabelAtom = atom((get) => formatStreak(get(currentStatsAtom).currentStreak));

export const statLongestStreakLabelAtom = atom((get) => formatStreak(get(currentStatsAtom).longestStreak));

export const statTotalPctLabelAtom = atom((get) =>
  pct(get(currentStatsAtom).totalCorrect, get(currentStatsAtom).totalAttempts)
);
