import type { RoundFeedback } from "../../quiz/viewTypes";

interface QuizRoundFeedbackProps {
  feedback: RoundFeedback;
}

export function QuizRoundFeedback({ feedback }: QuizRoundFeedbackProps) {
  const feedbackClass =
    feedback == null
      ? "hidden"
      : feedback.kind === "correct"
        ? "correct"
        : feedback.kind === "wrong"
          ? "wrong"
          : "feedback-skip";

  return (
    <div
      className={`feedback ${feedback == null ? "hidden" : ""} ${feedbackClass}`}
      aria-live="polite"
    >
      {feedback?.text ?? ""}
    </div>
  );
}
