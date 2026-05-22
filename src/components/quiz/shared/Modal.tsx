import styled from "styled-components";

export const Modal = styled.dialog<{ $nested?: boolean }>`
  margin: auto;
  padding: 0;
  border: none;
  border-radius: calc(var(--radius) + 4px);
  background: var(--surface);
  color: var(--text);
  max-width: ${({ $nested }) => $nested ? "min(420px, calc(100vw - 2rem))" : "min(480px, calc(100vw - 2rem))"};
  box-shadow: 0 24px 48px var(--shadow-strong);

  &::backdrop {
    background: rgba(21, 53, 36, 0.35);
    backdrop-filter: blur(4px);
  }
`;

export const ModalInner = styled.div`
  padding: 1.25rem 1.25rem 1.5rem;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const ModalHeaderText = styled.div`
  min-width: 0;
  flex: 1;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
`;

export const CloseButton = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: var(--surface-elevated);
    color: var(--text);
  }
`;
