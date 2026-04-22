import { atom, getDefaultStore } from "jotai";
import {
  clonePersistedState,
  loadPersisted,
  mergeSessionStats,
  savePersisted,
  setActivePairInState,
  syncUrlToPair,
} from "../persist";
import type { PersistedState } from "../types";

export const persistedAtom = atom<PersistedState>(loadPersisted());

/** Full copy of `persistedAtom` while the settings session is open; `null` when not editing settings. */
export const settingsDraftAtom = atom<PersistedState | null>(null);

export const effectivePersistedAtom = atom((get): PersistedState => {
  const d = get(settingsDraftAtom);
  if (d !== null) return d;
  return get(persistedAtom);
});

export function getEffectivePersistedFromStore(): PersistedState {
  const store = getDefaultStore();
  const d = store.get(settingsDraftAtom);
  if (d !== null) return d;
  return store.get(persistedAtom);
}

/** Call when opening the settings dialog (before or with `settingsOpen: true`). */
export const beginSettingsSessionAtom = atom(null, (get, set) => {
  set(settingsDraftAtom, clonePersistedState(get(persistedAtom)));
});

export const applySettingsDraftAtom = atom(
  null,
  (get, set, fn: (p: PersistedState) => PersistedState) => {
    const d = get(settingsDraftAtom);
    if (d === null) return;
    set(settingsDraftAtom, fn(d));
  }
);

/** When a settings draft is active, updates the draft in memory. Otherwise commits to `persistedAtom` and localStorage. */
export const commitOrDraftPersistedAtom = atom(
  null,
  (get, set, fn: (p: PersistedState) => PersistedState) => {
    if (get(settingsDraftAtom) !== null) {
      set(settingsDraftAtom, fn(get(settingsDraftAtom)!));
    } else {
      const next = fn(get(persistedAtom));
      savePersisted(next);
      set(persistedAtom, next);
    }
  }
);

/** Apply draft to committed state, save, clear draft, update URL. No-op if there is no draft. */
export function commitSettingsDraftToPersistedAndStorage(): void {
  const store = getDefaultStore();
  const draft = store.get(settingsDraftAtom);
  if (draft === null) return;
  const committed = store.get(persistedAtom);
  const withRecents = setActivePairInState(committed, draft.activePair);
  const statsByPairKey = mergeSessionStats(committed, draft);
  const final: PersistedState = {
    ...withRecents,
    mediaMode: draft.mediaMode,
    statsByPairKey,
  };
  savePersisted(final);
  store.set(persistedAtom, final);
  store.set(settingsDraftAtom, null);
  syncUrlToPair(final.activePair);
}

/** Apply a pure updater, persist to localStorage, and commit to the store. */
export const commitPersistedAtom = atom(
  null,
  (get, set, fn: (p: PersistedState) => PersistedState) => {
    const next = fn(get(persistedAtom));
    savePersisted(next);
    set(persistedAtom, next);
  }
);
