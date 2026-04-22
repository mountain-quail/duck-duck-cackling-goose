import {
  DEFAULT_PAIR,
  LEGACY_STATS_COOKIE,
  STATS_DEFAULT,
  STORAGE_KEY,
  URL_PARAM_TAXON_A,
  URL_PARAM_TAXON_B,
  isMediaMode,
} from "./config";
import {
  canonicalStatsPairKey,
  clonePair,
  normalizeStatsByPairKeyMap,
  remapStatsSnapshotToCanonicalOrder,
} from "./stats";
import type { PersistedState, StatsSnapshot, TaxonPair } from "./types";

function isValidTaxonPair(p: unknown): p is TaxonPair {
  return (
    p !== null &&
    typeof p === "object" &&
    typeof (p as TaxonPair).idA === "number" &&
    typeof (p as TaxonPair).idB === "number" &&
    typeof (p as TaxonPair).labelA === "string" &&
    typeof (p as TaxonPair).labelB === "string"
  );
}

function normalizeRecentPairs(raw: unknown): TaxonPair[] {
  if (!Array.isArray(raw)) return [];
  const out: TaxonPair[] = [];
  for (const item of raw) {
    if (isValidTaxonPair(item)) out.push(clonePair(item));
  }
  return out.slice(0, 20);
}

interface LegacyStatsPartial {
  totalAttempts?: number;
  totalCorrect?: number;
  currentStreak?: number;
  longestStreak?: number;
  canadaShown?: number;
  canadaCorrect?: number;
  cacklingShown?: number;
  cacklingCorrect?: number;
}

