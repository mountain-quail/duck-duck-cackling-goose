import { useOpenSettings } from "../../hooks/useOpenSettings";
import { useStatsModal } from "../../hooks/useStatsModal";
import { IconChart, IconGear } from "./QuizIcons";

export function QuizHeader() {
  const { openStats } = useStatsModal();
  const openSettings = useOpenSettings();

  return (
    <header className="header">
      <h1 className="title">Duck Duck Cackling Goose</h1>
      <div className="header-actions">
        <button
          type="button"
          className="icon-btn"
          aria-label="Choose species pair"
          title="Species pair"
          onClick={openSettings}
        >
          <IconGear />
        </button>
        <button
          type="button"
          className="icon-btn stats-trigger"
          aria-label="Open statistics"
          title="Statistics"
          onClick={openStats}
        >
          <IconChart />
        </button>
      </div>
    </header>
  );
}
