import { Children, isValidElement, type HTMLAttributes, type ReactElement, type ReactNode } from "react";
import styled from "styled-components";

export type TaxonProps = {
  src?: string | null;
  children: ReactNode;
};

export function Taxon(_props: TaxonProps): null {
  return null;
}

type PairButtonBase = Omit<HTMLAttributes<HTMLButtonElement>, "children" | "onClick" | "aria-label"> & {
  onClick: () => void;
  "aria-label": string;
  active?: boolean;
  children: ReactNode;
};

const PresetButton = styled.button<{ $active?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.5rem 0.65rem;
  border: 1px solid ${({ $active }) => ($active ? "var(--accent-canada)" : "var(--surface-elevated)")};
  border-radius: var(--radius);
  background: ${({ $active }) => ($active ? "rgba(45, 143, 82, 0.12)" : "var(--bg)")};
  color: var(--text);
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: ${({ $active }) => ($active ? "rgba(45, 143, 82, 0.12)" : "var(--surface-elevated)")};
  }
`;

const PresetImg = styled.img`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 10px;
  object-fit: cover;
  background: var(--surface);
  box-shadow: inset 0 0 0 1px rgba(21, 53, 36, 0.08);

  ${PresetButton}:hover & {
    box-shadow: inset 0 0 0 1px rgba(21, 53, 36, 0.1);
  }
`;

const PresetPlaceholder = styled.span`
  display: inline-block;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 10px;
  background: linear-gradient(145deg, var(--surface-elevated), var(--surface));
`;

const PresetMid = styled.span`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 0.15rem 0.25rem;
  text-align: center;
  line-height: 1.25;
`;

const PresetName = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text);
`;

const PresetSep = styled.span`
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-muted);
`;

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

export function PairButton({ onClick, children, className, active, "aria-label": ariaLabel, ...rest }: PairButtonBase) {
  const [a, b] = parsePairTaxa(children);
  return (
    <PresetButton type="button" $active={active} className={className} aria-label={ariaLabel} onClick={onClick} {...rest}>
      {a.src ? <PresetImg src={a.src} alt="" decoding="async" /> : <PresetPlaceholder aria-hidden />}
      <PresetMid>
        <PresetName>{a.children}</PresetName>
        <PresetSep> / </PresetSep>
        <PresetName>{b.children}</PresetName>
      </PresetMid>
      {b.src ? <PresetImg src={b.src} alt="" decoding="async" /> : <PresetPlaceholder aria-hidden />}
    </PresetButton>
  );
}
