import type { MouseEvent } from "react";
import styled from "styled-components";
import { useQuizGameContext } from "../../hooks/useQuizGameContext";
import { useQuizStats } from "../../hooks/useQuizStats";
import { useStatsModal } from "../../hooks/useStatsModal";
import { IconClose } from "./QuizIcons";
import { CloseButton, Modal, ModalHeader, ModalInner, ModalTitle } from "./shared/Modal";

const StatsSummary = styled.div`
  text-align: center;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--surface-elevated);
`;

const AccuracyLabel = styled.p`
  margin: 0;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
`;

const AccuracyValue = styled.p`
  margin: 0.35rem 0 0;
  font-size: 2rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  letter-spacing: -0.02em;
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem 1rem;
  padding: 0.5rem 0 0;
  align-items: baseline;

  & + & {
    border-top: 1px solid var(--surface-elevated);
    margin-top: 0.35rem;
    padding-top: 0.65rem;
  }

  dt {
    margin: 0;
    font-size: 0.88rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  dd {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    text-align: right;
  }
`;

const StatsExtra = styled.dl`
  margin: 1.15rem 0 0;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-elevated);
`;

const StatsMatrixWrap = styled.div`
  margin: 1.15rem 0 0;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-elevated);
`;

const LabelWrap = styled.div<{ $context: "body" | "when" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  padding: 0.3rem 0.12rem;
  min-height: ${({ $context }) => ($context === "when" ? "calc(6.75rem + 6.75rem - 0.35rem)" : "6.35rem")};
`;

const LabelRotated = styled.span`
  display: inline-block;
  transform: rotate(-90deg);
  transform-origin: center center;
  white-space: nowrap;
  line-height: 1.15;
  font-size: 0.68rem;
  font-weight: 600;
  font-style: normal;
  color: var(--text);
`;

const CornerTop = styled.td`
  && {
    border: none;
    background: transparent;
    padding: 0;
    vertical-align: bottom;
  }
`;

const YouGuessed = styled.th`
  && {
    text-transform: none;
    font-style: italic;
    color: var(--text);
    background: var(--surface-elevated);
  }
`;

const WhenCell = styled.th`
  && {
    font-style: italic;
    color: var(--text);
    background: var(--surface-elevated);
    width: 2.75rem;
    min-width: 2.75rem;
    max-width: 2.75rem;
    padding: 0;
    overflow: hidden;
    box-sizing: border-box;
  }
`;

const LabelCell = styled.th`
  && {
    width: 2.75rem;
    min-width: 2.75rem;
    max-width: 2.75rem;
    padding: 0;
    vertical-align: middle;
    text-align: center;
    overflow: hidden;
    box-sizing: border-box;
    background: var(--bg);
  }
`;

const MatrixCell = styled.td`
  && {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    font-size: 1rem;
    background: var(--surface);
  }
`;

const StatsMatrixHint = styled.p`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const StatsMatrix = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;

  th,
  td {
    padding: 0.55rem 0.5rem;
    text-align: center;
    border: 1px solid var(--surface-elevated);
    vertical-align: middle;
  }

  thead th {
    font-weight: 600;
    color: var(--text-muted);
    background: var(--bg);
  }

  thead tr:nth-child(2) th {
    min-height: 5.75rem;
    font-size: 0.72rem;
    line-height: 1.2;
    max-width: 6.5rem;
    word-break: break-word;
  }

  tbody th,
  tbody td {
    min-height: 6.75rem;
  }
`;

export function StatsModal() {
  const { statsDialogRef } = useQuizGameContext();
  const { closeStats } = useStatsModal();
  const { statTotalPct, statCurrentStreak, statLongestStreak, statsMatrix: matrix } = useQuizStats();

  return (
    <Modal
      ref={statsDialogRef}
      aria-labelledby="statsTitle"
      onClick={(e: MouseEvent<HTMLDialogElement>) => {
        if (e.target === statsDialogRef.current) closeStats();
      }}
    >
      <ModalInner>
        <ModalHeader>
          <ModalTitle id="statsTitle">
            Statistics
          </ModalTitle>
          <CloseButton type="button" aria-label="Close" onClick={closeStats}>
            <IconClose />
          </CloseButton>
        </ModalHeader>
        <StatsSummary>
          <AccuracyLabel>Total accuracy</AccuracyLabel>
          <AccuracyValue>{statTotalPct}</AccuracyValue>
        </StatsSummary>

        <StatsExtra>
          <StatRow>
            <dt>Current streak</dt>
            <dd>{statCurrentStreak}</dd>
          </StatRow>
          <StatRow>
            <dt>Longest correct streak</dt>
            <dd>{statLongestStreak}</dd>
          </StatRow>
        </StatsExtra>

        <StatsMatrixWrap>
          <StatsMatrix aria-describedby="statsMatrixDesc">
            <col />
            <col />
            <colgroup span={3} />
            <thead>
              <tr>
                <CornerTop colSpan={2} rowSpan={2} />
                <YouGuessed scope="colgroup" colSpan={3}>
                  You guessed…
                </YouGuessed>
              </tr>
              <tr>
                <th scope="col">{matrix.colGuessA}</th>
                <th scope="col">{matrix.colGuessB}</th>
                <th scope="col">I don't know</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <WhenCell rowSpan={2} scope="rowgroup">
                  <LabelWrap $context="when">
                    <LabelRotated>When it was…</LabelRotated>
                  </LabelWrap>
                </WhenCell>
                <LabelCell scope="row">
                  <LabelWrap $context="body">
                    <LabelRotated>{matrix.rowWhenA}</LabelRotated>
                  </LabelWrap>
                </LabelCell>
                <MatrixCell>{matrix.whenAGuessA}</MatrixCell>
                <MatrixCell>{matrix.whenAGuessB}</MatrixCell>
                <MatrixCell>{matrix.whenASkip}</MatrixCell>
              </tr>
              <tr>
                <LabelCell scope="row">
                  <LabelWrap $context="body">
                    <LabelRotated>{matrix.rowWhenB}</LabelRotated>
                  </LabelWrap>
                </LabelCell>
                <MatrixCell>{matrix.whenBGuessA}</MatrixCell>
                <MatrixCell>{matrix.whenBGuessB}</MatrixCell>
                <MatrixCell>{matrix.whenBSkip}</MatrixCell>
              </tr>
            </tbody>
          </StatsMatrix>
          <StatsMatrixHint id="statsMatrixDesc">
            Counts for each combination of which species was shown, your guess, and skips ("I don't know").
          </StatsMatrixHint>
        </StatsMatrixWrap>
      </ModalInner>
    </Modal>
  );
}
