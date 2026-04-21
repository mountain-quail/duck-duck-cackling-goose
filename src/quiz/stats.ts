import { STATS_DEFAULT } from "./config";
import type { StatsSnapshot, TaxonPair } from "./types";

export function canonicalStatsPairKey(pair: TaxonPair): string {
  return pair.idA < pair.idB ? `${pair.idA}-${pair.idB}` : `${pair.idB}-${pair.idA}`;
}

export function parseTaxonPairKey(key: string): { idFirst: number; idSecond: number } | null {
  const m = /^(\d+)-(\d+)$/.exec(key.trim());
  if (!m) return null;
  const idFirst = Number(m[1]);
  const idSecond = Number(m[2]);
  if (!Number.isFinite(idFirst) || !Number.isFinite(idSecond)) return null;
  return { idFirst, idSecond };
}

export function remapStatsSnapshotToCanonicalOrder(
  s: StatsSnapshot,
  idFirst: number,
  idSecond: number
): StatsSnapshot {
  const low = Math.min(idFirst, idSecond);
  if (idFirst === low) {
    return { ...s };
  }
  return {
    ...s,
    shownA: s.shownB,
    shownB: s.shownA,
    correctA: s.correctB,
    correctB: s.correctA,
    skipWhenA: s.skipWhenB,
    skipWhenB: s.skipWhenA,
  };
}

export function mergeStatsSnapshots(a: StatsSnapshot, b: StatsSnapshot): StatsSnapshot {
  return {
    totalAttempts: a.totalAttempts + b.totalAttempts,
    totalCorrect: a.totalCorrect + b.totalCorrect,
    currentStreak: Math.max(a.currentStreak, b.currentStreak),
    longestStreak: Math.max(a.longestStreak, b.longestStreak),
    shownA: a.shownA + b.shownA,
    correctA: a.correctA + b.correctA,
    shownB: a.shownB + b.shownB,
    correctB: a.correctB + b.correctB,
    skipWhenA: a.skipWhenA + b.skipWhenA,
    skipWhenB: a.skipWhenB + b.skipWhenB,
  };
}

export function normalizeStatsByPairKeyMap(raw: Record<string, StatsSnapshot>): Record<string, StatsSnapshot> {
  const out: Record<string, StatsSnapshot> = {};
  for (const [k, v] of Object.entries(raw)) {
    const ids = parseTaxonPairKey(k);
    if (!ids) continue;
    const canon = canonicalStatsPairKey({
      idA: ids.idFirst,
      idB: ids.idSecond,
      labelA: "",
      labelB: "",
    });
    const remapped = remapStatsSnapshotToCanonicalOrder({ ...STATS_DEFAULT, ...v }, ids.idFirst, ids.idSecond);
    out[canon] = out[canon] ? mergeStatsSnapshots(out[canon], remapped) : remapped;
  }
  return out;
}

export function clonePair(pair: TaxonPair): TaxonPair {
  return { ...pair };
}

export function pct(n: number, d: number): string {
  if (d === 0) return "—";
  return `${Math.round((100 * n) / d)}%`;
}

export function formatStreak(n: number): string {
  return String(n);
}

export function shortTaxonLabel(s: string): string {
  return s.length > 22 ? `${s.slice(0, 20)}…` : s;
}
