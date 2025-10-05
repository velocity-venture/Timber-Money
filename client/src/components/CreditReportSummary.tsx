import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, XCircle, TrendingUp } from "lucide-react";

interface CreditFactor {
  name: string;
  status: "good" | "fair" | "poor";
  impact: string;
  percentage: number;
}

interface CreditReportSummaryProps {
  score: number;
  factors: CreditFactor[];
  accounts: {
    total: number;
    open: number;
    closed: number;
  };
  inquiries: number;
}

export function CreditReportSummary({
  score,
  factors,
  accounts,
  inquiries,
}: CreditReportSummaryProps) {
  const getScoreColor = (score: number) => {
    if (score >= 750) return "text-chart-2";
    if (score >= 650) return "text-chart-4";
    return "text-destructive";
  };

  const getScoreRating = (score: number) => {
    if (score >= 750) return "Excellent";
    if (score >= 700) return "Good";
    if (score >= 650) return "Fair";
    return "Poor";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle2 className="w-4 h-4 text-chart-2" />;
      case "fair":
        return <AlertCircle className="w-4 h-4 text-chart-4" />;
      case "poor":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <Card data-testid="card-credit-report">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Credit Report Summary</span>
          <Badge variant="outline">Updated Today</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-2">Credit Score</p>
          <p className={`text-6xl font-mono font-bold ${getScoreColor(score)}`}>
            {score}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="outline">{getScoreRating(score)}</Badge>
            <div className="flex items-center gap-1 text-xs text-chart-2">
              <TrendingUp className="w-3 h-3" />
              <span>+12 this month</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-mono font-bold">{accounts.total}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Accounts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-mono font-bold">{accounts.open}</p>
            <p className="text-xs text-muted-foreground mt-1">Open Accounts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-mono font-bold">{inquiries}</p>
            <p className="text-xs text-muted-foreground mt-1">Hard Inquiries</p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold">Credit Score Factors</h4>
          {factors.map((factor, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(factor.status)}
                  <span className="text-sm font-medium">{factor.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {factor.percentage}% impact
                </span>
              </div>
              <Progress value={factor.percentage} className="h-1.5" />
              <p className="text-xs text-muted-foreground">{factor.impact}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
