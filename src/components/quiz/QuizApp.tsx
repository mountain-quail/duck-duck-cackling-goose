import styled from "styled-components";
import { useGameMode } from "../../hooks/useGameMode";
import { useRoundFeedback } from "../../hooks/useRoundFeedback";
import { useRoundPlaceholder } from "../../hooks/useRoundPlaceholder";
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

const AppWrap = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 1.25rem 0 2rem;

  @media (min-width: 640px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const PhotoArea = styled.div`
  width: 100%;

  @media (min-width: 640px) {
    background: var(--surface);
    border-radius: calc(var(--radius) + 4px);
    padding: 0.75rem;
    box-shadow: 0 8px 32px var(--shadow-medium);
  }
`;

const ImageWrap = styled.div<{ $showingPlaceholder?: boolean }>`
  position: relative;
  border-radius: 0;
  overflow: hidden;
  background: var(--bg);

  @media (max-width: 639px) {
    ${({ $showingPlaceholder }) => $showingPlaceholder && `min-height: min(52vh, 420px);`}
  }

  @media (min-width: 640px) {
    border-radius: var(--radius);
    aspect-ratio: 4 / 3;
  }
`;

function QuizAppContent() {
  const gameMode = useGameMode();
  const feedback = useRoundFeedback();
  const ph = useRoundPlaceholder();

  return (
    <>
      <AppWrap>
        <QuizHeader />
        <QuizAreaFrame>
          <PhotoArea>
            <ImageWrap $showingPlaceholder={ph.showPlaceholder}>
              {gameMode === "photo" && <PhotoGame />}
              {gameMode === "audio" && <AudioGame />}
              <QuizRoundFeedback feedback={feedback} />
            </ImageWrap>
            <QuizCreditBar />
          </PhotoArea>
          <QuizGuessActions />
        </QuizAreaFrame>
      </AppWrap>

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
