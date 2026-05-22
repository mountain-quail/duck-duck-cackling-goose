import styled from "styled-components";
import { useOpenSettings } from "../../hooks/useOpenSettings";
import { useStatsModal } from "../../hooks/useStatsModal";
import { IconChart, IconGear } from "./QuizIcons";

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(1.15rem, 4vw, 1.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
`;

const IconButton = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: var(--surface-elevated);
    color: var(--text);
  }
`;

export function QuizHeader() {
  const { openStats } = useStatsModal();
  const openSettings = useOpenSettings();

  return (
    <Header>
      <Title>Duck Duck Cackling Goose</Title>
      <HeaderActions>
        <IconButton type="button" aria-label="Choose species pair" title="Species pair" onClick={openSettings}>
          <IconGear />
        </IconButton>
        <IconButton type="button" aria-label="Open statistics" title="Statistics" onClick={openStats}>
          <IconChart />
        </IconButton>
      </HeaderActions>
    </Header>
  );
}
