import type { ReactNode } from "react";
import styled from "styled-components";

interface QuizAreaFrameProps {
  children: ReactNode;
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export function QuizAreaFrame({ children }: QuizAreaFrameProps) {
  return <Main>{children}</Main>;
}
