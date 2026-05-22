import styled, { css, keyframes } from "styled-components";
import type { RoundFeedback } from "../../quiz/viewTypes";

interface QuizRoundFeedbackProps {
  feedback: RoundFeedback;
}

const pop = keyframes`
  from {
    transform: scale(0.6);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

type FeedbackVariant = "correct" | "wrong" | "skip" | null;

const Feedback = styled.div<{ $variant: FeedbackVariant }>`
  position: absolute;
  inset: 0;
  display: ${({ $variant }) => ($variant === null ? "none" : "flex")};
  align-items: center;
  justify-content: center;
  pointer-events: none;
  font-size: 5rem;
  font-weight: 800;
  text-shadow: 0 1px 12px var(--shadow-strong);
  animation: ${pop} 0.35s ease-out;

  ${({ $variant }) =>
    $variant === "correct" &&
    css`
      color: var(--success);
    `}

  ${({ $variant }) =>
    $variant === "wrong" &&
    css`
      color: var(--error);
    `}

  ${({ $variant }) =>
    $variant === "skip" &&
    css`
      font-size: clamp(1.05rem, 4.5vw, 1.35rem);
      font-weight: 700;
      line-height: 1.25;
      text-align: center;
      padding: 0 0.75rem;
      color: var(--accent-canada);
    `}
`;

export function QuizRoundFeedback({ feedback }: QuizRoundFeedbackProps) {
  const variant: FeedbackVariant =
    feedback == null
      ? null
      : feedback.kind === "correct"
        ? "correct"
        : feedback.kind === "wrong"
          ? "wrong"
          : "skip";

  return (
    <Feedback $variant={variant} aria-live="polite">
      {feedback?.text ?? ""}
    </Feedback>
  );
}
