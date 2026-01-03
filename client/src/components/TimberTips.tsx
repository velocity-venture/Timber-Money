import { useState, useEffect } from "react";
import { X, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimberTip {
  id: string;
  title: string;
  message: string;
  category: "savings" | "debt" | "budget" | "general";
  icon?: string;
}

const TIMBER_TIPS: TimberTip[] = [
  {
    id: "dam-building-1",
    title: "Dam-Building Basics",
    message: "Start small! Even saving $50 per month builds a strong foundation over time. Every log counts when building your financial dam.",
    category: "savings",
  },
  {
    id: "termite-control-1",
    title: "Termite Control Strategy",
    message: "Focus on high-interest debt first (Avalanche method). It's like treating the most aggressive termites before they cause more damage!",
    category: "debt",
  },
  {
    id: "resource-flow-1",
    title: "Managing Resource Flow",
    message: "Track where your timber (money) goes! The 50/30/20 rule is a great starting point: 50% needs, 30% wants, 20% savings.",
    category: "budget",
  },
  {
    id: "foundation-check-1",
    title: "Foundation Inspection",
    message: "Review your financial picture monthly. Regular inspections help catch small issues before they become big problems!",
    category: "general",
  },
  {
    id: "emergency-stockpile-1",
    title: "Emergency Stockpile",
    message: "Build an emergency fund of 3-6 months expenses. It's like storing extra logs for winter - you'll be glad you did!",
    category: "savings",
  },
  {
    id: "snowball-method-1",
    title: "Snowball Success",
    message: "Pay off smallest debts first for quick wins! Each cleared obstacle boosts your motivation to tackle the next one.",
    category: "debt",
  },
  {
    id: "automation-power-1",
    title: "Automation is Your Friend",
    message: "Set up automatic transfers to savings. It's like having a team of beavers working while you sleep!",
    category: "savings",
  },
  {
    id: "expense-tracking-1",
    title: "Know Your Obstacles",
    message: "Small expenses add up! That daily coffee might be costing you $150/month. Awareness is the first step to control.",
    category: "budget",
  },
];

interface TimberTipsProps {
  className?: string;
  autoShow?: boolean;
  showInterval?: number; // milliseconds between auto-showing tips
}

export function TimberTips({ 
  className, 
  autoShow = true, 
  showInterval = 60000 // Default: show a tip every 60 seconds
}: TimberTipsProps) {
  const [currentTip, setCurrentTip] = useState<TimberTip | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shownTips, setShownTips] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!autoShow) return;

    const showRandomTip = () => {
      // Filter out already shown tips
      const availableTips = TIMBER_TIPS.filter(tip => !shownTips.has(tip.id));
      
      // Reset if all tips have been shown
      if (availableTips.length === 0) {
        setShownTips(new Set<string>());
        return;
      }

      const randomTip = availableTips[Math.floor(Math.random() * availableTips.length)];
      setCurrentTip(randomTip);
      setIsVisible(true);
      setShownTips(prev => {
        const next = new Set(prev);
        next.add(randomTip.id);
        return next;
      });

      // Auto-hide after 10 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 10000);
    };

    // Show first tip after a short delay
    const initialTimeout = setTimeout(showRandomTip, 5000);

    // Then show tips at regular intervals
    const interval = setInterval(showRandomTip, showInterval);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [autoShow, showInterval, shownTips]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!currentTip || !isVisible) return null;

  const categoryColors = {
    savings: "border-timber-green bg-timber-green/5",
    debt: "border-destructive bg-destructive/5",
    budget: "border-chart-4 bg-chart-4/5",
    general: "border-primary bg-primary/5",
  };

  const categoryIcons = {
    savings: "💰",
    debt: "🐛",
    budget: "📊",
    general: "💡",
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-30 max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-500",
        className
      )}
    >
      <div
        className={cn(
          "relative rounded-xl border-2 shadow-xl backdrop-blur-sm p-4",
          categoryColors[currentTip.category]
        )}
      >
        {/* Timber Mascot */}
        <div className="absolute -top-8 -left-8 w-16 h-16 animate-timber-bounce">
          <div className="w-full h-full rounded-full overflow-hidden">
            <img
              src="/mascot/timber_v6.png"
              alt="Timber"
              className="w-full h-full object-cover drop-shadow-lg"
            />
          </div>
        </div>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-2 right-2 h-6 w-6 rounded-full hover:bg-background/20"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Content */}
        <div className="pt-2 pr-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{categoryIcons[currentTip.category]}</span>
            <h3 className="font-bold text-sm text-foreground">
              {currentTip.title}
            </h3>
          </div>
          
          <p className="text-sm text-foreground/90 leading-relaxed">
            {currentTip.message}
          </p>

          {/* Timber's signature */}
          <div className="mt-3 pt-2 border-t border-current/10">
            <p className="text-xs text-muted-foreground italic">
              — Timber the Beaver 🦫
            </p>
          </div>
        </div>

        {/* Animated indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-current/20 rounded-b-xl overflow-hidden">
          <div
            className="h-full bg-current/50 animate-pulse"
            style={{
              animation: "shrink 10s linear forwards",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

// Manual trigger component for specific contexts
interface ManualTimberTipProps {
  tip: TimberTip;
  onClose?: () => void;
}

export function ManualTimberTip({ tip, onClose }: ManualTimberTipProps) {
  const categoryColors = {
    savings: "border-timber-green bg-timber-green/5",
    debt: "border-destructive bg-destructive/5",
    budget: "border-chart-4 bg-chart-4/5",
    general: "border-primary bg-primary/5",
  };

  const categoryIcons = {
    savings: "💰",
    debt: "🐛",
    budget: "📊",
    general: "💡",
  };

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 p-4 mb-4",
        categoryColors[tip.category]
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden">
          <img
            src="/mascot/timber_v6.png"
            alt="Timber"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{categoryIcons[tip.category]}</span>
            <h4 className="font-semibold text-sm">{tip.title}</h4>
          </div>
          <p className="text-sm text-foreground/90">{tip.message}</p>
        </div>

        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Export tips for use in other components
export { TIMBER_TIPS };
export type { TimberTip };
