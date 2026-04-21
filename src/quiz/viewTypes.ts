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

export interface RoundDisplayState {
  showPlaceholder: boolean;
  placeholderText: string;
  showImage: boolean;
  imageSrc: string | undefined;
  imageAlt: string;
  creditLogin: string | null;
  creditKind: "photo" | "audio" | null;
  feedback: { kind: "correct" | "wrong" | "skip"; text: string } | null;
  errorMsg: string | null;
  audioStageHidden: boolean;
  showAudioTapPlay: boolean;
  guessDisabled: boolean;
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

export const initialRoundDisplay = (): RoundDisplayState => ({
  showPlaceholder: true,
  placeholderText: "Loading photo…",
  showImage: false,
  imageSrc: undefined,
  imageAlt: "",
  creditLogin: null,
  creditKind: null,
  feedback: null,
  errorMsg: null,
  audioStageHidden: true,
  showAudioTapPlay: false,
  guessDisabled: true,
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

  showPlaceholder: boolean;
  placeholderText: string;
  showImage: boolean;
  imageSrc: string | undefined;
  imageAlt: string;
  onImageLoad: () => void;
  onImageError: () => void;

  creditLogin: string | null;
  creditKind: "photo" | "audio" | null;

  feedback: RoundDisplayState["feedback"];

  audioStageHidden: boolean;
  audioVisualizerWrapRef: RefObject<HTMLDivElement | null>;
  quizAudioRef: RefObject<HTMLAudioElement | null>;
  showAudioTapPlay: boolean;
  onAudioTapPlay: () => void;

  guessDisabled: boolean;
  onGuessA: () => void;
  onGuessB: () => void;
  onSkip: () => void;

  errorMsg: string | null;

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
