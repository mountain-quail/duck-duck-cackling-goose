import { useQuizGameContext } from "./useQuizGameContext";

export function useGuessHandlers() {
  const { engine } = useQuizGameContext();
  return {
    onGuessA: () => engine.applyGuess("a"),
    onGuessB: () => engine.applyGuess("b"),
    onSkip: engine.skipBadPhoto,
    onAudioTapPlay: () => void engine.tryPlayQuizAudio(),
  };
}
