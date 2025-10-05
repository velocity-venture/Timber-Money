import { CreditReportSummary } from "../CreditReportSummary";

export default function CreditReportSummaryExample() {
  const factors = [
    {
      name: "Payment History",
      status: "good" as const,
      impact: "No late payments in 24 months - excellent!",
      percentage: 35,
    },
    {
      name: "Credit Utilization",
      status: "fair" as const,
      impact: "Using 42% of available credit - try to keep below 30%",
      percentage: 30,
    },
    {
      name: "Credit Age",
      status: "good" as const,
      impact: "Average age of 8.5 years is healthy",
      percentage: 15,
    },
    {
      name: "Credit Mix",
      status: "good" as const,
      impact: "Good variety of credit types",
      percentage: 10,
    },
  ];

  return (
    <CreditReportSummary
      score={728}
      factors={factors}
      accounts={{
        total: 12,
        open: 8,
        closed: 4,
      }}
      inquiries={2}
    />
  );
}
