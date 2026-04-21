import { atom } from "jotai";
import { loadPersisted, savePersisted } from "../persist";
import type { PersistedState } from "../types";

export const persistedAtom = atom<PersistedState>(loadPersisted());

/** Apply a pure updater, persist to localStorage, and commit to the store. */
export const commitPersistedAtom = atom(
  null,
  (get, set, fn: (p: PersistedState) => PersistedState) => {
    const next = fn(get(persistedAtom));
    savePersisted(next);
    set(persistedAtom, next);
  }
);
