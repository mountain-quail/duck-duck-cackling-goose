import { useErrorMessage } from "../../hooks/useErrorMessage";
import { useGameMode } from "../../hooks/useGameMode";
import { useGuessDisabled } from "../../hooks/useGuessDisabled";
import { useGuessHandlers } from "../../hooks/useGuessHandlers";
import { useQuizPersisted } from "../../hooks/useQuizPersisted";

export function QuizGuessActions() {
  const gameMode = useGameMode();
  const { activePair: pair } = useQuizPersisted();
  const guessDisabled = useGuessDisabled();
  const errorMessage = useErrorMessage();
  const { onGuessA, onGuessB, onSkip } = useGuessHandlers();

  const skipAria =
    gameMode === "photo"
      ? "Skip this photo without guessing"
      : "Skip this recording without guessing";

  return (
    <>
      <div className="actions">
        <button type="button" className="btn btn-cackling" disabled={guessDisabled} onClick={onGuessA}>
          {pair.labelA}
        </button>
        <button type="button" className="btn btn-canada" disabled={guessDisabled} onClick={onGuessB}>
          {pair.labelB}
        </button>
      </div>

      <div className="actions-skip">
        <button type="button" className="btn btn-skip" disabled={guessDisabled} aria-label={skipAria} onClick={onSkip}>
          What the heck is even that?
        </button>
      </div>

      <p className={`error ${errorMessage ? "" : "hidden"}`} role="alert">
        {errorMessage ?? ""}
      </p>
    </>
  );
}
