import { useAtomValue } from "jotai/react";
import {
  currentStatsAtom,
  statCurrentStreakLabelAtom,
  statLongestStreakLabelAtom,
  statTotalPctLabelAtom,
  statsMatrixAtom,
} from "../quiz/atoms";

export function useQuizStats() {
  const stats = useAtomValue(currentStatsAtom);
  const statsMatrix = useAtomValue(statsMatrixAtom);
  const statTotalPct = useAtomValue(statTotalPctLabelAtom);
  const statCurrentStreak = useAtomValue(statCurrentStreakLabelAtom);
  const statLongestStreak = useAtomValue(statLongestStreakLabelAtom);
  return { stats, statsMatrix, statTotalPct, statCurrentStreak, statLongestStreak };
}
