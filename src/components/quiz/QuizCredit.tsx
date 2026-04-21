interface QuizCreditProps {
  login: string;
  kind: "photo" | "audio";
}

export function QuizCredit({ login, kind }: QuizCreditProps) {
  const safe = login.trim();
  if (!safe) return null;

  const prefix =
    kind === "photo" ? "Photo via iNaturalist · observer " : "Recording via iNaturalist · observer ";

  return (
    <p className="credit">
      {prefix}
      {safe === "unknown" ? (
        `@${safe}`
      ) : (
        <a
          className="credit-link"
          href={`https://www.inaturalist.org/observations?user_id=${encodeURIComponent(safe)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          @{safe}
        </a>
      )}
    </p>
  );
}
