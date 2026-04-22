import { useGuessHandlers } from "../../hooks/useGuessHandlers";
import { useGameMode } from "../../hooks/useGameMode";
import { useQuizGameContext } from "../../hooks/useQuizGameContext";
import { useRoundAudioUi } from "../../hooks/useRoundAudioUi";
import { useRoundPlaceholder } from "../../hooks/useRoundPlaceholder";

export function AudioGame() {
  const gameMode = useGameMode();
  const ph = useRoundPlaceholder();
  const { audioStageHidden, showAudioTapPlay } = useRoundAudioUi();
  const { quizAudioRef, audioVisualizerWrapRef } = useQuizGameContext();
  const { onAudioTapPlay } = useGuessHandlers();

  if (gameMode !== "audio") return null;

  return (
    <>
    <div className={`image-placeholder ${ph.showPlaceholder ? "" : "hidden"}`}>
      <span className="spinner" aria-hidden="true" />
      <span className="placeholder-text">{ph.showPlaceholder ? ph.placeholderText : ""}</span>
    </div>
    <div
      className={`audio-stage ${audioStageHidden ? "hidden" : ""}`}
      aria-hidden={audioStageHidden ? "true" : "false"}
    >
      <div className="audio-visualizer-wrap" ref={audioVisualizerWrapRef} />
      <audio ref={quizAudioRef} className="quiz-audio" preload="auto" playsInline />
      <button
        type="button"
        className={`audio-tap-play ${showAudioTapPlay ? "" : "hidden"}`}
        onClick={onAudioTapPlay}
      >
        Tap to play sound
      </button>
    </div>
    </>
  );
}