function readCookie(name: string): string | null {
  const prefix = `${name}=`;
  const parts = document.cookie.split(";").map((c) => c.trim());
  for (const part of parts) {
    if (part.startsWith(prefix)) {
      return decodeURIComponent(part.slice(prefix.length));
    }
  }
  return null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number): void {
  const safe = encodeURIComponent(value);
  document.cookie = `${name}=${safe}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

function clearLegacyStatsCookie(): void {
  writeCookie(LEGACY_STATS_COOKIE, "", 0);
}

function migrateLegacyCookie(): StatsSnapshot | null {
  const raw = readCookie(LEGACY_STATS_COOKIE);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as LegacyStatsPartial;
    const s: StatsSnapshot = { ...STATS_DEFAULT };
    if (typeof parsed.totalAttempts === "number") s.totalAttempts = parsed.totalAttempts;
    if (typeof parsed.totalCorrect === "number") s.totalCorrect = parsed.totalCorrect;
    if (typeof parsed.currentStreak === "number") s.currentStreak = parsed.currentStreak;
    if (typeof parsed.longestStreak === "number") s.longestStreak = parsed.longestStreak;
    if (typeof parsed.cacklingShown === "number") s.shownA = parsed.cacklingShown;
    if (typeof parsed.cacklingCorrect === "number") s.correctA = parsed.cacklingCorrect;
    if (typeof parsed.canadaShown === "number") s.shownB = parsed.canadaShown;
    if (typeof parsed.canadaCorrect === "number") s.correctB = parsed.canadaCorrect;
    clearLegacyStatsCookie();
    return s;
  } catch {
    return null;
  }
}

export function loadPersisted(): PersistedState {
  const migrated = migrateLegacyCookie();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      const activePair =
        parsed.activePair &&
        typeof parsed.activePair.idA === "number" &&
        typeof parsed.activePair.idB === "number" &&
        typeof parsed.activePair.labelA === "string" &&
        typeof parsed.activePair.labelB === "string"
          ? clonePair(parsed.activePair)
          : clonePair(DEFAULT_PAIR);
      const rawStats: Record<string, StatsSnapshot> = {};
      if (parsed.statsByPairKey && typeof parsed.statsByPairKey === "object") {
        for (const [k, v] of Object.entries(parsed.statsByPairKey)) {
          if (v && typeof v === "object") rawStats[k] = { ...STATS_DEFAULT, ...v };
        }
      }
      const statsByPairKey = normalizeStatsByPairKeyMap(rawStats);
      const key = canonicalStatsPairKey(activePair);
      if (migrated && !statsByPairKey[key]) {
        statsByPairKey[key] = remapStatsSnapshotToCanonicalOrder(migrated, DEFAULT_PAIR.idA, DEFAULT_PAIR.idB);
      } else if (migrated && statsByPairKey[key]) {
        const cur = statsByPairKey[key]!;
        if (cur.totalAttempts === 0 && migrated.totalAttempts > 0) {
          statsByPairKey[key] = remapStatsSnapshotToCanonicalOrder(migrated, DEFAULT_PAIR.idA, DEFAULT_PAIR.idB);
        }
      }
      const mediaMode = isMediaMode(parsed.mediaMode) && parsed.mediaMode === "audio" ? "audio" : "photo";
      const recentPairs = normalizeRecentPairs(parsed.recentPairs);
      return { activePair, statsByPairKey, mediaMode, recentPairs };
    }
  } catch {
    /* ignore */
  }

  const statsByPairKey: Record<string, StatsSnapshot> = {};
  if (migrated) {
    statsByPairKey[canonicalStatsPairKey(DEFAULT_PAIR)] = remapStatsSnapshotToCanonicalOrder(
      migrated,
      DEFAULT_PAIR.idA,
      DEFAULT_PAIR.idB
    );
  }
  return { activePair: clonePair(DEFAULT_PAIR), statsByPairKey, mediaMode: "photo", recentPairs: [] };
}

export function savePersisted(state: PersistedState): void {
  const normalized: PersistedState = {
    ...state,
    statsByPairKey: normalizeStatsByPairKeyMap(state.statsByPairKey),
    recentPairs: state.recentPairs ?? [],
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    /* ignore */
  }
}

export function readPositiveIntParam(params: URLSearchParams, ...keys: string[]): number | null {
  for (const key of keys) {
    const raw = params.get(key);
    if (raw == null || raw === "") continue;
    const n = Number.parseInt(raw, 10);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

export function syncUrlToPair(pair: TaxonPair): void {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set(URL_PARAM_TAXON_A, String(pair.idA));
    url.searchParams.set(URL_PARAM_TAXON_B, String(pair.idB));
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  } catch {
    /* ignore */
  }
}

export function setActivePairInState(state: PersistedState, pair: TaxonPair): PersistedState {
  const nextPair = clonePair(pair);
  const k = canonicalStatsPairKey(nextPair);
  const statsByPairKey = { ...state.statsByPairKey };
  if (!statsByPairKey[k]) {
    statsByPairKey[k] = { ...STATS_DEFAULT };
  }

  const prevKey = canonicalStatsPairKey(state.activePair);
  let recentPairs = state.recentPairs ?? [];
  if (prevKey !== k) {
    recentPairs = recentPairs.filter((p) => canonicalStatsPairKey(p) !== k);
    recentPairs = [clonePair(nextPair), ...recentPairs].slice(0, 20);
  }

  return { ...state, activePair: nextPair, statsByPairKey, recentPairs };
}

export function clonePersistedState(state: PersistedState): PersistedState {
  const statsByPairKey: Record<string, StatsSnapshot> = {};
  for (const [k, v] of Object.entries(state.statsByPairKey)) {
    statsByPairKey[k] = { ...STATS_DEFAULT, ...v };
  }
  return {
    activePair: clonePair(state.activePair),
    statsByPairKey,
    mediaMode: state.mediaMode,
    recentPairs: (state.recentPairs ?? []).map((p) => clonePair(p)),
  };
}

/** While settings is open: change the working pair and stats key without mutating the recent list (recents are applied on close). */
export function applyPairInDraftState(state: PersistedState, pair: TaxonPair): PersistedState {
  const nextPair = clonePair(pair);
  const k = canonicalStatsPairKey(nextPair);
  const statsByPairKey = { ...state.statsByPairKey };
  if (!statsByPairKey[k]) {
    statsByPairKey[k] = { ...STATS_DEFAULT };
  }
  return { ...state, activePair: nextPair, statsByPairKey };
}

export function mergeSessionStats(
  committed: PersistedState,
  draft: PersistedState
): Record<string, StatsSnapshot> {
  const keys = new Set([
    ...Object.keys(committed.statsByPairKey),
    ...Object.keys(draft.statsByPairKey),
  ]);
  const out: Record<string, StatsSnapshot> = {};
  for (const k of keys) {
    out[k] = { ...STATS_DEFAULT, ...committed.statsByPairKey[k], ...draft.statsByPairKey[k] };
  }
  return out;
}
