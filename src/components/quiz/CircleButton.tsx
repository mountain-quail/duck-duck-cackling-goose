import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useId } from "react";
import styled, { css } from "styled-components";

const VIEW = 100;
const TEXT_R = 42;
const CX = 50;
const CY = 50;
const WOBBLE = 0.01;
const CIRCLE_PATH_D = `M ${CX - TEXT_R},${CY} a${TEXT_R},${TEXT_R} 0 1,1 ${2 * TEXT_R - WOBBLE},0 a${TEXT_R},${TEXT_R} 0 1,1 -${2 * TEXT_R - WOBBLE},0`;

type CircleButtonBase = {
  src: string;
  alt: string;
  onClick: () => void;
  children?: ReactNode;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "aria-label" | "aria-haspopup">;

const CircleImageWrap = styled.span<{ $withLabel?: boolean }>`
  position: relative;
  z-index: 1;

  ${({ $withLabel }) =>
    !$withLabel &&
    css`
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      border: none;
    `}

  ${({ $withLabel }) =>
    $withLabel &&
    css`
      width: 4.5rem;
      height: 4.5rem;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid var(--surface-elevated);
      background-color: var(--bg);
      box-shadow: 0 4px 16px var(--shadow-soft);
      flex-shrink: 0;
      transition: border-color 0.15s, transform 0.1s, box-shadow 0.1s;
    `}
`;

const CircleImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CircleImageEmpty = styled.span`
  display: block;
  width: 100%;
  height: 100%;
  min-height: 3rem;
  background: linear-gradient(160deg, var(--surface) 0%, var(--bg) 100%);
`;

const CircleRing = styled.svg`
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
`;

const CircleText = styled.text`
  font-weight: 600;
  letter-spacing: 0.02em;
  fill: currentColor;
  user-select: none;
  font-size: 0.38rem;

  @media (min-width: 400px) {
    font-size: 0.5rem;
  }
`;

const CircleRoot = styled.button<{ $withLabel: boolean }>`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  line-height: 0;
  transition: transform 0.1s;
  vertical-align: top;
  color: var(--text);

  ${({ $withLabel }) =>
    !$withLabel &&
    css`
      width: 4.5rem;
      height: 4.5rem;
      border: 3px solid var(--surface-elevated);
      border-radius: 50%;
      background-color: var(--bg);
      box-shadow: 0 4px 16px var(--shadow-soft);
      transition: border-color 0.15s, transform 0.1s, box-shadow 0.1s;

      &:hover {
        border-color: var(--accent-canada);
        transform: scale(1.04);
      }

      &:focus {
        outline: none;
      }

      &:focus-visible {
        border-color: var(--accent-cackling);
        box-shadow: 0 0 0 3px rgba(45, 143, 82, 0.35);
      }
    `}

  ${({ $withLabel }) =>
    $withLabel &&
    css`
      width: 5.5rem;
      height: 5.5rem;
      transition: transform 0.1s;

      &:hover ${CircleImageWrap},
      &:focus-visible ${CircleImageWrap} {
        border-color: var(--accent-canada);
        transform: scale(1.04);
      }

      &:focus {
        outline: none;
      }

      &:focus-visible ${CircleImageWrap} {
        border-color: var(--accent-cackling);
        box-shadow: 0 0 0 3px rgba(45, 143, 82, 0.35);
      }
    `}
`;

export function CircleButton({ src, alt, onClick, children, className, "aria-label": ariaLabel, "aria-haspopup": ariaHaspopup }: CircleButtonBase) {
  const id = useId().replace(/:/g, "");
  const pathId = `circleButtonPath-${id}`;
  const hasLabel = children != null && String(children).trim() !== "";
  const labelText = hasLabel ? String(children).trim() : "";

  return (
    <CircleRoot type="button" $withLabel={hasLabel} className={className} onClick={onClick} aria-label={ariaLabel} aria-haspopup={ariaHaspopup}>
      {hasLabel && (
        <CircleRing viewBox={`0 0 ${VIEW} ${VIEW}`} aria-hidden focusable="false" role="presentation">
          <defs>
            <path id={pathId} d={CIRCLE_PATH_D} fill="none" />
          </defs>
          <CircleText>
            <textPath href={`#${pathId}`} startOffset="2%" textAnchor="start" lengthAdjust="spacingAndGlyphs">
              {labelText}
            </textPath>
          </CircleText>
        </CircleRing>
      )}
      <CircleImageWrap $withLabel={hasLabel}>
        {src ? <CircleImage src={src} alt={alt} /> : <CircleImageEmpty role="img" aria-label={alt} />}
      </CircleImageWrap>
    </CircleRoot>
  );
}
