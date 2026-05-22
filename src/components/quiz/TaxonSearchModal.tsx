import type { MouseEvent } from "react";
import styled from "styled-components";
import { taxonDisplayLabel, taxonSquareUrl } from "../../quiz/inat";
import { useTaxonSearch } from "../../hooks/useTaxonSearch";
import { IconClose } from "./QuizIcons";
import { CloseButton, Modal, ModalHeader, ModalInner, ModalTitle } from "./shared/Modal";

const SearchField = styled.label`
  display: block;
  margin-bottom: 0.75rem;
`;

const SearchLabel = styled.span`
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--surface-elevated);
  border-radius: var(--radius);
  background: var(--bg);
  color: var(--text);
  font-family: inherit;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: var(--accent-canada);
  }
`;

const SearchHint = styled.p<{ $hidden: boolean }>`
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  display: ${({ $hidden }) => ($hidden ? "none" : "block")};
`;

const SearchResults = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: min(50vh, 260px);
  overflow-y: auto;
  border: 1px solid var(--surface-elevated);
  border-radius: var(--radius);
  background: var(--bg);
`;

const SearchResultBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.5rem 0.65rem;
  border: none;
  border-bottom: 1px solid var(--surface-elevated);
  background: transparent;
  color: var(--text);
  font-family: inherit;
  font-size: 0.88rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.12s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--surface-elevated);
  }
`;

const SearchResultThumb = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  background: var(--surface);
  flex-shrink: 0;
`;

const SearchResultThumbPlaceholder = styled.span`
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: var(--surface);
  flex-shrink: 0;
`;

const SearchResultText = styled.div`
  flex: 1;
  min-width: 0;
  line-height: 1.3;
`;

const SearchResultName = styled.div`
  font-weight: 600;
`;

const SearchResultSci = styled.div`
  font-size: 0.78rem;
  color: var(--text-muted);
`;

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
    <Modal
      $nested
      ref={dialogRef}
      aria-labelledby="taxonSearchTitle"
      onClick={(e: MouseEvent<HTMLDialogElement>) => {
        if (e.target === dialogRef.current) closeTaxonSearch();
      }}
    >
      <ModalInner>
        <ModalHeader>
          <ModalTitle id="taxonSearchTitle">
            {title}
          </ModalTitle>
          <CloseButton type="button" aria-label="Close search" onClick={closeTaxonSearch}>
            <IconClose />
          </CloseButton>
        </ModalHeader>
        <SearchField>
          <SearchLabel>Search iNaturalist species</SearchLabel>
          <SearchInput
            id="taxonSearchInput"
            type="search"
            placeholder="e.g. golden-crowned kinglet"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setTaxonSearchQuery(e.target.value)}
          />
        </SearchField>
        <SearchHint $hidden={!hint} role="status">
          {hint}
        </SearchHint>
        <SearchResults aria-live="polite">
          {results.map((t) => {
            const su = taxonSquareUrl(t);
            return (
              <li key={t.id}>
                <SearchResultBtn type="button" onClick={() => onPickTaxonSearchResult(t)}>
                  {su ? (
                    <SearchResultThumb src={su} alt="" />
                  ) : (
                    <SearchResultThumbPlaceholder aria-hidden style={{ visibility: "hidden" }} />
                  )}
                  <SearchResultText>
                    <SearchResultName>{taxonDisplayLabel(t)}</SearchResultName>
                    <SearchResultSci>{t.name ?? ""}</SearchResultSci>
                  </SearchResultText>
                </SearchResultBtn>
              </li>
            );
          })}
        </SearchResults>
      </ModalInner>
    </Modal>
  );
}
