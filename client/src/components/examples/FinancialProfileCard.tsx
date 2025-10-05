import { FinancialProfileCard } from "../FinancialProfileCard";

export default function FinancialProfileCardExample() {
  return (
    <FinancialProfileCard
      totalAssets={285000}
      totalLiabilities={72700}
      monthlyIncome={6500}
      monthlyExpenses={5195}
    />
  );
}
