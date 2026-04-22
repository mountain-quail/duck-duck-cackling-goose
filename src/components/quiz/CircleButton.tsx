import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useId } from "react";

const VIEW = 100;
const TEXT_R = 42;
const CX = 50;
const CY = 50;
const WOBBLE = 0.01;
/** Two half-circles, closed loop for textPath (concentric with center image). */
const CIRCLE_PATH_D = `M ${CX - TEXT_R},${CY} a${TEXT_R},${TEXT_R} 0 1,1 ${2 * TEXT_R - WOBBLE},0 a${TEXT_R},${TEXT_R} 0 1,1 -${2 * TEXT_R - WOBBLE},0`;

type CircleButtonBase = {
  src: string;
  alt: string;
  onClick: () => void;
  children?: ReactNode;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "aria-label" | "aria-haspopup">;

export function CircleButton({ src, alt, onClick, children, className, "aria-label": ariaLabel, "aria-haspopup": ariaHaspopup }: CircleButtonBase) {
  const id = useId().replace(/:/g, "");
  const pathId = `circleButtonPath-${id}`;
  const hasLabel = children != null && String(children).trim() !== "";
  const labelText = hasLabel ? String(children).trim() : "";

  const buttonClass = ["circle-button", hasLabel ? "circle-button--with-label" : "circle-button--image-only", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={buttonClass} onClick={onClick} aria-label={ariaLabel} aria-haspopup={ariaHaspopup}>
      {hasLabel && (
        <svg className="circle-button__ring" viewBox={`0 0 ${VIEW} ${VIEW}`} aria-hidden focusable="false" role="presentation">
          <defs>
            <path id={pathId} d={CIRCLE_PATH_D} fill="none" />
          </defs>
          <text className="circle-button__text">
            {/* Path runs L→R along bottom, then R→L along top; 50% is ~3 o'clock, ~87.5% is top-left arc. */}
            <textPath href={`#${pathId}`} startOffset="2%" textAnchor="start" lengthAdjust="spacingAndGlyphs">
              {labelText}
            </textPath>
          </text>
        </svg>
      )}
      <span className="circle-button__image-wrap">
        {src ? <img className="circle-button__img" src={src} alt={alt} /> : <span className="circle-button__img circle-button__img--empty" role="img" aria-label={alt} />}
      </span>
    </button>
  );
}
