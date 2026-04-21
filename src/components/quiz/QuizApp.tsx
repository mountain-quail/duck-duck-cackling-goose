import { useGameMode } from "../../hooks/useGameMode";
import { AudioGame } from "./AudioGame";
import { PhotoGame } from "./PhotoGame";
import { QuizAreaFrame } from "./QuizAreaFrame";
import { QuizCreditBar } from "./QuizCreditBar";
import { QuizGameProvider } from "./QuizGameProvider";
import { QuizGuessActions } from "./QuizGuessActions";
import { QuizHeader } from "./QuizHeader";
import { SettingsModal } from "./SettingsModal";
import { StatsModal } from "./StatsModal";
import { TaxonSearchModal } from "./TaxonSearchModal";

function QuizAppContent() {
  const gameMode = useGameMode();

  return (
    <>
      <div className="app">
        <QuizHeader />
        <QuizAreaFrame>
          <div className="photo-area">
            {gameMode === "photo" && <PhotoGame />}
            {gameMode === "audio" && <AudioGame />}
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
