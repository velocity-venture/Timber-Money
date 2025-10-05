import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  Sparkles,
  TrendingDown,
  FileText,
  CreditCard,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background" data-testid="page-landing">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <TrendingDown className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">Debt Freedom</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild data-testid="button-pricing-header">
              <a href="/pricing">Pricing</a>
            </Button>
            <Button asChild data-testid="button-login">
              <a href="/api/login">Sign In</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <section className="text-center mb-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-chart-2/10 blur-3xl opacity-50 -z-10"></div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>AI-Powered Financial Freedom</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 max-w-4xl mx-auto bg-gradient-to-r from-foreground via-primary/90 to-foreground bg-clip-text text-transparent animate-fade-in">
            Take Control of Your Finances with AI
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay">
            Upload your financial documents and get a personalized debt payoff
            plan, credit analysis, and professional financial guidance — all
            powered by advanced AI technology.
          </p>
          <div className="flex gap-4 justify-center animate-fade-in-delay-2">
            <Button size="lg" className="shadow-xl hover:shadow-2xl transition-shadow" asChild data-testid="button-get-started">
              <a href="/api/login">
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started Free
              </a>
            </Button>
            <Button size="lg" variant="outline" className="backdrop-blur-sm" data-testid="button-learn-more">
              Learn More
            </Button>
          </div>
          <div className="mt-8 text-sm text-muted-foreground animate-fade-in-delay-3">
            <CheckCircle2 className="w-4 h-4 inline mr-1 text-primary" />
            No credit card required • 5 free documents • Cancel anytime
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-3 mb-24">
          <Card className="relative overflow-hidden border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300 hover-elevate">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full"></div>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 shadow-md">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Upload Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Simply upload your bank statements, credit reports, loan
                documents, and pay stubs. Our AI analyzes everything
                automatically with bank-level security.
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-chart-2/20 shadow-lg hover:shadow-xl transition-shadow duration-300 hover-elevate md:scale-105">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-chart-2/10 to-transparent rounded-bl-full"></div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-primary to-chart-2 text-primary-foreground text-xs font-medium rounded-full">
              Most Popular
            </div>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-chart-2 to-chart-2/80 flex items-center justify-center mb-4 shadow-md">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Advanced AI extracts your debts, assets, income, and credit
                data to build a complete financial profile in seconds.
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-chart-3/20 shadow-lg hover:shadow-xl transition-shadow duration-300 hover-elevate">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-chart-3/10 to-transparent rounded-bl-full"></div>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-chart-3 to-chart-3/80 flex items-center justify-center mb-4 shadow-md">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Get Your Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Receive a personalized debt payoff strategy that saves you
                money and gets you debt-free faster than ever.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {[
              {
                icon: CreditCard,
                title: "Credit Report Analysis",
                description:
                  "Upload your credit report and get insights on improving your score",
              },
              {
                icon: BarChart3,
                title: "Asset & Liability Tracking",
                description:
                  "Complete financial profile with all your assets and debts",
              },
              {
                icon: TrendingDown,
                title: "Debt Payoff Strategies",
                description:
                  "Compare avalanche, snowball, and hybrid payoff methods",
              },
              {
                icon: Sparkles,
                title: "AI Financial Advisor",
                description:
                  "Ask questions and get personalized advice based on your finances",
              },
              {
                icon: Shield,
                title: "Bank-Level Security",
                description:
                  "Your data is encrypted and never permanently stored",
              },
              {
                icon: FileText,
                title: "Financial Statements",
                description:
                  "Generate professional financial reports for loans or planning",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="relative bg-gradient-to-r from-primary/10 via-chart-2/10 to-primary/10 rounded-3xl p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5 animate-pulse"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Ready to Achieve Financial Freedom?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of users who are taking control of their finances
              with AI-powered insights and personalized guidance. Start your journey today.
            </p>
            <div className="flex gap-4 justify-center items-center">
              <Button size="lg" className="shadow-xl hover:shadow-2xl transition-all" asChild data-testid="button-cta">
                <a href="/api/login">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Your Journey Free
                </a>
              </Button>
              <div className="text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 inline mr-1 text-primary" />
                Free forever • No credit card
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex gap-6 justify-center mb-4">
            <a href="/privacy" className="hover:text-foreground" data-testid="link-privacy">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-foreground" data-testid="link-terms">
              Terms of Service
            </a>
            <a href="/pricing" className="hover:text-foreground" data-testid="link-pricing-footer">
              Pricing
            </a>
          </div>
          <p>&copy; 2025 Debt Freedom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
