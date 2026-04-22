import { useRoundCredit } from "../../hooks/useRoundCredit";
import { QuizCredit } from "./QuizCredit";

export function QuizCreditBar() {
  const { creditLogin, creditKind } = useRoundCredit();
  if (creditLogin == null || creditLogin === "" || creditKind == null) return null;
  return <QuizCredit login={creditLogin} kind={creditKind} />;
}
