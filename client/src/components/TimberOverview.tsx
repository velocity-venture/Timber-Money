import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, Zap, TreePine, Bug } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialStats {
  totalAssets: number;
  totalDebts: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
}

export function TimberOverview() {
  const { data: stats, isLoading } = useQuery<FinancialStats>({
    queryKey: ["/api/financial-stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: documents } = useQuery({
    queryKey: ["/api/documents"],
  });

  const documentCount = Array.isArray(documents) ? documents.length : 0;
  const processedDocs = Array.isArray(documents)
    ? documents.filter((doc: any) => doc.status === "completed").length
    : 0;

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-20 bg-muted/50" />
            <CardContent className="h-24 bg-muted/30" />
          </Card>
        ))}
      </div>
    );
  }

  const totalAssets = stats?.totalAssets || 0;
  const totalDebts = stats?.totalDebts || 0;
  const netWorth = stats?.netWorth || totalAssets - totalDebts;
  const monthlyIncome = stats?.monthlyIncome || 0;
  const monthlyExpenses = stats?.monthlyExpenses || 0;
  const savingsRate = stats?.savingsRate || 
    (monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Hero Stats - Timber Themed */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Logs (Assets) */}
        <Card className="relative overflow-hidden border-timber-green/20 hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-timber-green/5 rounded-full -mr-16 -mt-16" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Logs (Assets)
            </CardTitle>
            <TreePine className="w-5 h-5 text-timber-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-timber-green">
              {formatCurrency(totalAssets)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Building materials for your financial dam
            </p>
          </CardContent>
        </Card>

        {/* Termites (Debt) */}
        <Card className="relative overflow-hidden border-destructive/20 hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/5 rounded-full -mr-16 -mt-16" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Termites (Debt)
            </CardTitle>
            <Bug className="w-5 h-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-destructive">
              {formatCurrency(totalDebts)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Obstacles eating away at your foundation
            </p>
          </CardContent>
        </Card>

        {/* Dam Strength (Net Worth) */}
        <Card className="relative overflow-hidden border-primary/20 hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dam Strength (Net Worth)
            </CardTitle>
            <Target className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-3xl font-bold font-mono",
              netWorth >= 0 ? "text-primary" : "text-destructive"
            )}>
              {formatCurrency(netWorth)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Your financial foundation's strength
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Monthly Timber Harvest (Income) */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Timber Harvest
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {formatCurrency(monthlyIncome)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Resources flowing in
            </p>
          </CardContent>
        </Card>

        {/* Monthly Obstacles (Expenses) */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Obstacles
            </CardTitle>
            <TrendingDown className="w-4 h-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {formatCurrency(monthlyExpenses)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Resources flowing out
            </p>
          </CardContent>
        </Card>

        {/* Dam-Building Rate (Savings Rate) */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dam-Building Rate
            </CardTitle>
            <Zap className="w-4 h-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold font-mono",
              savingsRate >= 20 ? "text-timber-green" : 
              savingsRate >= 10 ? "text-chart-4" : 
              "text-destructive"
            )}>
              {formatPercent(savingsRate)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {savingsRate >= 20 ? "Excellent progress!" :
               savingsRate >= 10 ? "Good foundation building" :
               "Let's strengthen this"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Document Processing Status */}
      <Card className="border-timber-yellow/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden">
              <img
                src="/mascot/timber_v3.png"
                alt="Timber"
                className="w-full h-full object-cover"
              />
            </div>
            Timber's Work Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Documents Processed
            </span>
            <span className="text-sm font-semibold">
              {processedDocs} / {documentCount}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-timber-green to-timber-yellow transition-all duration-500 ease-out"
              style={{
                width: documentCount > 0 ? `${(processedDocs / documentCount) * 100}%` : "0%",
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {processedDocs === documentCount && documentCount > 0
              ? "🎉 All documents processed! Your financial picture is up to date."
              : "Timber is hard at work analyzing your documents..."}
          </p>
        </CardContent>
      </Card>

      {/* Timber's Insight */}
      {netWorth > 0 && totalDebts > 0 && (
        <Card className="bg-gradient-to-br from-timber-green/5 to-timber-navy/5 border-timber-green/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-timber-green">
              <div className="w-6 h-6 rounded-full bg-white/10 overflow-hidden">
                <img
                  src="/mascot/timber_v3.png"
                  alt="Timber"
                  className="w-full h-full object-cover"
                />
              </div>
              Timber's Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              {totalDebts > totalAssets * 0.5
                ? "I see some significant obstacles (debt) in your path. Let's work on clearing those termites while building up your logs (assets). Remember, every payment is progress!"
                : totalDebts > totalAssets * 0.2
                ? "Your dam is looking strong! You're managing your obstacles well. Keep up the steady progress on clearing those termites while growing your log pile."
                : "Excellent work! Your financial foundation is solid. With minimal termites and a strong log pile, you're well-positioned for future growth. Let's focus on dam-building (savings) now!"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
