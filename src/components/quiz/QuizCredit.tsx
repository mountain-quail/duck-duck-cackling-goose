import styled from "styled-components";

interface QuizCreditProps {
  login: string;
  kind: "photo" | "audio";
}

const Credit = styled.p`
  margin: 0.6rem 0 0;
  padding: 0 1rem;
  font-size: 0.72rem;
  color: var(--text-muted);
  text-align: center;
  min-height: 1.2em;

  @media (min-width: 640px) {
    padding: 0;
  }
`;

const CreditLink = styled.a`
  color: var(--accent-canada);
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: #0f5a32;
  }
`;

export function QuizCredit({ login, kind }: QuizCreditProps) {
  const safe = login.trim();
  if (!safe) return null;

  const prefix =
    kind === "photo" ? "Photo via iNaturalist · observer " : "Recording via iNaturalist · observer ";

  return (
    <Credit>
      {prefix}
      {safe === "unknown" ? (
        `@${safe}`
      ) : (
        <CreditLink
          href={`https://www.inaturalist.org/observations?user_id=${encodeURIComponent(safe)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          @{safe}
        </CreditLink>
      )}
    </Credit>
  );
}
