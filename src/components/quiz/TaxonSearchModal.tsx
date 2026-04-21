import type { MouseEvent } from "react";
import { taxonDisplayLabel, taxonSquareUrl } from "../../quiz/inat";
import { useTaxonSearch } from "../../hooks/useTaxonSearch";
import { IconClose } from "./QuizIcons";

export function TaxonSearchModal() {
  const {
    dialogRef,
    title,
    query,
    setTaxonSearchQuery,
    hint,
    results,
    onPickTaxonSearchResult,
    closeTaxonSearch,
  } = useTaxonSearch();

  return (
    <dialog
      ref={dialogRef}
      className="modal modal-nested"
      aria-labelledby="taxonSearchTitle"
      onClick={(e: MouseEvent<HTMLDialogElement>) => {
        if (e.target === dialogRef.current) closeTaxonSearch();
      }}
    >
      <div className="modal-inner">
        <div className="modal-header">
          <h2 id="taxonSearchTitle" className="modal-title">
            {title}
          </h2>
          <button type="button" className="icon-btn modal-close" aria-label="Close search" onClick={closeTaxonSearch}>
            <IconClose />
          </button>
        </div>
        <label className="taxon-search-field">
          <span className="taxon-search-label">Search iNaturalist species</span>
          <input
            id="taxonSearchInput"
            type="search"
            className="taxon-search-input"
            placeholder="e.g. golden-crowned kinglet"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setTaxonSearchQuery(e.target.value)}
          />
        </label>
        <p className={`taxon-search-hint ${hint ? "" : "hidden"}`} role="status">
          {hint}
        </p>
        <ul className="taxon-search-results" aria-live="polite">
          {results.map((t) => {
            const su = taxonSquareUrl(t);
            return (
              <li key={t.id}>
                <button type="button" className="taxon-search-result" onClick={() => onPickTaxonSearchResult(t)}>
                  {su ? (
                    <img className="taxon-search-result-thumb" src={su} alt="" />
                  ) : (
                    <span className="taxon-search-result-thumb" aria-hidden style={{ visibility: "hidden" }} />
                  )}
                  <div className="taxon-search-result-text">
                    <div className="taxon-search-result-name">{taxonDisplayLabel(t)}</div>
                    <div className="taxon-search-result-sci">{t.name ?? ""}</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </dialog>
  );
}
