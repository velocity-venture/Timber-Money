import { AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface LegalDisclaimerProps {
  variant?: "default" | "compact" | "footer";
  className?: string;
}

export function LegalDisclaimer({ variant = "default", className }: LegalDisclaimerProps) {
  if (variant === "compact") {
    return (
      <div className={cn("text-xs text-muted-foreground italic", className)}>
        <Info className="w-3 h-3 inline mr-1" />
        For informational purposes only. Not financial, tax, or legal advice. Consult a professional advisor.
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={cn("text-xs text-muted-foreground leading-relaxed", className)}>
        <p className="mb-2">
          <strong>Important Disclaimer:</strong> Timber Money and Timber the Beaver provide general financial information and educational content only.
          This is not financial, investment, tax, or legal advice. We do not provide personalized recommendations for specific financial products or strategies.
        </p>
        <p className="mb-2">
          All financial decisions should be made after consulting with qualified professionals including certified financial planners, tax advisors, and attorneys who understand your specific situation.
          Past performance does not guarantee future results. All investments carry risk.
        </p>
        <p>
          By using Timber Money, you acknowledge that you are responsible for your own financial decisions and that Timber Money, its creators, and affiliates are not liable for any financial losses or damages resulting from your use of this service.
        </p>
      </div>
    );
  }

  return (
    <Alert className={cn("border-timber-yellow/30 bg-timber-yellow/5", className)}>
      <AlertTriangle className="h-4 w-4 text-timber-yellow" />
      <AlertTitle className="text-sm font-semibold">Important Financial Disclaimer</AlertTitle>
      <AlertDescription className="text-xs leading-relaxed mt-2">
        <p className="mb-2">
          <strong>Timber Money provides general financial information and educational content only.</strong> This is not financial, investment, tax, or legal advice. 
          We do not provide personalized recommendations for specific financial products or strategies.
        </p>
        <p className="mb-2">
          All content is for informational purposes and should not be relied upon as the sole basis for financial decisions. 
          Before implementing any financial strategy, you should:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-2 ml-2">
          <li>Consult with a certified financial planner or advisor</li>
          <li>Speak with your accountant or tax professional</li>
          <li>Review with legal counsel if appropriate</li>
          <li>Consider your unique financial situation and goals</li>
        </ul>
        <p className="mb-2">
          <strong>No Guarantees:</strong> Past performance does not guarantee future results. All investments and financial strategies carry risk, including the potential loss of principal.
        </p>
        <p>
          <strong>Your Responsibility:</strong> By using Timber Money, you acknowledge that you are responsible for your own financial decisions. 
          Timber Money, its creators, affiliates, and Timber the Beaver (yes, even the beaver!) are not liable for any financial losses, damages, or consequences resulting from your use of this service or reliance on its content.
        </p>
      </AlertDescription>
    </Alert>
  );
}

// Specific disclaimer for AI advice
export function AIAdviceDisclaimer({ className }: { className?: string }) {
  return (
    <Alert className={cn("border-timber-green/30 bg-timber-green/5", className)}>
      <div className="h-5 w-5 rounded-full overflow-hidden">
        <img
          src="/mascot/timber_v2.png"
          alt="Timber"
          className="w-full h-full object-cover"
        />
      </div>
      <AlertTitle className="text-sm font-semibold">About Timber's AI Guidance</AlertTitle>
      <AlertDescription className="text-xs leading-relaxed mt-2">
        <p className="mb-2">
          Timber uses artificial intelligence to analyze your financial documents and provide general guidance. While Timber is trained on financial best practices, 
          <strong> AI can make mistakes and may not understand the nuances of your specific situation.</strong>
        </p>
        <p className="mb-2">
          <strong>Always verify important information</strong> and consult with qualified professionals before making significant financial decisions. 
          Timber's suggestions are starting points for your research, not definitive answers.
        </p>
        <p>
          Think of Timber as a helpful assistant who can point you in the right direction, but your accountant, financial advisor, and tax professional are your trusted experts for final decisions.
        </p>
      </AlertDescription>
    </Alert>
  );
}

// Disclaimer for debt payoff strategies
export function DebtStrategyDisclaimer({ className }: { className?: string }) {
  return (
    <Alert className={cn("border-destructive/30 bg-destructive/5", className)}>
      <AlertTriangle className="h-4 w-4 text-destructive" />
      <AlertTitle className="text-sm font-semibold">Debt Strategy Considerations</AlertTitle>
      <AlertDescription className="text-xs leading-relaxed mt-2">
        <p className="mb-2">
          Debt payoff strategies (Avalanche, Snowball, etc.) are general approaches that may not be suitable for everyone. 
          Your optimal strategy depends on many factors including:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-2 ml-2">
          <li>Interest rates and debt terms</li>
          <li>Your income stability and cash flow</li>
          <li>Emergency fund status</li>
          <li>Credit score impact</li>
          <li>Psychological factors and motivation</li>
          <li>Tax implications</li>
        </ul>
        <p>
          <strong>Before accelerating debt payments,</strong> ensure you have adequate emergency savings and aren't missing out on employer retirement matches. 
          Consult a certified financial planner to create a comprehensive plan that balances debt payoff with other financial goals.
        </p>
      </AlertDescription>
    </Alert>
  );
}

// Disclaimer for credit score advice
export function CreditScoreDisclaimer({ className }: { className?: string }) {
  return (
    <Alert className={cn("border-chart-4/30 bg-chart-4/5", className)}>
      <Info className="h-4 w-4 text-chart-4" />
      <AlertTitle className="text-sm font-semibold">Credit Score Information</AlertTitle>
      <AlertDescription className="text-xs leading-relaxed mt-2">
        <p className="mb-2">
          Credit score improvement strategies are based on general principles and may not work for everyone. 
          Results vary based on your credit history, current score, and specific circumstances.
        </p>
        <p className="mb-2">
          <strong>Important:</strong> Some credit repair tactics (like "pay-for-delete") are not guaranteed to work and may not be honored by all creditors. 
          Be wary of credit repair companies that make unrealistic promises or charge high upfront fees.
        </p>
        <p>
          For serious credit issues, consider consulting with a non-profit credit counseling agency certified by the National Foundation for Credit Counseling (NFCC) or Financial Counseling Association of America (FCAA).
        </p>
      </AlertDescription>
    </Alert>
  );
}

// Disclaimer for investment content
export function InvestmentDisclaimer({ className }: { className?: string }) {
  return (
    <Alert className={cn("border-chart-2/30 bg-chart-2/5", className)}>
      <AlertTriangle className="h-4 w-4 text-chart-2" />
      <AlertTitle className="text-sm font-semibold">Investment Information Disclaimer</AlertTitle>
      <AlertDescription className="text-xs leading-relaxed mt-2">
        <p className="mb-2">
          <strong>This is not investment advice.</strong> Timber Money does not recommend specific investments, securities, or investment strategies. 
          All investment information is for educational purposes only.
        </p>
        <p className="mb-2">
          <strong>Investments carry risk,</strong> including the potential loss of principal. Past performance is not indicative of future results. 
          Market conditions, economic factors, and individual circumstances can significantly impact investment outcomes.
        </p>
        <p>
          Before investing, consult with a registered investment advisor (RIA) or certified financial planner (CFP) who can assess your risk tolerance, time horizon, and financial goals. 
          Consider reading the prospectus and understanding all fees before investing in any product.
        </p>
      </AlertDescription>
    </Alert>
  );
}
