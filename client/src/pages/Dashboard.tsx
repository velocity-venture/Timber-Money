import { useState } from "react";
import { CashflowAnalysis } from "@/components/CashflowAnalysis";
import { AvalancheAutopilot } from "@/components/AvalancheAutopilot";
import { SetAndForgetStatus } from "@/components/SetAndForgetStatus";
import { DebtSummaryCard } from "@/components/DebtSummaryCard";
import { DebtCard } from "@/components/DebtCard";
import { PayoffTimeline } from "@/components/PayoffTimeline";
import { PayoffStrategyCard } from "@/components/PayoffStrategyCard";
import { AutomatedRecommendations } from "@/components/AutomatedRecommendations";
import { TimberOverview } from "@/components/TimberOverview";
import { TimberChatSidebar } from "@/components/TimberChatSidebar";
import { TimberTips } from "@/components/TimberTips";
import { DocumentList } from "@/components/DocumentList";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DollarSign, 
  TrendingDown, 
  Calendar, 
  PiggyBank, 
  FileStack,
  Sparkles,
  AlertCircle,
  Shield,
  MessageCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Fetch real data
  const { data: debts } = useQuery<any[]>({
    queryKey: ["/api/debts"],
  });
  
  const { data: documents } = useQuery<any[]>({
    queryKey: ["/api/documents"],
  });

  const { data: cashflow } = useQuery<any>({
    queryKey: ["/api/cashflow/analysis"],
  });

  const hasDocuments = documents && documents.length > 0;
  const totalDebt = debts?.reduce((sum, debt) => sum + parseFloat(debt.currentBalance), 0) || 0;
  const totalMinPayment = debts?.reduce((sum, debt) => sum + parseFloat(debt.minimumPayment), 0) || 0;

  // Mock timeline data (would be calculated from debt payoff plan)
  const timelineData = [
    { month: "Jan '25", balance: totalDebt, paid: 0 },
    { month: "Apr '25", balance: totalDebt * 0.91, paid: totalDebt * 0.09 },
    { month: "Jul '25", balance: totalDebt * 0.82, paid: totalDebt * 0.18 },
    { month: "Oct '25", balance: totalDebt * 0.72, paid: totalDebt * 0.28 },
    { month: "Jan '26", balance: totalDebt * 0.61, paid: totalDebt * 0.39 },
    { month: "Apr '26", balance: totalDebt * 0.49, paid: totalDebt * 0.51 },
    { month: "Jul '26", balance: totalDebt * 0.37, paid: totalDebt * 0.63 },
    { month: "Oct '26", balance: totalDebt * 0.24, paid: totalDebt * 0.76 },
    { month: "Jan '27", balance: totalDebt * 0.11, paid: totalDebt * 0.89 },
    { month: "Apr '27", balance: 0, paid: totalDebt },
  ];

  const strategies = [
    {
      id: "avalanche",
      name: "Debt Avalanche",
      description: "Pay off highest interest rate debts first to minimize total interest paid",
      debtFreeDate: "Aug 2028",
      totalInterest: Math.round(totalDebt * 0.17),
      monthlyPayment: totalMinPayment + (cashflow?.safeMonthlyExtra || 0),
      recommended: true,
    },
    {
      id: "snowball",
      name: "Debt Snowball",
      description: "Pay off smallest balances first for psychological wins and momentum",
      debtFreeDate: "Oct 2028",
      totalInterest: Math.round(totalDebt * 0.19),
      monthlyPayment: totalMinPayment + (cashflow?.safeMonthlyExtra || 0),
    },
    {
      id: "hybrid",
      name: "Hybrid Approach",
      description: "Balance between interest savings and quick wins",
      debtFreeDate: "Sep 2028",
      totalInterest: Math.round(totalDebt * 0.18),
      monthlyPayment: totalMinPayment + (cashflow?.safeMonthlyExtra || 0),
    },
  ];

  if (!hasDocuments) {
    return (
      <div className="space-y-6" data-testid="page-dashboard">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden">
              <img
                src="/mascot/timber_v3.png"
                alt="Timber"
                className="w-full h-full object-cover animate-timber-bounce"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome to Timber Money!</h1>
              <p className="text-muted-foreground">
                Let's build your financial foundation together
              </p>
            </div>
          </div>
        </div>

        <Card className="border-2 border-dashed border-timber-green/30 bg-timber-green/5">
          <CardContent className="py-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 overflow-hidden rounded-full bg-white/10">
              <img
                src="/mascot/timber_v3.png"
                alt="Timber the Beaver"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold mb-3">Start Your Shoebox to Autopilot Journey</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
              Hey there! I'm Timber, your financial guide. Upload your financial documents and I'll help you build a strong foundation.
              Think of it like building a dam - we'll gather your logs (assets), clear the termites (debt), and create a system that works while you sleep!
            </p>
            <Button size="lg" onClick={() => window.location.href = "/upload"} className="gap-2 bg-timber-green hover:bg-timber-green/90">
              <Sparkles className="w-4 h-4" />
              Upload Your First Document
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              No daily check-ins required • Set it once, let it work • From chaos to calm
            </p>
          </CardContent>
        </Card>

        <LegalDisclaimer variant="compact" className="text-center" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20" data-testid="page-dashboard">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
            <img
              src="/mascot/timber_v3.png"
              alt="Timber"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Timber's Dashboard</h1>
            <p className="text-muted-foreground">
              Your financial foundation is looking strong! 🦫
            </p>
          </div>
        </div>
        
        {/* Timber Chat Button */}
        <Button
          onClick={() => setIsChatOpen(true)}
          className="gap-2 bg-timber-green hover:bg-timber-green/90"
        >
          <MessageCircle className="w-4 h-4" />
          Chat with Timber
        </Button>
      </div>

      {/* Legal Disclaimer */}
      <LegalDisclaimer variant="compact" />

      {/* Status Bar */}
      <Card className="bg-gradient-to-r from-timber-green/10 via-timber-navy/10 to-timber-green/10 border-timber-green/20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="default" className="gap-1 bg-timber-green">
                <Sparkles className="w-3 h-3" />
                Autopilot Active
              </Badge>
              <span className="text-sm text-muted-foreground">
                Last analysis: {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-timber-green" />
              <span>System running smoothly - no action needed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="cashflow">Cashflow</TabsTrigger>
          <TabsTrigger value="avalanche">Avalanche</TabsTrigger>
          <TabsTrigger value="debts">Debts</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <TimberOverview />
          <DocumentList limit={5} compact={true} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <DocumentList />
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-6">
          <CashflowAnalysis />
        </TabsContent>

        <TabsContent value="avalanche" className="space-y-6">
          <AvalancheAutopilot />
        </TabsContent>

        <TabsContent value="debts" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>Your Debt Portfolio</span>
              <span className="text-sm text-muted-foreground font-normal">
                (Timber calls these "Termites" 🐛)
              </span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {debts?.map((debt) => (
                <DebtCard
                  key={debt.id}
                  creditor={debt.creditor}
                  balance={parseFloat(debt.currentBalance)}
                  originalBalance={parseFloat(debt.originalBalance)}
                  apr={parseFloat(debt.apr)}
                  minimumPayment={parseFloat(debt.minimumPayment)}
                  type={debt.debtType}
                />
              ))}
              {(!debts || debts.length === 0) && (
                <Card className="md:col-span-2 lg:col-span-3">
                  <CardContent className="py-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 overflow-hidden">
                      <img
                        src="/mascot/timber_v3.png"
                        alt="Timber"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-muted-foreground">
                      Upload more documents to see your complete debt portfolio
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          <AutomatedRecommendations />
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 overflow-hidden">
                  <img src="/mascot/timber_v3.png" alt="Timber" className="w-full h-full object-cover" />
                </div>
                Export for Bank Autopay Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Download your payment schedule and import it directly into your bank's autopay system.
                Set it once and never worry about it again - that's the Timber way!
              </p>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Payment Schedule CSV</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    For importing into bank autopay systems
                  </p>
                  <Button variant="outline" className="w-full">
                    Download CSV
                  </Button>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Autopay Script</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Step-by-step setup instructions
                  </p>
                  <Button variant="outline" className="w-full">
                    View Instructions
                  </Button>
                </Card>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Your Monthly Autopay Settings</h4>
                  <div className="space-y-2 text-sm">
                    {debts?.map((debt) => (
                      <div key={debt.id} className="flex justify-between py-2 border-b last:border-0">
                        <span className="text-muted-foreground">{debt.creditor}</span>
                        <span className="font-mono font-semibold">
                          ${(parseFloat(debt.minimumPayment) + ((cashflow?.safeMonthlyExtra || 0) / (debts?.length || 1))).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 font-semibold">
                      <span>Total Monthly</span>
                      <span className="font-mono text-primary">
                        ${(totalMinPayment + (cashflow?.safeMonthlyExtra || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Timber Chat Sidebar */}
      <TimberChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Timber Tips (auto-showing) */}
      <TimberTips autoShow={true} showInterval={60000} />
    </div>
  );
}
