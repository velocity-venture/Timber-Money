import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Home, Car, Briefcase, PiggyBank } from "lucide-react";

interface AssetCardProps {
  name: string;
  value: number;
  type: "property" | "vehicle" | "investment" | "savings";
  details?: string;
  growth?: number;
}

export function AssetCard({ name, value, type, details, growth }: AssetCardProps) {
  const icons = {
    property: Home,
    vehicle: Car,
    investment: Briefcase,
    savings: PiggyBank,
  };

  const colors = {
    property: "bg-chart-1/10 text-chart-1",
    vehicle: "bg-chart-2/10 text-chart-2",
    investment: "bg-chart-3/10 text-chart-3",
    savings: "bg-chart-4/10 text-chart-4",
  };

  const Icon = icons[type];

  return (
    <Card data-testid={`asset-${name.toLowerCase().replace(/\s/g, "-")}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${colors[type]} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base">{name}</h3>
            <p className="text-xs text-muted-foreground capitalize">{type}</p>
          </div>
        </div>
        {growth !== undefined && (
          <Badge variant={growth >= 0 ? "default" : "destructive"} className="text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            {growth > 0 ? "+" : ""}{growth}%
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Current Value</span>
          <span className="text-2xl font-mono font-semibold">
            ${value.toLocaleString()}
          </span>
        </div>
        {details && (
          <p className="text-xs text-muted-foreground pt-2 border-t border-border">
            {details}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
