import type { MediaMode, StatsSnapshot, TaxonPair } from "./types";

export const INAT_BASE = "https://api.inaturalist.org/v1/observations";
export const INAT_TAXA_BASE = "https://api.inaturalist.org/v1/taxa";
export const TAXON_SEARCH_DEBOUNCE_MS = 320;
export const OBS_RANDOM_WINDOW_MS = 365 * 24 * 60 * 60 * 1000;
export const INAT_DATE_FETCH_PER_PAGE = 50;
export const INAT_DATE_FETCH_MAX_PAGES = 5;

export const STORAGE_KEY = "ddcg_v2";
export const LEGACY_STATS_COOKIE = "ddcg_stats";
export const FEEDBACK_MS = 450;
export const SKIP_REVEAL_MS = 1000;
export const PHOTO_PREFETCH_QUEUE_MAX = 3;
export const PHOTO_PREFETCH_RETRY_MS = 400;

export const URL_PARAM_TAXON_A = "taxonA";
export const URL_PARAM_TAXON_B = "taxonB";

export const STATS_DEFAULT: StatsSnapshot = {
  totalAttempts: 0,
  totalCorrect: 0,
  currentStreak: 0,
  longestStreak: 0,
  shownA: 0,
  correctA: 0,
  shownB: 0,
  correctB: 0,
  skipWhenA: 0,
  skipWhenB: 0,
};

export const PRESETS: ReadonlyArray<{ id: string; title: string; pair: TaxonPair }> = [
  {
    id: "geese",
    title: "Cackling Goose / Canada Goose",
    pair: {
      idA: 59220,
      idB: 7089,
      labelA: "Cackling Goose",
      labelB: "Canada Goose",
    },
  },
  {
    id: "finches",
    title: "Purple Finch / House Finch",
    pair: {
      idA: 199841,
      idB: 199840,
      labelA: "Purple Finch",
      labelB: "House Finch",
    },
  },
  {
    id: "swallows",
    title: "Violet-green Swallow / Tree Swallow",
    pair: {
      idA: 11931,
      idB: 11935,
      labelA: "Violet-green Swallow",
      labelB: "Tree Swallow",
    },
  },
];

export const DEFAULT_PAIR = PRESETS[0]!.pair;

export function isMediaMode(v: unknown): v is MediaMode {
  return v === "audio" || v === "photo";
}
