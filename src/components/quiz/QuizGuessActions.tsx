import { useGameMode } from "../../hooks/useGameMode";
import { useGuessHandlers } from "../../hooks/useGuessHandlers";
import { useQuizPersisted } from "../../hooks/useQuizPersisted";
import { useRoundDisplay } from "../../hooks/useRoundDisplay";

export function QuizGuessActions() {
  const gameMode = useGameMode();
  const { activePair: pair } = useQuizPersisted();
  const d = useRoundDisplay();
  const { onGuessA, onGuessB, onSkip } = useGuessHandlers();

  const skipAria =
    gameMode === "photo"
      ? "Skip this photo without guessing"
      : "Skip this recording without guessing";

  return (
    <>
      <div className="actions">
        <button type="button" className="btn btn-cackling" disabled={d.guessDisabled} onClick={onGuessA}>
          {pair.labelA}
        </button>
        <button type="button" className="btn btn-canada" disabled={d.guessDisabled} onClick={onGuessB}>
          {pair.labelB}
        </button>
      </div>

      <div className="actions-skip">
        <button type="button" className="btn btn-skip" disabled={d.guessDisabled} aria-label={skipAria} onClick={onSkip}>
          What the heck is even that?
        </button>
      </div>

      <p className={`error ${d.errorMsg ? "" : "hidden"}`} role="alert">
        {d.errorMsg ?? ""}
      </p>
    </>
  );
}
