import { AIQuestionInterface } from "@/components/AIQuestionInterface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CreditCard, TrendingUp, DollarSign } from "lucide-react";

export default function Advisor() {
  const uploadedDocs = [
    { type: "Bank Statements", count: 3, icon: FileText },
    { type: "Credit Cards", count: 2, icon: CreditCard },
    { type: "Investment Accounts", count: 2, icon: TrendingUp },
    { type: "Pay Stubs", count: 4, icon: DollarSign },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6" data-testid="page-advisor">
      <div>
        <h1 className="text-3xl font-bold">Your AI Money Assistant</h1>
        <p className="text-muted-foreground mt-1">
          Ask anything about your finances - I manage everything so you don't have to
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Analyzed Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {uploadedDocs.map((doc) => {
              const Icon = doc.icon;
              return (
                <div
                  key={doc.type}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{doc.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.count} document{doc.count > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AIQuestionInterface />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">How I Manage Your Money 24/7</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Automated Bill Management</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Monitor all bills & payment due dates</li>
                <li>• Alert only for unusual charges</li>
                <li>• Optimize payment timing for cash flow</li>
                <li>• Negotiate better rates automatically</li>
                <li>• Cancel unused subscriptions</li>
                <li>• Track spending patterns 24/7</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Wealth Building on Autopilot</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Find & move extra money to savings</li>
                <li>• Optimize investment allocations</li>
                <li>• Rebalance portfolios automatically</li>
                <li>• Track net worth growth daily</li>
                <li>• Maximize employer benefits</li>
                <li>• Tax-loss harvesting alerts</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Smart Debt Elimination</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Strategic payoff scheduling</li>
                <li>• Interest rate optimization</li>
                <li>• Balance transfer opportunities</li>
                <li>• Credit score improvement</li>
                <li>• Consolidation analysis</li>
                <li>• Extra payment allocation</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Always-On Protection</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Fraud detection & alerts</li>
                <li>• Insurance coverage gaps</li>
                <li>• Emergency fund monitoring</li>
                <li>• Budget variance tracking</li>
                <li>• Financial goal progress</li>
                <li>• Market opportunity alerts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
