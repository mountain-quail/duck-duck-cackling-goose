export type TaxonSlot = "a" | "b";

export type MediaMode = "photo" | "audio";

export interface TaxonPair {
  idA: number;
  idB: number;
  labelA: string;
  labelB: string;
  /** iNat square thumbnails; optional (e.g. built-in presets provide them, user pairs do not). */
  urlA?: string;
  urlB?: string;
}

export interface StatsSnapshot {
  totalAttempts: number;
  totalCorrect: number;
  currentStreak: number;
  longestStreak: number;
  shownA: number;
  correctA: number;
  shownB: number;
  correctB: number;
  skipWhenA: number;
  skipWhenB: number;
}

export interface PersistedState {
  activePair: TaxonPair;
  statsByPairKey: Record<string, StatsSnapshot>;
  mediaMode: MediaMode;
  /** Pairs the user has switched to, most recent first (see `setActivePairInState`). */
  recentPairs: TaxonPair[];
}

export interface InatPhoto {
  url?: string;
}

export interface InatSound {
  file_url?: string;
}

export interface InatObservation {
  taxon?: { id?: number };
  photos?: InatPhoto[];
  sounds?: InatSound[];
  user?: { login?: string };
  time_observed_at?: string;
  observed_on?: string;
}

export interface InatObservationsResponse {
  total_results?: number;
  results?: InatObservation[];
}

export interface InatTaxonDefaultPhoto {
  url?: string;
  square_url?: string;
}

export interface InatTaxon {
  id: number;
  name?: string;
  rank?: string;
  preferred_common_name?: string | null;
  default_photo?: InatTaxonDefaultPhoto | null;
  observations_count?: number;
  is_active?: boolean;
}

export interface InatTaxaResponse {
  results?: InatTaxon[];
  total_results?: number;
  page?: number;
}

export interface PrefetchedPhotoRound {
  pairKey: string;
  actual: TaxonSlot;
  imageUrl: string;
  login: string;
}
