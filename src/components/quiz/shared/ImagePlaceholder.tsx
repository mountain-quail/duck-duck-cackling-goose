import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const ImagePlaceholder = styled.div<{ $hidden?: boolean }>`
  position: absolute;
  inset: 0;
  display: ${({ $hidden }) => ($hidden ? "none" : "flex")};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--text-muted);
`;

export const Spinner = styled.span`
  width: 36px;
  height: 36px;
  border: 3px solid var(--surface-elevated);
  border-top-color: var(--accent-cackling);
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
`;

export const PlaceholderText = styled.span`
  font-size: 0.9rem;
`;
