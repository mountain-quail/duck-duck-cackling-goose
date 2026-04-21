import {
  INAT_BASE,
  INAT_DATE_FETCH_MAX_PAGES,
  INAT_DATE_FETCH_PER_PAGE,
  INAT_TAXA_BASE,
  OBS_RANDOM_WINDOW_MS,
} from "./config";
import type {
  InatObservation,
  InatObservationsResponse,
  InatTaxaResponse,
  InatTaxon,
} from "./types";

function buildSearchParams(overrides: Record<string, string>): URLSearchParams {
  return new URLSearchParams({
    photos: "true",
    quality_grade: "research",
    ...overrides,
  });
}

function buildSoundSearchParams(overrides: Record<string, string>): URLSearchParams {
  return new URLSearchParams({
    sounds: "true",
    quality_grade: "research",
    ...overrides,
  });
}

async function fetchInatJson(searchParams: URLSearchParams): Promise<InatObservationsResponse> {
  const url = `${INAT_BASE}?${searchParams}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const hint = res.status === 403 ? " (rate limits or blocking)" : "";
    throw new Error(`iNaturalist error ${res.status}${hint}`);
  }
  return res.json() as Promise<InatObservationsResponse>;
}

async function fetchTaxaJson(searchParams: URLSearchParams): Promise<InatTaxaResponse> {
  const url = `${INAT_TAXA_BASE}?${searchParams}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const hint = res.status === 403 ? " (rate limits or blocking)" : "";
    throw new Error(`iNaturalist taxa error ${res.status}${hint}`);
  }
  return res.json() as Promise<InatTaxaResponse>;
}

export function taxonDisplayLabel(t: InatTaxon): string {
  const c = t.preferred_common_name?.trim();
  if (c) return c;
  return t.name?.trim() || `Taxon ${t.id}`;
}

export function taxonSquareUrl(t: InatTaxon): string | null {
  const p = t.default_photo;
  const u = p?.square_url || p?.url;
  return u && u.length > 0 ? u : null;
}

export async function fetchTaxonById(id: number): Promise<InatTaxon | null> {
  try {
    const data = await fetchTaxaJson(new URLSearchParams({ id: String(id) }));
    const t = data.results?.[0];
    return t && t.id === id ? t : null;
  } catch {
    return null;
  }
}

export async function searchTaxaForPicker(query: string): Promise<InatTaxon[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const data = await fetchTaxaJson(
    new URLSearchParams({
      q,
      rank: "species",
      per_page: "25",
      order: "desc",
      order_by: "observations_count",
    })
  );
  const list = data.results ?? [];
  return list.filter(
    (t) =>
      t.is_active !== false &&
      typeof t.id === "number" &&
      (t.observations_count ?? 0) > 0 &&
      t.rank === "species"
  );
}

function photoToMediumUrl(url: string): string {
  if (!url) return "";
  return url.replace(/\/(square|thumb|small)\.(jpg|jpeg|png|webp)/i, "/medium.$2");
}

function isoDateUTC(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function observedAtMs(obs: InatObservation): number {
  const s = obs.time_observed_at || obs.observed_on;
  if (!s) return NaN;
  const ms = Date.parse(s);
  return Number.isFinite(ms) ? ms : NaN;
}

export async function fetchObservationForRandomCutoff(taxonId: number): Promise<{
  imageUrl: string;
  login: string;
  observation: InatObservation;
}> {
  const now = Date.now();
  const cutoff = new Date(now - Math.random() * OBS_RANDOM_WINDOW_MS);
  const windowStart = new Date(now - OBS_RANDOM_WINDOW_MS);
  let d1 = isoDateUTC(windowStart);
  let d2 = isoDateUTC(cutoff);
  if (d1 > d2) {
    const swap = d1;
    d1 = d2;
    d2 = swap;
  }
  const cutoffMs = cutoff.getTime();

  for (let page = 1; page <= INAT_DATE_FETCH_MAX_PAGES; page++) {
    const data = await fetchInatJson(
      buildSearchParams({
        taxon_id: String(taxonId),
        per_page: String(INAT_DATE_FETCH_PER_PAGE),
        page: String(page),
        d1,
        d2,
        order_by: "observed_on",
        order: "desc",
      })
    );
    const list = data.results ?? [];
    for (const obs of list) {
      if (!obs || obs.taxon?.id !== taxonId) continue;
      if (!Array.isArray(obs.photos) || obs.photos.length === 0) continue;
      const obsMs = observedAtMs(obs);
      if (!Number.isFinite(obsMs) || obsMs > cutoffMs) continue;
      const rawUrl = obs.photos[0]!.url;
      if (!rawUrl) continue;
      const imageUrl = photoToMediumUrl(rawUrl);
      const login = obs.user?.login ?? "unknown";
      return { imageUrl, login, observation: obs };
    }
    if (list.length < INAT_DATE_FETCH_PER_PAGE) break;
  }

  throw new Error("Could not load a photo for this species. Try again.");
}

export async function fetchObservationWithSoundForRandomCutoff(taxonId: number): Promise<{
  soundUrl: string;
  login: string;
  observation: InatObservation;
}> {
  const now = Date.now();
  const cutoff = new Date(now - Math.random() * OBS_RANDOM_WINDOW_MS);
  const windowStart = new Date(now - OBS_RANDOM_WINDOW_MS);
  let d1 = isoDateUTC(windowStart);
  let d2 = isoDateUTC(cutoff);
  if (d1 > d2) {
    const swap = d1;
    d1 = d2;
    d2 = swap;
  }
  const cutoffMs = cutoff.getTime();

  for (let page = 1; page <= INAT_DATE_FETCH_MAX_PAGES; page++) {
    const data = await fetchInatJson(
      buildSoundSearchParams({
        taxon_id: String(taxonId),
        per_page: String(INAT_DATE_FETCH_PER_PAGE),
        page: String(page),
        d1,
        d2,
        order_by: "observed_on",
        order: "desc",
      })
    );
    const list = data.results ?? [];
    for (const obs of list) {
      if (!obs || obs.taxon?.id !== taxonId) continue;
      if (!Array.isArray(obs.sounds) || obs.sounds.length === 0) continue;
      const rawSound = obs.sounds[0]!.file_url;
      if (!rawSound) continue;
      const obsMs = observedAtMs(obs);
      if (!Number.isFinite(obsMs) || obsMs > cutoffMs) continue;
      const login = obs.user?.login ?? "unknown";
      return { soundUrl: rawSound, login, observation: obs };
    }
    if (list.length < INAT_DATE_FETCH_PER_PAGE) break;
  }

  throw new Error("Could not load audio for this species. Try again.");
}

export async function preloadImageUrl(imageUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
}
