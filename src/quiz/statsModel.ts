import { STATS_DEFAULT } from "./config";
import { canonicalStatsPairKey, shortTaxonLabel } from "./stats";
import type { PersistedState, StatsSnapshot } from "./types";
import type { StatsMatrixView } from "./viewTypes";

export function getCurrentStatsFromState(state: PersistedState): StatsSnapshot {
  const key = canonicalStatsPairKey(state.activePair);
  return state.statsByPairKey[key] ? { ...STATS_DEFAULT, ...state.statsByPairKey[key] } : { ...STATS_DEFAULT };
}

export function buildStatsMatrixView(pair: PersistedState["activePair"], s: StatsSnapshot): StatsMatrixView {
  const low = Math.min(pair.idA, pair.idB);
  const rowAIsLowTaxon = pair.idA === low;
  const rowBIsLowTaxon = pair.idB === low;
  return {
    colGuessA: shortTaxonLabel(pair.labelA),
    colGuessB: shortTaxonLabel(pair.labelB),
    rowWhenA: shortTaxonLabel(pair.labelA),
    rowWhenB: shortTaxonLabel(pair.labelB),
    whenAGuessA: String(rowAIsLowTaxon ? s.correctA : s.correctB),
    whenAGuessB: String(
      rowAIsLowTaxon ? Math.max(0, s.shownA - s.correctA) : Math.max(0, s.shownB - s.correctB)
    ),
    whenASkip: String(rowAIsLowTaxon ? s.skipWhenA : s.skipWhenB),
    whenBGuessB: String(rowBIsLowTaxon ? s.correctA : s.correctB),
    whenBGuessA: String(
      rowBIsLowTaxon ? Math.max(0, s.shownA - s.correctA) : Math.max(0, s.shownB - s.correctB)
    ),
    whenBSkip: String(rowBIsLowTaxon ? s.skipWhenA : s.skipWhenB),
  };
}
