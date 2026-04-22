import type { RefObject } from "react";
import type { InatTaxon, MediaMode, StatsSnapshot, TaxonPair, TaxonSlot } from "./types";

export interface PresetRow {
  id: string;
  title: string;
  pair: TaxonPair;
  urlA: string | null;
  urlB: string | null;
  active: boolean;
}

export interface StatsMatrixView {
  colGuessA: string;
  colGuessB: string;
  rowWhenA: string;
  rowWhenB: string;
  whenAGuessA: string;
  whenAGuessB: string;
  whenASkip: string;
  whenBGuessA: string;
  whenBGuessB: string;
  whenBSkip: string;
}

export type RoundFeedback = { kind: "correct" | "wrong" | "skip"; text: string } | null;

/** iNat observation credit for the current round (separate from round display atom). */
export interface RoundCreditState {
  creditLogin: string | null;
  creditKind: "photo" | "audio" | null;
}

/** Loading line + spinner (photo and audio). See `roundPlaceholderAtom`. */
export type RoundPlaceholderState =
  | { showPlaceholder: false }
  | { showPlaceholder: true; placeholderText: string };

/** Current quiz image URL and alt (photo mode). See `displayImageAtom`. */
export interface DisplayImageState {
  imageSrc: string | undefined;
  imageAlt: string;
}

export interface ModalState {
  statsOpen: boolean;
  settingsOpen: boolean;
  taxonSearchOpen: boolean;
  taxonSearchSlot: TaxonSlot | null;
  taxonSearchQuery: string;
  taxonSearchHint: string;
  taxonSearchResults: InatTaxon[];
}

export interface PickerState {
  bgA: string | undefined;
  bgB: string | undefined;
}

export const initialRoundCredit = (): RoundCreditState => ({
  creditLogin: null,
  creditKind: null,
});

export const initialRoundPlaceholder = (): RoundPlaceholderState => ({
  showPlaceholder: true,
  placeholderText: "Loading photo…",
});

export const initialDisplayImage = (): DisplayImageState => ({
  imageSrc: undefined,
  imageAlt: "",
});

export const initialModalState = (): ModalState => ({
  statsOpen: false,
  settingsOpen: false,
  taxonSearchOpen: false,
  taxonSearchSlot: null,
  taxonSearchQuery: "",
  taxonSearchHint: "",
  taxonSearchResults: [],
});

export const initialPickerState = (): PickerState => ({
  bgA: undefined,
  bgB: undefined,
});

export interface QuizDomRefs {
  quizAudioRef: RefObject<HTMLAudioElement | null>;
  audioVisualizerWrapRef: RefObject<HTMLDivElement | null>;
  taxonSearchDialogRef: RefObject<HTMLDialogElement | null>;
}

export interface UseQuizGameResult {
  pair: TaxonPair;
  mediaMode: MediaMode;
  stats: StatsSnapshot;
  statsMatrix: StatsMatrixView;
  statCurrentStreak: string;
  statLongestStreak: string;
  statTotalPct: string;

  onImageLoad: () => void;
  onImageError: () => void;

  audioVisualizerWrapRef: RefObject<HTMLDivElement | null>;
  quizAudioRef: RefObject<HTMLAudioElement | null>;
  onAudioTapPlay: () => void;

  onGuessA: () => void;
  onGuessB: () => void;
  onSkip: () => void;

  statsOpen: boolean;
  openStats: () => void;
  closeStats: () => void;
  statsDialogRef: RefObject<HTMLDialogElement | null>;

  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  settingsDialogRef: RefObject<HTMLDialogElement | null>;

  taxonSearchOpen: boolean;
  taxonSearchTitle: string;
  taxonSearchQuery: string;
  setTaxonSearchQuery: (q: string) => void;
  taxonSearchHint: string;
  taxonSearchResults: InatTaxon[];
  onPickTaxonSearchResult: (t: InatTaxon) => void;
  closeTaxonSearch: () => void;
  taxonSearchDialogRef: RefObject<HTMLDialogElement | null>;

  onPickTaxonSlot: (slot: TaxonSlot) => void;
  pickerLabelA: string;
  pickerLabelB: string;
  pickerAriaA: string;
  pickerAriaB: string;
  pickerBgA: string | undefined;
  pickerBgB: string | undefined;

  setMediaPhoto: () => void;
  setMediaAudio: () => void;

  presetRows: PresetRow[];
  onSelectPreset: (presetId: string) => void;
}
