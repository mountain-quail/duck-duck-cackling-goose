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

function useRecentPairThumbnails(pairs: TaxonPair[]) {
  const keys = useMemo(() => pairs.map((p) => canonicalStatsPairKey(p)).join("|"), [pairs]);
  const [byKey, setByKey] = useState<Record<string, { a: string | null; b: string | null }>>({});
  useEffect(() => {
    if (pairs.length === 0) {
      setByKey({});
      return;
    }
    let cancelled = false;
    void (async () => {
      const next: Record<string, { a: string | null; b: string | null }> = {};
      await Promise.all(
        pairs.map(async (pair) => {
          const k = canonicalStatsPairKey(pair);
          const [ta, tb] = await Promise.all([fetchTaxonById(pair.idA), fetchTaxonById(pair.idB)]);
          next[k] = {
            a: ta ? taxonSquareUrl(ta) : null,
            b: tb ? taxonSquareUrl(tb) : null,
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
                    <button
                      type="button"
                      className="preset-btn"
                      aria-label={`${p.labelA} / ${p.labelB} (recent pair)`}
                      onClick={() => applyTaxonPair(p)}
                    >
                      <span className="preset-btn-sr">
                        {p.labelA} / {p.labelB}
                      </span>
                      {t?.a ? (
                        <img className="preset-btn-img preset-btn-img--a" src={t.a} alt="" decoding="async" />
                      ) : (
                        <span
                          className="preset-btn-img preset-btn-img--a preset-btn-img--placeholder"
                          aria-hidden
                        />
                      )}
                      <span className="preset-btn-mid">
                        <span className="preset-btn-name preset-btn-name--a">{p.labelA}</span>
                        <span className="preset-btn-sep"> / </span>
                        <span className="preset-btn-name preset-btn-name--b">{p.labelB}</span>
                      </span>
                      {t?.b ? (
                        <img className="preset-btn-img preset-btn-img--b" src={t.b} alt="" decoding="async" />
                      ) : (
                        <span
                          className="preset-btn-img preset-btn-img--b preset-btn-img--placeholder"
                          aria-hidden
                        />
                      )}
                    </button>
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
              <button
                type="button"
                className={`preset-btn${p.active ? " preset-btn--active" : ""}`}
                aria-label={`${p.pair.labelA} / ${p.pair.labelB} preset`}
                aria-current={p.active ? "true" : undefined}
                onClick={() => applyPresetById(p.id)}
              >
                <span className="preset-btn-sr">{p.title}</span>
                {p.urlA ? (
                  <img className="preset-btn-img preset-btn-img--a" src={p.urlA} alt="" decoding="async" />
                ) : (
                  <span className="preset-btn-img preset-btn-img--a preset-btn-img--placeholder" aria-hidden />
                )}
                <span className="preset-btn-mid">
                  <span className="preset-btn-name preset-btn-name--a">{p.pair.labelA}</span>
                  <span className="preset-btn-sep"> / </span>
                  <span className="preset-btn-name preset-btn-name--b">{p.pair.labelB}</span>
                </span>
                {p.urlB ? (
                  <img className="preset-btn-img preset-btn-img--b" src={p.urlB} alt="" decoding="async" />
                ) : (
                  <span className="preset-btn-img preset-btn-img--b preset-btn-img--placeholder" aria-hidden />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
}
