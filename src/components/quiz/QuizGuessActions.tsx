import styled from "styled-components";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { useGameMode } from "../../hooks/useGameMode";
import { useGuessDisabled } from "../../hooks/useGuessDisabled";
import { useGuessHandlers } from "../../hooks/useGuessHandlers";
import { useQuizPersisted } from "../../hooks/useQuizPersisted";

const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0;
  }
`;

const ActionsSkip = styled.div`
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0;
  }
`;

const BaseButton = styled.button`
  padding: 0.85rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  color: #fff;
  transition: filter 0.15s, transform 0.1s;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
  }

  &:not(:disabled):active {
    transform: scale(0.98);
  }

  &:not(:disabled):hover {
    filter: brightness(1.08);
  }
`;

const CacklingButton = styled(BaseButton)`
  &:not(:disabled) {
    background: linear-gradient(160deg, var(--accent-cackling), #1f6e3d);
  }
`;

const CanadaButton = styled(BaseButton)`
  &:not(:disabled) {
    background: linear-gradient(160deg, var(--accent-canada), #134a32);
  }
`;

const SkipButton = styled.button`
  width: 100%;
  padding: 0.65rem 0.85rem;
  font-size: 0.88rem;
  font-weight: 600;
  font-family: inherit;
  border: 2px solid #0f4d2e;
  border-radius: var(--radius);
  cursor: pointer;
  color: #0f4d2e;
  background: transparent;
  transition: color 0.15s, border-color 0.15s, background 0.15s;

  &:not(:disabled):hover {
    color: #082818;
    border-color: #082818;
    background: rgba(15, 77, 46, 0.1);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p<{ $hidden: boolean }>`
  margin: 0 1rem;
  padding: 0.75rem;
  border-radius: var(--radius);
  background: rgba(194, 61, 74, 0.1);
  color: var(--error);
  font-size: 0.9rem;
  text-align: center;
  display: ${({ $hidden }) => ($hidden ? "none" : "block")};

  @media (min-width: 640px) {
    margin: 0;
  }
`;

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
      <Actions>
        <CacklingButton type="button" disabled={guessDisabled} onClick={onGuessA}>
          {pair.labelA}
        </CacklingButton>
        <CanadaButton type="button" disabled={guessDisabled} onClick={onGuessB}>
          {pair.labelB}
        </CanadaButton>
      </Actions>

      <ActionsSkip>
        <SkipButton type="button" disabled={guessDisabled} aria-label={skipAria} onClick={onSkip}>
          What the heck is even that?
        </SkipButton>
      </ActionsSkip>

      <ErrorText $hidden={!errorMessage} role="alert">
        {errorMessage ?? ""}
      </ErrorText>
    </>
  );
}
