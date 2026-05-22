import styled from "styled-components";
import { useDisplayImage } from "../../hooks/useDisplayImage";
import { useGameMode } from "../../hooks/useGameMode";
import { useQuizGameContext } from "../../hooks/useQuizGameContext";
import { useRoundPlaceholder } from "../../hooks/useRoundPlaceholder";
import { useShowImage } from "../../hooks/useShowImage";
import { ImagePlaceholder, PlaceholderText, Spinner } from "./shared/ImagePlaceholder";

const GooseImage = styled.img<{ $hidden: boolean }>`
  width: 100%;
  height: auto;
  max-height: 78vh;
  object-fit: contain;
  display: ${({ $hidden }) => ($hidden ? "none" : "block")};
  vertical-align: middle;

  @media (min-width: 640px) {
    height: 100%;
    max-height: none;
  }
`;

export function PhotoGame() {
  const gameMode = useGameMode();
  const { imageSrc, imageAlt } = useDisplayImage();
  const showImage = useShowImage();
  const ph = useRoundPlaceholder();
  const { engine } = useQuizGameContext();

  if (gameMode !== "photo") return null;

  return (
    <>
      <ImagePlaceholder $hidden={!ph.showPlaceholder}>
        <Spinner aria-hidden="true" />
        <PlaceholderText>{ph.showPlaceholder ? ph.placeholderText : ""}</PlaceholderText>
      </ImagePlaceholder>
      <GooseImage
        $hidden={!showImage}
        src={imageSrc}
        alt={imageAlt}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={engine.onImageLoad}
        onError={engine.onImageError}
      />
    </>
  );
}
