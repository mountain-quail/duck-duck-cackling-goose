import type { ReactNode } from "react";

interface QuizAreaFrameProps {
  children: ReactNode;
}

export function QuizAreaFrame({ children }: QuizAreaFrameProps) {
  return <main className="main">{children}</main>;
}
