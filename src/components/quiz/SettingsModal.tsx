import type { MouseEvent } from "react";
import { useEffect, useMemo, useState } from "react";
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
    <dialog
      ref={settingsDialogRef}
      className="modal"
      aria-labelledby="settingsTitle"
      aria-describedby="settingsSub"
      onClick={(e: MouseEvent<HTMLDialogElement>) => {
        if (e.target === settingsDialogRef.current) closeSettings();
      }}
    >
      <div className="modal-inner">
        <div className="modal-header">
          <div className="modal-header-text">
            <h2 id="settingsTitle" className="modal-title">
              Pick your pair
            </h2>
            <p id="settingsSub" className="settings-sub">
              Swap out one of the taxons for a custom challenge
            </p>
          </div>
          <button type="button" className="icon-btn modal-close" aria-label="Close" onClick={closeSettings}>
            <IconClose />
          </button>
        </div>
        <div className="taxon-pick-row" role="group" aria-label="Current species pair">
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
        </div>
        <div className="media-mode" role="group" aria-labelledby="mediaModeLabel">
          <div className="media-mode-label" id="mediaModeLabel">
            Game mode
          </div>
          <div className="media-mode-segment">
            <button
              type="button"
              className="media-mode-btn"
              aria-pressed={persisted.mediaMode === "photo"}
              onClick={() => setMediaMode("photo")}
            >
              Photo
            </button>
            <button
              type="button"
              className="media-mode-btn"
              aria-pressed={persisted.mediaMode === "audio"}
              onClick={() => setMediaMode("audio")}
            >
              Audio
            </button>
          </div>
        </div>
        <p className="media-mode-hint">Random photo or sound recording from iNaturalist for each round.</p>
        {recentForSettings.length > 0 ? (
          <>
            <p className="presets-heading" id="recentPairsHeading">
              Recent pairs
            </p>
            <ul className="preset-list" aria-labelledby="recentPairsHeading">
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
            </ul>
          </>
        ) : null}
        <p className="presets-heading" id="presetChallengesHeading">
          Some fun challenges...
        </p>
        <ul className="preset-list" aria-labelledby="presetChallengesHeading">
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
        </ul>
      </div>
    </dialog>
  );
}
