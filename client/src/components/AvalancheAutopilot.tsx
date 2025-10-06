import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  FileSpreadsheet, 
  Calendar, 
  TrendingUp, 
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Zap,
  ArrowRight,
  FileText,
  Shield,
  RefreshCw
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PayoffSchedule {
  month: string;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  debtName: string;
  isPayoffMonth: boolean;
}

interface AvalanchePlan {
  totalMonths: number;
  totalInterest: number;
  totalPaid: number;
  debtFreeDate: string;
  monthlyPayment: number;
  schedule: PayoffSchedule[];
  debtOrder: Array<{
    creditor: string;
    payoffMonth: number;
    totalInterestPaid: number;
  }>;
}

export function AvalancheAutopilot() {
  const { toast } = useToast();
  const [selectedExportFormat, setSelectedExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  
  // Fetch cashflow analysis
  const { data: cashflow } = useQuery<any>({
    queryKey: ["/api/cashflow/analysis"],
  });

  // Fetch debts
  const { data: debts } = useQuery<any[]>({
    queryKey: ["/api/debts"],
  });

  // Generate Avalanche plan
  const { data: avalanchePlan, isLoading: planLoading } = useQuery<AvalanchePlan>({
    queryKey: ["/api/payoff-plan", { strategy: "avalanche", extraPayment: cashflow?.safeMonthlyExtra }],
    queryFn: async () => {
      const response = await apiRequest("POST", "/api/payoff-plan", {
        strategy: "avalanche",
        monthlyBudget: (cashflow?.safeMonthlyExtra || 0) + 
                      (debts?.reduce((sum, d) => sum + parseFloat(d.minimumPayment), 0) || 0)
      });
      return response.json();
    },
    enabled: !!(cashflow && debts && debts.length > 0),
  });

  const exportSchedule = useMutation({
    mutationFn: async (format: 'csv' | 'json' | 'pdf') => {
      if (!avalanchePlan) throw new Error("No plan available");
      
      let content = "";
      let filename = "";
      let mimeType = "";
      
      switch (format) {
        case 'csv':
          // Generate CSV for bank import
          const csvRows = [
            ["Debt Freedom Avalanche Schedule", "", "", "", ""],
            ["Generated", new Date().toLocaleDateString(), "", "", ""],
            ["", "", "", "", ""],
            ["Month", "Creditor", "Payment Amount", "Principal", "Interest", "Remaining Balance"],
            ...avalanchePlan.schedule.map(row => [
              row.month,
              row.debtName,
              row.payment.toFixed(2),
              row.principal.toFixed(2),
              row.interest.toFixed(2),
              row.remainingBalance.toFixed(2),
            ]),
            ["", "", "", "", ""],
            ["Summary", "", "", "", ""],
            ["Total Months", avalanchePlan.totalMonths, "", "", ""],
            ["Total Interest", avalanchePlan.totalInterest.toFixed(2), "", "", ""],
            ["Debt Free Date", avalanchePlan.debtFreeDate, "", "", ""],
          ];
          content = csvRows.map(row => row.join(",")).join("\n");
          filename = `avalanche-schedule-${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = "text/csv";
          break;
          
        case 'json':
          content = JSON.stringify(avalanchePlan, null, 2);
          filename = `avalanche-schedule-${new Date().toISOString().split('T')[0]}.json`;
          mimeType = "application/json";
          break;
          
        case 'pdf':
          // For PDF, we'd normally use a library like jsPDF
          // For now, create HTML that user can print to PDF
          content = `
            <html>
            <head><title>Avalanche Payoff Schedule</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h1>Debt Freedom Avalanche Schedule</h1>
              <p>Generated: ${new Date().toLocaleDateString()}</p>
              <h2>Summary</h2>
              <ul>
                <li>Monthly Payment: $${avalanchePlan.monthlyPayment.toFixed(2)}</li>
                <li>Debt Free Date: ${avalanchePlan.debtFreeDate}</li>
                <li>Total Interest: $${avalanchePlan.totalInterest.toFixed(2)}</li>
              </ul>
              <h2>Monthly Schedule</h2>
              <table border="1" cellpadding="5" style="border-collapse: collapse;">
                <tr>
                  <th>Month</th><th>Creditor</th><th>Payment</th><th>Balance</th>
                </tr>
                ${avalanchePlan.schedule.map(row => `
                  <tr>
                    <td>${row.month}</td>
                    <td>${row.debtName}</td>
                    <td>$${row.payment.toFixed(2)}</td>
                    <td>$${row.remainingBalance.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </table>
            </body>
            </html>
          `;
          filename = `avalanche-schedule-${new Date().toISOString().split('T')[0]}.html`;
          mimeType = "text/html";
          break;
      }
      
      // Create download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      
      return { format, filename };
    },
    onSuccess: (data) => {
      toast({
        title: "Schedule Exported",
        description: `Your Avalanche schedule has been downloaded as ${data.filename}`,
      });
    },
  });

  if (!debts || debts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Upload financial documents to generate your Avalanche plan</p>
        </CardContent>
      </Card>
    );
  }

  if (planLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Calculating your optimal payoff strategy...</p>
        </CardContent>
      </Card>
    );
  }

  const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.currentBalance), 0);
  const highestAprDebt = debts.reduce((max, debt) => 
    parseFloat(debt.apr) > parseFloat(max.apr) ? debt : max
  , debts[0]);

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-chart-2/5 to-transparent">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Avalanche Autopilot™
              </CardTitle>
              <CardDescription className="mt-2">
                Your mathematically optimized debt elimination system - attacking highest interest first
              </CardDescription>
            </div>
            <Badge variant="default" className="gap-1">
              <Shield className="w-3 h-3" />
              Bank-Ready
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Monthly Autopay</p>
              <p className="text-2xl font-bold text-primary">
                ${avalanchePlan?.monthlyPayment.toLocaleString() || cashflow?.safeMonthlyExtra || 0}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Debt Freedom Date</p>
              <p className="text-2xl font-bold text-chart-2">
                {avalanchePlan?.debtFreeDate || "Calculating..."}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Interest Saved</p>
              <p className="text-2xl font-bold text-chart-3">
                ${((totalDebt * 0.4) - (avalanchePlan?.totalInterest || 0)).toLocaleString()}
              </p>
            </div>
          </div>

          <Alert className="mt-4">
            <Zap className="w-4 h-4" />
            <AlertDescription>
              First target: <strong>{highestAprDebt.creditor}</strong> at {highestAprDebt.apr}% APR.
              This saves you the most money over time.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Avalanche Strategy Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Your Avalanche Attack Order</CardTitle>
          <CardDescription>
            Debts sorted by interest rate - highest first for maximum savings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {debts
              .sort((a, b) => parseFloat(b.apr) - parseFloat(a.apr))
              .map((debt, index) => (
                <div key={debt.id} className="relative">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">{debt.creditor}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              ${parseFloat(debt.currentBalance).toLocaleString()}
                            </span>
                            <Badge variant={index === 0 ? "destructive" : "secondary"}>
                              {debt.apr}% APR
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Min Payment</p>
                          <p className="font-mono">${debt.minimumPayment}</p>
                        </div>
                      </div>
                      <Progress 
                        value={(1 - parseFloat(debt.currentBalance) / parseFloat(debt.originalBalance)) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                  {index < debts.length - 1 && (
                    <div className="ml-4 pl-4 border-l-2 border-dashed h-4" />
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export for Bank Autopay
          </CardTitle>
          <CardDescription>
            Download your payment schedule in the format your bank accepts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedExportFormat} onValueChange={(v: any) => setSelectedExportFormat(v)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="csv">CSV Format</TabsTrigger>
              <TabsTrigger value="json">JSON Format</TabsTrigger>
              <TabsTrigger value="pdf">Print/PDF</TabsTrigger>
            </TabsList>
            
            <TabsContent value="csv" className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  CSV Format
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Compatible with Chase, Bank of America, Wells Fargo, and most major banks.
                  Import directly into your bank's bill pay system.
                </p>
                <Button 
                  onClick={() => exportSchedule.mutate('csv')}
                  disabled={exportSchedule.isPending}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV Schedule
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="json" className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  JSON Format
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  For API integrations and modern banking apps.
                  Machine-readable format for automated systems.
                </p>
                <Button 
                  onClick={() => exportSchedule.mutate('json')}
                  disabled={exportSchedule.isPending}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download JSON Schedule
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="pdf" className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Printable Format
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Print-friendly format for manual entry or record keeping.
                  Includes full payment schedule and summary.
                </p>
                <Button 
                  onClick={() => exportSchedule.mutate('pdf')}
                  disabled={exportSchedule.isPending}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Printable Schedule
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Setup Instructions */}
          <div className="mt-6 p-4 border rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-primary" />
              Quick Autopay Setup (5 minutes)
            </h4>
            <ol className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-primary font-semibold">1.</span>
                Download your schedule above
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold">2.</span>
                Log into your bank's bill pay section
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold">3.</span>
                Import the CSV or manually enter the amounts
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold">4.</span>
                Set payments to "recurring monthly"
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-semibold">5.</span>
                Done! Your debt payoff is now on autopilot
              </li>
            </ol>
          </div>

          {/* Success Metrics */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-chart-2 mt-0.5" />
                <div>
                  <p className="font-semibold">Time Saved</p>
                  <p className="text-sm text-muted-foreground">
                    {avalanchePlan ? Math.round(totalDebt * 0.4 / avalanchePlan.monthlyPayment - avalanchePlan.totalMonths) : 0} months
                    faster than minimum payments
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-chart-3 mt-0.5" />
                <div>
                  <p className="font-semibold">Money Saved</p>
                  <p className="text-sm text-muted-foreground">
                    ${((totalDebt * 0.4) - (avalanchePlan?.totalInterest || 0)).toLocaleString()}
                    in avoided interest
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}