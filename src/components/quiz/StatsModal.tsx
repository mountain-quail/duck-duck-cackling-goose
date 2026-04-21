import type { MouseEvent } from "react";
import { useQuizGameContext } from "../../hooks/useQuizGameContext";
import { useQuizStats } from "../../hooks/useQuizStats";
import { useStatsModal } from "../../hooks/useStatsModal";
import { IconClose } from "./QuizIcons";

export function StatsModal() {
  const { statsDialogRef } = useQuizGameContext();
  const { closeStats } = useStatsModal();
  const { statTotalPct, statCurrentStreak, statLongestStreak, statsMatrix: matrix } = useQuizStats();

  return (
    <dialog
      ref={statsDialogRef}
      className="modal"
      aria-labelledby="statsTitle"
      onClick={(e: MouseEvent<HTMLDialogElement>) => {
        if (e.target === statsDialogRef.current) closeStats();
      }}
    >
      <div className="modal-inner">
        <div className="modal-header">
          <h2 id="statsTitle" className="modal-title">
            Statistics
          </h2>
          <button type="button" className="icon-btn modal-close" aria-label="Close" onClick={closeStats}>
            <IconClose />
          </button>
        </div>
        <div className="stats-summary">
          <p className="stats-accuracy-label">Total accuracy</p>
          <p className="stats-accuracy-value">{statTotalPct}</p>
        </div>

        <dl className="stats-extra">
          <div className="stat-row">
            <dt>Current streak</dt>
            <dd>{statCurrentStreak}</dd>
          </div>
          <div className="stat-row">
            <dt>Longest correct streak</dt>
            <dd>{statLongestStreak}</dd>
          </div>
        </dl>

        <div className="stats-matrix-wrap">
          <table className="stats-matrix" aria-describedby="statsMatrixDesc">
            <col />
            <col />
            <colgroup span={3} />
            <thead>
              <tr>
                <td className="stats-matrix-corner-top" colSpan={2} rowSpan={2} />
                <th className="stats-matrix-you-guessed" scope="colgroup" colSpan={3}>
                  You guessed…
                </th>
              </tr>
              <tr>
                <th scope="col">{matrix.colGuessA}</th>
                <th scope="col">{matrix.colGuessB}</th>
                <th scope="col">I don’t know</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="stats-matrix-when stats-matrix-when-cell" rowSpan={2} scope="rowgroup">
                  <div className="stats-matrix-label-wrap">
                    <span className="stats-matrix-label-rotated">When it was…</span>
                  </div>
                </th>
                <th scope="row" className="stats-matrix-label-cell">
                  <div className="stats-matrix-label-wrap">
                    <span className="stats-matrix-label-rotated">{matrix.rowWhenA}</span>
                  </div>
                </th>
                <td className="stats-matrix-cell">{matrix.whenAGuessA}</td>
                <td className="stats-matrix-cell">{matrix.whenAGuessB}</td>
                <td className="stats-matrix-cell">{matrix.whenASkip}</td>
              </tr>
              <tr>
                <th scope="row" className="stats-matrix-label-cell">
                  <div className="stats-matrix-label-wrap">
                    <span className="stats-matrix-label-rotated">{matrix.rowWhenB}</span>
                  </div>
                </th>
                <td className="stats-matrix-cell">{matrix.whenBGuessA}</td>
                <td className="stats-matrix-cell">{matrix.whenBGuessB}</td>
                <td className="stats-matrix-cell">{matrix.whenBSkip}</td>
              </tr>
            </tbody>
          </table>
          <p id="statsMatrixDesc" className="stats-matrix-hint">
            Counts for each combination of which species was shown, your guess, and skips (“I don’t know”).
          </p>
        </div>
      </div>
    </dialog>
  );
}
