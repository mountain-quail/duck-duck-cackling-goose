import { useRoundDisplay } from "../../hooks/useRoundDisplay";
import { QuizCredit } from "./QuizCredit";

export function QuizCreditBar() {
  const { creditLogin, creditKind } = useRoundDisplay();
  if (creditLogin == null || creditLogin === "" || creditKind == null) return null;
  return <QuizCredit login={creditLogin} kind={creditKind} />;
}
