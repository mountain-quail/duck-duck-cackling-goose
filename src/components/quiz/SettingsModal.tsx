import type { MouseEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { isPresetPair } from "../../quiz/config";
import { fetchTaxonById, taxonSquareUrl } from "../../quiz/inat";
import { canonicalStatsPairKey } from "../../quiz/stats";
import type { TaxonPair } from "../../quiz/types";
import { useQuizGameContext } from "../../hooks/useQuizGameContext";
import { usePickerState } from "../../hooks/usePickerState";
import { usePresetRows } from "../../hooks/usePresetRows";
import { useQuizPersisted } from "../../hooks/useQuizPersisted";
import { useQuizSettingsActions } from "../../hooks/useQuizSettingsActions";
import { CircleButton } from "./CircleButton";
import { IconClose } from "./QuizIcons";
import { PairButton, Taxon } from "./PairButton";
import { CloseButton, Modal, ModalHeader, ModalHeaderText, ModalInner, ModalTitle } from "./shared/Modal";

const SettingsSub = styled.p<{ $inHeader?: boolean }>`
  margin: 0.4rem 0 ${({ $inHeader }) => ($inHeader ? "0" : "0.85rem")};
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.45;
`;

const TaxonPickRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem 1.25rem;
  flex-wrap: wrap;
  margin-bottom: 1.15rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--surface-elevated);
`;

const MediaMode = styled.div`
  margin-bottom: 0.65rem;
`;

const MediaModeLabel = styled.div`
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.45rem;
`;

const MediaModeSegment = styled.div`
  display: flex;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--surface-elevated);
`;

const MediaModeButton = styled.button`
  flex: 1;
  padding: 0.55rem 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: inherit;
  border: none;
  cursor: pointer;
  background: var(--bg);
  color: var(--text-muted);
  transition: background 0.15s, color 0.15s;

  &:hover {
    color: var(--text);
  }

  &[aria-pressed="true"] {
    background: var(--surface-elevated);
    color: var(--text);
  }
`;

const MediaModeHint = styled.p`
  margin: 0 0 1rem;
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.45;
`;

const PresetsHeading = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
`;

