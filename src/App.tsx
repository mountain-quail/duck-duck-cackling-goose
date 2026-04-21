import { useEffect } from "react";
import { attachQuizGame } from "./quizGame";

export default function App() {
  useEffect(() => attachQuizGame(), []);

  return (
    <>
      <div className="app">
        <header className="header">
          <h1 className="title">Duck Duck Cackling Goose</h1>
          <div className="header-actions">
            <button
              type="button"
              className="icon-btn"
              id="settingsTrigger"
              aria-label="Choose species pair"
              title="Species pair"
            >
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button
              type="button"
              className="icon-btn stats-trigger"
              id="statsTrigger"
              aria-label="Open statistics"
              title="Statistics"
            >
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M4 19h16v2H4v-2zm2-4h2v4H6v-4zm4-6h2v10h-2V9zm4 4h2v6h-2v-6zm4-8h2v14h-2V5z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </header>

        <main className="main">
          <div className="photo-area">
            <div className="image-wrap">
              <div className="image-placeholder" id="imagePlaceholder">
                <span className="spinner" aria-hidden="true" />
                <span className="placeholder-text" id="placeholderText">
                  Loading photo…
                </span>
              </div>
              <div className="audio-stage hidden" id="audioStage" aria-hidden="true">
                <div className="audio-visualizer-wrap" id="audioVisualizerWrap" />
                <audio id="quizAudio" className="quiz-audio" preload="auto" playsInline />
                <button type="button" className="audio-tap-play hidden" id="audioTapPlay">
                  Tap to play sound
                </button>
              </div>
              <img
                id="gooseImage"
                className="goose-image hidden"
                alt=""
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div id="feedback" className="feedback hidden" aria-live="polite" />
            </div>
            <p className="credit" id="photoCredit" />
          </div>

          <div className="actions">
            <button type="button" className="btn btn-cackling" id="btnTaxonA" disabled>
              —
            </button>
            <button type="button" className="btn btn-canada" id="btnTaxonB" disabled>
              —
            </button>
          </div>

          <div className="actions-skip">
            <button
              type="button"
              className="btn btn-skip"
              id="btnSkipPhoto"
              disabled
              aria-label="Skip this photo without guessing"
            >
              What the heck is even that?
            </button>
          </div>

          <p className="error hidden" id="errorMsg" role="alert" />
        </main>
      </div>

      <dialog className="modal" id="statsModal" aria-labelledby="statsTitle">
        <div className="modal-inner">
          <div className="modal-header">
            <h2 id="statsTitle" className="modal-title">
              Statistics
            </h2>
            <button type="button" className="icon-btn modal-close" id="statsClose" aria-label="Close">
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <div className="stats-summary">
            <p className="stats-accuracy-label">Total accuracy</p>
            <p className="stats-accuracy-value" id="statTotalPct">
              —
            </p>
          </div>

          <dl className="stats-extra">
            <div className="stat-row">
              <dt>Current streak</dt>
              <dd id="statCurrentStreak">—</dd>
            </div>
            <div className="stat-row">
              <dt>Longest correct streak</dt>
              <dd id="statLongestStreak">—</dd>
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
                  <th scope="col" id="statMatrixColGuessA">
                    —
                  </th>
                  <th scope="col" id="statMatrixColGuessB">
                    —
                  </th>
                  <th scope="col" id="statMatrixColGuessSkip">
                    I don’t know
                  </th>
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
                      <span className="stats-matrix-label-rotated" id="statMatrixRowWhenA">
                        —
                      </span>
                    </div>
                  </th>
                  <td id="statWhenAGuessA" className="stats-matrix-cell">
                    0
                  </td>
                  <td id="statWhenAGuessB" className="stats-matrix-cell">
                    0
                  </td>
                  <td id="statWhenASkip" className="stats-matrix-cell">
                    0
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="stats-matrix-label-cell">
                    <div className="stats-matrix-label-wrap">
                      <span className="stats-matrix-label-rotated" id="statMatrixRowWhenB">
                        —
                      </span>
                    </div>
                  </th>
                  <td id="statWhenBGuessA" className="stats-matrix-cell">
                    0
                  </td>
                  <td id="statWhenBGuessB" className="stats-matrix-cell">
                    0
                  </td>
                  <td id="statWhenBSkip" className="stats-matrix-cell">
                    0
                  </td>
                </tr>
              </tbody>
            </table>
            <p id="statsMatrixDesc" className="stats-matrix-hint">
              Counts for each combination of which species was shown, your guess, and skips (“I don’t know”).
            </p>
          </div>
        </div>
      </dialog>

      <dialog className="modal" id="settingsModal" aria-labelledby="settingsTitle">
        <div className="modal-inner">
          <div className="modal-header">
            <h2 id="settingsTitle" className="modal-title">
              Pick your pair
            </h2>
            <button type="button" className="icon-btn modal-close" id="settingsClose" aria-label="Close">
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <div className="taxon-pick-row" role="group" aria-label="Current species pair">
            <button type="button" className="taxon-pick" id="btnPickTaxonA" aria-haspopup="dialog">
              <span className="taxon-pick-label" id="taxonPickLabelA" />
            </button>
            <button type="button" className="taxon-pick" id="btnPickTaxonB" aria-haspopup="dialog">
              <span className="taxon-pick-label" id="taxonPickLabelB" />
            </button>
          </div>
          <div className="media-mode" role="group" aria-labelledby="mediaModeLabel">
            <div className="media-mode-label" id="mediaModeLabel">
              Stimulus
            </div>
            <div className="media-mode-segment">
              <button type="button" className="media-mode-btn" id="btnMediaPhoto" aria-pressed="true">
                Photo
              </button>
              <button type="button" className="media-mode-btn" id="btnMediaAudio" aria-pressed="false">
                Audio
              </button>
            </div>
          </div>
          <p className="media-mode-hint">
            Random photo or sound recording from iNaturalist for each round.
          </p>
          <p className="presets-heading">Some fun challenges...</p>
          <ul className="preset-list" id="presetList" />
        </div>
      </dialog>

      <dialog className="modal modal-nested" id="taxonSearchModal" aria-labelledby="taxonSearchTitle">
        <div className="modal-inner">
          <div className="modal-header">
            <h2 id="taxonSearchTitle" className="modal-title">
              Replace species
            </h2>
            <button
              type="button"
              className="icon-btn modal-close"
              id="taxonSearchClose"
              aria-label="Close search"
            >
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <label className="taxon-search-field">
            <span className="taxon-search-label">Search iNaturalist species</span>
            <input
              type="search"
              id="taxonSearchInput"
              className="taxon-search-input"
              placeholder="e.g. golden-crowned kinglet"
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          <p className="taxon-search-hint hidden" id="taxonSearchHint" role="status" />
          <ul className="taxon-search-results" id="taxonSearchResults" aria-live="polite" />
        </div>
      </dialog>
    </>
  );
}
