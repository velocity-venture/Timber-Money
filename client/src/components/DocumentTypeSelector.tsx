import { Card } from "@/components/ui/card";
import { 
  FileText, 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  Receipt,
  Building 
} from "lucide-react";
import { useState } from "react";

interface DocumentType {
  id: string;
  name: string;
  description: string;
  icon: any;
  examples: string[];
}

const documentTypes: DocumentType[] = [
  {
    id: "bank-statements",
    name: "Bank Statements",
    description: "Checking and savings account statements",
    icon: Building,
    examples: ["PDF statements", "Transaction history", "Account summaries"],
  },
  {
    id: "credit-cards",
    name: "Credit Card Statements",
    description: "Credit card bills and statements",
    icon: CreditCard,
    examples: ["Monthly statements", "Transaction details", "Balance info"],
  },
  {
    id: "credit-reports",
    name: "Credit Reports",
    description: "Full credit bureau reports",
    icon: FileText,
    examples: ["Experian", "Equifax", "TransUnion", "Credit Karma"],
  },
  {
    id: "loans",
    name: "Loan Documents",
    description: "Mortgage, auto, student, personal loans",
    icon: Receipt,
    examples: ["Loan statements", "Amortization schedules", "Payoff quotes"],
  },
  {
    id: "investments",
    name: "Investment Statements",
    description: "Brokerage, retirement, and portfolio statements",
    icon: TrendingUp,
    examples: ["401(k)", "IRA", "Brokerage accounts", "Stock portfolios"],
  },
  {
    id: "income",
    name: "Income Documents",
    description: "Paystubs and income verification",
    icon: DollarSign,
    examples: ["Pay stubs", "W-2 forms", "1099 forms", "Tax returns"],
  },
];

interface DocumentTypeSelectorProps {
  onSelect: (typeId: string) => void;
  selectedType?: string;
}

export function DocumentTypeSelector({ onSelect, selectedType }: DocumentTypeSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {documentTypes.map((type) => {
        const Icon = type.icon;
        const isSelected = selectedType === type.id;
        
        return (
          <Card
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`
              p-4 cursor-pointer transition-all hover-elevate
              ${isSelected ? "border-primary bg-primary/5" : ""}
            `}
            data-testid={`doc-type-${type.id}`}
          >
            <div className="flex items-start gap-3">
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"}
              `}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1">{type.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {type.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {type.examples.slice(0, 2).map((example, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
