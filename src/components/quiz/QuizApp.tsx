import { useGameMode } from "../../hooks/useGameMode";
import { useRoundFeedback } from "../../hooks/useRoundFeedback";
import { AudioGame } from "./AudioGame";
import { PhotoGame } from "./PhotoGame";
import { QuizAreaFrame } from "./QuizAreaFrame";
import { QuizCreditBar } from "./QuizCreditBar";
import { QuizGameProvider } from "./QuizGameProvider";
import { QuizGuessActions } from "./QuizGuessActions";
import { QuizHeader } from "./QuizHeader";
import { QuizRoundFeedback } from "./QuizRoundFeedback";
import { SettingsModal } from "./SettingsModal";
import { StatsModal } from "./StatsModal";
import { TaxonSearchModal } from "./TaxonSearchModal";

function QuizAppContent() {
  const gameMode = useGameMode();
  const feedback = useRoundFeedback();

  return (
    <>
      <div className="app">
        <QuizHeader />
        <QuizAreaFrame>
          <div className="photo-area">
            <div className="image-wrap">
              {gameMode === "photo" && <PhotoGame />}
              {gameMode === "audio" && <AudioGame />}
              <QuizRoundFeedback feedback={feedback} />
            </div>
            <QuizCreditBar />
          </div>
          <QuizGuessActions />
        </QuizAreaFrame>
      </div>

      <StatsModal />
      <SettingsModal />
      <TaxonSearchModal />
    </>
  );
}

export function QuizApp() {
  return (
    <QuizGameProvider>
      <QuizAppContent />
    </QuizGameProvider>
  );
}
