import styled from "styled-components";
import { useGuessHandlers } from "../../hooks/useGuessHandlers";
import { useGameMode } from "../../hooks/useGameMode";
import { useQuizGameContext } from "../../hooks/useQuizGameContext";
import { useRoundAudioUi } from "../../hooks/useRoundAudioUi";
import { useRoundPlaceholder } from "../../hooks/useRoundPlaceholder";
import { ImagePlaceholder, PlaceholderText, Spinner } from "./shared/ImagePlaceholder";

const AudioStage = styled.div<{ $hidden: boolean }>`
  position: relative;
  width: 100%;
  background: var(--surface-elevated);
  border-radius: 0;
  display: ${({ $hidden }) => ($hidden ? "none" : "block")};

  @media (min-width: 640px) {
    border-radius: var(--radius);
  }
`;

const AudioVisualizerWrap = styled.div`
  width: 100%;
  min-height: min(52vh, 420px);
  display: flex;
  align-items: stretch;
  justify-content: center;

  canvas {
    display: block;
    width: 100% !important;
    height: auto !important;
    max-height: 78vh;
  }

  @media (min-width: 640px) {
    aspect-ratio: 4 / 3;
    min-height: 0;
    max-height: none;

    canvas {
      max-height: none;
      height: 100% !important;
    }
  }
`;

const QuizAudio = styled.audio`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  clip: rect(0, 0, 0, 0);
  overflow: hidden;
`;

const AudioTapPlay = styled.button<{ $hidden: boolean }>`
  position: absolute;
  inset: 0;
  margin: auto;
  width: max-content;
  height: max-content;
  padding: 0.85rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  color: #fff;
  background: var(--accent-canada);
  box-shadow: 0 4px 20px var(--shadow-medium);
  z-index: 2;
  display: ${({ $hidden }) => ($hidden ? "none" : "block")};

  &:hover {
    filter: brightness(1.06);
  }
`;

export function AudioGame() {
  const gameMode = useGameMode();
  const ph = useRoundPlaceholder();
  const { audioStageHidden, showAudioTapPlay } = useRoundAudioUi();
  const { quizAudioRef, audioVisualizerWrapRef } = useQuizGameContext();
  const { onAudioTapPlay } = useGuessHandlers();

  if (gameMode !== "audio") return null;

  return (
    <>
      <ImagePlaceholder $hidden={!ph.showPlaceholder}>
        <Spinner aria-hidden="true" />
        <PlaceholderText>{ph.showPlaceholder ? ph.placeholderText : ""}</PlaceholderText>
      </ImagePlaceholder>
      <AudioStage $hidden={audioStageHidden} aria-hidden={audioStageHidden ? "true" : "false"}>
        <AudioVisualizerWrap ref={audioVisualizerWrapRef} />
        <QuizAudio ref={quizAudioRef} preload="auto" playsInline />
        <AudioTapPlay type="button" $hidden={!showAudioTapPlay} onClick={onAudioTapPlay}>
          Tap to play sound
        </AudioTapPlay>
      </AudioStage>
    </>
  );
}
