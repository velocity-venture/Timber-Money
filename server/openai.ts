/**
 * Copyright (c) 2025 Shoebox to Autopilot. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL
 * 
 * This file contains trade secrets and proprietary business logic.
 * Unauthorized copying, reverse engineering, or distribution is strictly prohibited.
 * 
 * Implementation based on blueprint: javascript_openai
 * Hybrid model: GPT-4o for paid users, GPT-4o-mini for free users
 */

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Hybrid model selection based on user subscription status
function getModelForUser(isPaidUser: boolean): string {
  return isPaidUser ? "gpt-4o" : "gpt-4o-mini";
}

export async function analyzeFinancialDocument(
  base64Image: string,
  documentType: string,
  isPaidUser: boolean = false
): Promise<{
  summary: string;
  extractedData: {
    debts?: Array<{
      creditor: string;
      balance: number;
      apr?: number;
      minimumPayment?: number;
    }>;
    assets?: Array<{
      name: string;
      type: string;
      value: number;
      details?: string;
    }>;
    income?: {
      monthlyAmount: number;
      source?: string;
    };
  };
}> {
  const model = getModelForUser(isPaidUser);

  const systemPrompt = `You are a financial document analysis assistant. Analyze the provided financial document and extract relevant information.

For ${documentType} documents, extract:
- Account holder information
- Balance information
- Payment details
- Interest rates (if applicable)
- Due dates (if applicable)

Return a JSON response with:
- summary: A brief summary of the document
- extractedData: Structured data extracted from the document (debts, assets, or income)

Be precise and extract only information that is clearly visible in the document.`;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this ${documentType} document and extract financial information.`,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  return {
    summary: result.summary || "Document analyzed successfully",
    extractedData: result.extractedData || {},
  };
}

export async function generateFinancialAdvice(
  userQuestion: string,
  financialContext: {
    debts?: Array<{
      creditor: string;
      debtType: string;
      currentBalance: string;
      apr: string;
    }>;
    assets?: Array<{
      name: string;
      assetType: string;
      currentValue: string;
    }>;
    income?: number;
    creditScore?: number;
  },
  isPaidUser: boolean = false
): Promise<string> {
  const model = getModelForUser(isPaidUser);

  const systemPrompt = `You are an expert financial advisor specializing in debt management, budgeting, and personal finance optimization. Your role is to:

1. Provide clear, actionable financial advice
2. Explain complex financial concepts in simple terms
3. Consider the user's complete financial picture
4. Prioritize debt reduction and financial stability
5. Always include legal disclaimers when appropriate

Important: Always remind users that this is educational information only and they should consult a certified financial advisor for personalized advice.`;

  const contextInfo = [];
  
  if (financialContext.debts && financialContext.debts.length > 0) {
    const totalDebt = financialContext.debts.reduce(
      (sum, debt) => sum + parseFloat(debt.currentBalance),
      0
    );
    contextInfo.push(`Total debt: $${totalDebt.toLocaleString()}`);
    contextInfo.push(`Number of debts: ${financialContext.debts.length}`);
  }

  if (financialContext.assets && financialContext.assets.length > 0) {
    const totalAssets = financialContext.assets.reduce(
      (sum, asset) => sum + parseFloat(asset.currentValue),
      0
    );
    contextInfo.push(`Total assets: $${totalAssets.toLocaleString()}`);
  }

  if (financialContext.income) {
    contextInfo.push(`Monthly income: $${financialContext.income.toLocaleString()}`);
  }

  if (financialContext.creditScore) {
    contextInfo.push(`Credit score: ${financialContext.creditScore}`);
  }

  const userMessage = contextInfo.length > 0
    ? `User's financial context:\n${contextInfo.join('\n')}\n\nUser's question: ${userQuestion}`
    : `User's question: ${userQuestion}`;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
}

export async function createDebtPayoffPlan(
  debts: Array<{
    id: number;
    creditor: string;
    currentBalance: string;
    apr: string;
    minimumPayment: string;
  }>,
  monthlyPayment: number,
  strategy: "avalanche" | "snowball",
  isPaidUser: boolean = false
): Promise<{
  plan: Array<{
    debtId: number;
    creditor: string;
    paymentOrder: number;
    estimatedPayoffMonths: number;
    totalInterest: number;
  }>;
  summary: {
    totalPayoffMonths: number;
    totalInterestPaid: number;
    monthlySavings?: number;
  };
}> {
  const model = getModelForUser(isPaidUser);

  const systemPrompt = `You are a debt payoff planning expert. Calculate an optimal debt payoff plan using the ${strategy} method.

${strategy === "avalanche" 
  ? "Avalanche method: Pay off debts from highest to lowest APR (interest rate)"
  : "Snowball method: Pay off debts from lowest to highest balance"
}

Return a JSON response with:
- plan: Array of debts with payment order and payoff estimates
- summary: Overall summary including total payoff time and interest paid`;

  const debtsInfo = debts.map((debt, index) => ({
    id: debt.id,
    creditor: debt.creditor,
    balance: parseFloat(debt.currentBalance),
    apr: parseFloat(debt.apr),
    minimumPayment: parseFloat(debt.minimumPayment),
  }));

  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Create a ${strategy} debt payoff plan for these debts:
${JSON.stringify(debtsInfo, null, 2)}

Monthly payment budget: $${monthlyPayment}

Calculate the payment order, estimated payoff months for each debt, and total interest that will be paid.`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  return result;
}
