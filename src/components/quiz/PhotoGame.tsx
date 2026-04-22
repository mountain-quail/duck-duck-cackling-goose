import { useDisplayImage } from "../../hooks/useDisplayImage";
import { useGameMode } from "../../hooks/useGameMode";
import { useQuizGameContext } from "../../hooks/useQuizGameContext";
import { useRoundPlaceholder } from "../../hooks/useRoundPlaceholder";
import { useShowImage } from "../../hooks/useShowImage";

export function PhotoGame() {
  const gameMode = useGameMode();
  const { imageSrc, imageAlt } = useDisplayImage();
  const showImage = useShowImage();
  const ph = useRoundPlaceholder();
  const { engine } = useQuizGameContext();

  if (gameMode !== "photo") return null;

  return (
    <>
      <div className={`image-placeholder ${ph.showPlaceholder ? "" : "hidden"}`}>
        <span className="spinner" aria-hidden="true" />
        <span className="placeholder-text">{ph.showPlaceholder ? ph.placeholderText : ""}</span>
      </div>
      <img
        className={`goose-image ${showImage ? "" : "hidden"}`}
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
