import { useGuessHandlers } from "../../hooks/useGuessHandlers";
import { useQuizGameContext } from "../../hooks/useQuizGameContext";
import { useRoundDisplay } from "../../hooks/useRoundDisplay";
import { QuizRoundFeedback } from "./QuizRoundFeedback";

export function AudioGame() {
  const d = useRoundDisplay();
  const { quizAudioRef, audioVisualizerWrapRef } = useQuizGameContext();
  const { onAudioTapPlay } = useGuessHandlers();

  return (
    <div className="image-wrap">
      <div className={`image-placeholder ${d.showPlaceholder ? "" : "hidden"}`}>
        <span className="spinner" aria-hidden="true" />
        <span className="placeholder-text">{d.placeholderText}</span>
      </div>
      <div
        className={`audio-stage ${d.audioStageHidden ? "hidden" : ""}`}
        aria-hidden={d.audioStageHidden ? "true" : "false"}
      >
        <div className="audio-visualizer-wrap" ref={audioVisualizerWrapRef} />
        <audio ref={quizAudioRef} className="quiz-audio" preload="auto" playsInline />
        <button
          type="button"
          className={`audio-tap-play ${d.showAudioTapPlay ? "" : "hidden"}`}
          onClick={onAudioTapPlay}
        >
          Tap to play sound
        </button>
      </div>
      <QuizRoundFeedback feedback={d.feedback} />
    </div>
  );
}
