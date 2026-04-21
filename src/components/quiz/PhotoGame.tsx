import { useQuizGameContext } from "../../hooks/useQuizGameContext";
import { useRoundDisplay } from "../../hooks/useRoundDisplay";
import { QuizRoundFeedback } from "./QuizRoundFeedback";

export function PhotoGame() {
  const d = useRoundDisplay();
  const { engine } = useQuizGameContext();

  return (
    <div className="image-wrap">
      <div className={`image-placeholder ${d.showPlaceholder ? "" : "hidden"}`}>
        <span className="spinner" aria-hidden="true" />
        <span className="placeholder-text">{d.placeholderText}</span>
      </div>
      <img
        className={`goose-image ${d.showImage ? "" : "hidden"}`}
        src={d.imageSrc}
        alt={d.imageAlt}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={engine.onImageLoad}
        onError={engine.onImageError}
      />
      <QuizRoundFeedback feedback={d.feedback} />
    </div>
  );
}