const PresetList = styled.ul`
  list-style: none;
  margin: 0;
  margin-bottom: 1rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

function useRecentPairThumbnails(pairs: TaxonPair[]) {
  const keys = useMemo(() => pairs.map((p) => canonicalStatsPairKey(p)).join("|"), [pairs]);
  const [byKey, setByKey] = useState<Record<string, { a: string; b: string }>>({});
  useEffect(() => {
    if (pairs.length === 0) {
      setByKey({});
      return;
    }
    let cancelled = false;
    void (async () => {
      const next: Record<string, { a: string; b: string }> = {};
      await Promise.all(
        pairs.map(async (pair) => {
          const k = canonicalStatsPairKey(pair);
          const [ta, tb] = await Promise.all([fetchTaxonById(pair.idA), fetchTaxonById(pair.idB)]);
          next[k] = {
            a: ta ? taxonSquareUrl(ta) : "",
            b: tb ? taxonSquareUrl(tb) : "",
          };
        })
      );
      if (!cancelled) setByKey(next);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `keys` encodes `pairs` identity
  }, [keys]);
  return byKey;
}

export function SettingsModal() {
  const { settingsDialogRef } = useQuizGameContext();
  const persisted = useQuizPersisted();
  const picker = usePickerState();
  const presetRows = usePresetRows();
  const { applyTaxonPair, applyPresetById, setMediaMode, onPickTaxonSlot, closeSettings } = useQuizSettingsActions();

  const recentForSettings = useMemo(() => {
    const activeKey = canonicalStatsPairKey(persisted.activePair);
    return (persisted.recentPairs ?? [])
      .filter((p) => canonicalStatsPairKey(p) !== activeKey)
      .filter((p) => !isPresetPair(p))
      .slice(0, 3);
  }, [persisted.activePair, persisted.recentPairs]);
  const recentThumbs = useRecentPairThumbnails(recentForSettings);

  const pair = persisted.activePair;
  const pickerAriaA = `Replace ${pair.labelA} (left quiz button)`;
  const pickerAriaB = `Replace ${pair.labelB} (right quiz button)`;

  return (
    <Modal
      ref={settingsDialogRef}
      aria-labelledby="settingsTitle"
      aria-describedby="settingsSub"
      onClick={(e: MouseEvent<HTMLDialogElement>) => {
        if (e.target === settingsDialogRef.current) closeSettings();
      }}
    >
      <ModalInner>
        <ModalHeader>
          <ModalHeaderText>
            <ModalTitle id="settingsTitle">
              Pick your pair
            </ModalTitle>
            <SettingsSub $inHeader id="settingsSub">
              Swap out one of the taxons for a custom challenge
            </SettingsSub>
          </ModalHeaderText>
          <CloseButton type="button" aria-label="Close" onClick={closeSettings}>
            <IconClose />
          </CloseButton>
        </ModalHeader>
        <TaxonPickRow role="group" aria-label="Current species pair">
          <CircleButton
            src={picker.urlA ?? ""}
            alt=""
            aria-label={pickerAriaA}
            aria-haspopup="dialog"
            onClick={() => onPickTaxonSlot("a")}
          >
            {pair.labelA}
          </CircleButton>
          <CircleButton
            src={picker.urlB ?? ""}
            alt=""
            aria-label={pickerAriaB}
            aria-haspopup="dialog"
            onClick={() => onPickTaxonSlot("b")}
          >
            {pair.labelB}
          </CircleButton>
        </TaxonPickRow>
        <MediaMode role="group" aria-labelledby="mediaModeLabel">
          <MediaModeLabel id="mediaModeLabel">
            Game mode
          </MediaModeLabel>
          <MediaModeSegment>
            <MediaModeButton
              type="button"
              aria-pressed={persisted.mediaMode === "photo"}
              onClick={() => setMediaMode("photo")}
            >
              Photo
            </MediaModeButton>
            <MediaModeButton
              type="button"
              aria-pressed={persisted.mediaMode === "audio"}
              onClick={() => setMediaMode("audio")}
            >
              Audio
            </MediaModeButton>
          </MediaModeSegment>
        </MediaMode>
        <MediaModeHint>Random photo or sound recording from iNaturalist for each round.</MediaModeHint>
        {recentForSettings.length > 0 ? (
          <>
            <PresetsHeading id="recentPairsHeading">
              Recent pairs
            </PresetsHeading>
            <PresetList aria-labelledby="recentPairsHeading">
              {recentForSettings.map((p) => {
                const k = canonicalStatsPairKey(p);
                const t = recentThumbs[k];
                return (
                  <li key={k}>
                    <PairButton
                      onClick={() => applyTaxonPair(p)}
                      aria-label={`${p.labelA} / ${p.labelB} (recent pair)`}
                    >
                      <Taxon src={t?.a}>
                        {p.labelA}
                      </Taxon>
                      <Taxon src={t?.b}>
                        {p.labelB}
                      </Taxon>
                    </PairButton>
                  </li>
                );
              })}
            </PresetList>
          </>
        ) : null}
        <PresetsHeading id="presetChallengesHeading">
          Some fun challenges...
        </PresetsHeading>
        <PresetList aria-labelledby="presetChallengesHeading">
          {presetRows.map((p) => (
            <li key={p.id}>
              <PairButton
                onClick={() => applyPresetById(p.id)}
                aria-label={`${p.pair.labelA} / ${p.pair.labelB} preset`}
                active={p.active}
                aria-current={p.active ? "true" : undefined}
              >
                <Taxon src={p.pair.urlA}>
                  {p.pair.labelA}
                </Taxon>
                <Taxon src={p.pair.urlB}>
                  {p.pair.labelB}
                </Taxon>
              </PairButton>
            </li>
          ))}
        </PresetList>
      </ModalInner>
    </Modal>
  );
}
