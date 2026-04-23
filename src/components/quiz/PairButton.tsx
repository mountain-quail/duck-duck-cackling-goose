import { Children, isValidElement, type HTMLAttributes, type ReactElement, type ReactNode } from "react";

export type TaxonProps = {
  src?: string | null;
  children: ReactNode;
};

/**
 * Data-only child of `PairButton` — no DOM. Pass two in order (A then B).
 */
export function Taxon(_props: TaxonProps): null {
  return null;
}

type PairButtonBase = Omit<HTMLAttributes<HTMLButtonElement>, "children" | "onClick" | "aria-label"> & {
  onClick: () => void;
  /** Fully describes the action for the button. */
  "aria-label": string;
  /** When true, adds `preset-btn--active`. */
  active?: boolean;
  children: ReactNode;
};

function isTaxonElement(c: ReactNode): c is ReactElement<TaxonProps> {
  return isValidElement(c) && c.type === Taxon;
}

function parsePairTaxa(children: ReactNode): [TaxonProps, TaxonProps] {
  const arr = Children.toArray(children);
  if (arr.length !== 2 || !isTaxonElement(arr[0]) || !isTaxonElement(arr[1])) {
    throw new Error("PairButton expects exactly two <Taxon> children (A, then B).");
  }
  return [arr[0].props, arr[1].props];
}

/**
 * Renders a full-width `preset-btn` row: [ thumb A | names A / B | thumb B ].
 * Provide **exactly** two `Taxon` children in taxon A / B order; each `Taxon` is non-rendering
 * and only supplies optional `src` and display `children` (name).
 */
export function PairButton({ onClick, children, className, active, "aria-label": ariaLabel, ...rest }: PairButtonBase) {
  const [a, b] = parsePairTaxa(children);
  const nameA = a.children;
  const nameB = b.children;
  const btnClass = ["preset-btn", active ? "preset-btn--active" : null, className].filter(Boolean).join(" ");
  return (
    <button type="button" className={btnClass} aria-label={ariaLabel} onClick={onClick} {...rest}>
      {a.src ? (
        <img className="preset-btn-img preset-btn-img--a" src={a.src} alt="" decoding="async" />
      ) : (
        <span className="preset-btn-img preset-btn-img--a preset-btn-img--placeholder" aria-hidden />
      )}
      <span className="preset-btn-mid">
        <span className="preset-btn-name preset-btn-name--a">{nameA}</span>
        <span className="preset-btn-sep"> / </span>
        <span className="preset-btn-name preset-btn-name--b">{nameB}</span>
      </span>
      {b.src ? (
        <img className="preset-btn-img preset-btn-img--b" src={b.src} alt="" decoding="async" />
      ) : (
        <span className="preset-btn-img preset-btn-img--b preset-btn-img--placeholder" aria-hidden />
      )}
    </button>
  );
}
