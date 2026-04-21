import { createContext, useContext, type MutableRefObject, type RefObject } from "react";
import type { RoundEngine } from "./roundEngine";
import type { RoundMutable } from "./roundMutable";

export interface QuizGameContextValue {
  engine: RoundEngine;
  quizAudioRef: RefObject<HTMLAudioElement | null>;
  audioVisualizerWrapRef: RefObject<HTMLDivElement | null>;
  statsDialogRef: RefObject<HTMLDialogElement | null>;
  settingsDialogRef: RefObject<HTMLDialogElement | null>;
  taxonSearchDialogRef: RefObject<HTMLDialogElement | null>;
  roundMutableRef: MutableRefObject<RoundMutable>;
}

const QuizGameContext = createContext<QuizGameContextValue | null>(null);

export function useQuizGameContextValue(): QuizGameContextValue {
  const v = useContext(QuizGameContext);
  if (v == null) {
    throw new Error("Quiz game context is missing. Wrap the tree in <QuizGameProvider>.");
  }
  return v;
}

export { QuizGameContext };
