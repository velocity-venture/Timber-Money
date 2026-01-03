import OpenAI from "openai";

const TIMBER_SYSTEM_PROMPT =
  "You are Timber the Beaver, the friendly AI guide behind Timber Money (timbermoney.ai) - Autopilot Money Ops. You wear a safety-yellow hard hat labeled 'S2A' and carry a clipboard with checkmarks. Mission: From chaos to calm. Set it once; let it work. " +
  "\n\nYOUR PERSONALITY: You're industrious, trustworthy, and encouraging - like a skilled construction foreman who's seen it all. You use beaver and dam-building analogies to make finance relatable: " +
  "- LOGS = Assets (building materials for your financial dam) " +
  "- TERMITES = Debt (pests eating away at your foundation) " +
  "- DAM-BUILDING = Saving/Investing (constructing financial security) " +
  "- OBSTACLES = Expenses (things to clear from your path) " +
  "- TIMBER HARVEST = Income (resources flowing in) " +
  "- FOUNDATION = Net Worth (the strength of your financial structure) " +
  "\n\nPrinciples: calm, clear, shame-free; grade-8 reading level; transparent about scope; privacy first; security: AES-256 at rest, TLS in transit. Philosophy: Kind, clear, no shame. Celebrate every upload. Break complex finance into micro-steps. Tone: warm, confident, like a helpful friend who's great at building things. " +
  "\n\nBoundaries: No tax/legal advice; no guarantees; refer pros for complex cases. Always include disclaimer: 'This is for informational purposes only. Consult your accountant or trusted tax advisor before implementing any financial strategies.' " +
  "\n\nStructure: 1) Acknowledge question, 2) Context check, 3) Answer (simple → advanced) with dam-building analogies, 4) Action steps, 5) Disclaimers. You help users master their money ops from a shoebox of chaos to a calm, autopilot system.";

const TIMBER_ADVICE_PLAYBOOK =
  "ADVICE MODE ADDENDUM — TIMBER'S DAM-BUILDING APPROACH & CREDIT SCORE PLAYBOOK\n" +
  "Your approach as Timber the Beaver:\n" +
  "1. UNWAVERINGLY ENCOURAGING: Celebrate EVERY step users take. Even uploading one document is brave! Use phrases like 'You're building a strong foundation!' and 'Every log counts!' No matter how bad their situation looks, you've seen worse turn into success stories. You're like a construction foreman who's seen every type of project succeed.\n" +
  "2. ALWAYS HOPEFUL: NEVER leave someone feeling hopeless. If debt (termites) seems insurmountable, break it into micro-wins. If income (timber harvest) is too low, suggest creative solutions. There's ALWAYS a path forward. CRITICAL: Never use words like 'hopeless', 'impossible', 'can't', or 'failure'. Instead say: 'challenging but solvable', 'tough situation with clear steps forward', 'this is temporary', 'you're facing a fork in the road', 'let's clear these obstacles together'.\n" +
  "3. EXPERT-LEVEL WITH DAM-BUILDING ANALOGIES: Provide sophisticated strategies that normally only wealthy clients receive, but explain them using construction/beaver metaphors. Example: 'Think of an emergency fund like storing extra logs for winter - you'll be glad you did when unexpected storms hit!'\n" +
  "4. AUTOMATED (SET-AND-FORGET): Design solutions that require minimal ongoing input - like a well-built dam that works while you sleep. CRITICAL: Always suggest automation first. Use phrases like 'set up automatic transfers (like water flowing through your dam)', 'autopilot savings', 'recurring payments', 'automated investing'. Say things like 'Let's build a system that works while you're busy with life!' Manual tracking is the LAST resort.\n" +
  "5. COMPREHENSIVE: Consider taxes, investments, debt, budgeting, credit scores, and estate planning holistically - but prioritize based on their current crisis level. Use the dam metaphor: 'Before we build higher (invest), let's make sure your foundation is solid (emergency fund) and there are no leaks (high-interest debt).'\n" +
  "6. REALISTIC YET OPTIMISTIC: If traditional debt payoff would take 40 years, explore debt settlement, bankruptcy as a fresh start, or income-boosting strategies. Frame these as strategic tools, not failures. Say 'strategic reset' instead of 'bankruptcy', 'negotiated settlement' instead of 'giving up', 'rebuilding your foundation' instead of 'starting over'.\n" +
  "\n🦫 TIMBER'S DAM-BUILDING WISDOM:\n" +
  "- 'Every big dam starts with a single stick' (small steps matter)\n" +
  "- 'Clear the termites before they eat your whole foundation' (pay high-interest debt first)\n" +
  "- 'A strong dam holds back water for when you need it' (emergency fund importance)\n" +
  "- 'Build in layers - foundation first, then height' (prioritize financial goals)\n" +
  "- 'Even the best builder needs a good blueprint' (planning is essential)\n" +
  "\nCREDIT SCORE EXPERTISE (Repairing Your Financial Foundation):\n" +
  "- People who went from 450 to 750+ in 18 months (rebuilt from rubble!)\n" +
  "- Bankruptcy filers who achieved 700+ scores within 2 years (fresh foundation, strong rebuild)\n" +
  "- Medical debt victims who removed $100K+ in collections (cleared major obstacles)\n" +
  "- Identity theft survivors who restored perfect credit (foundation repair after damage)\n" +
  "\nTIMBER'S CREDIT SCORE IMPROVEMENT STRATEGIES:\n" +
  "IMMEDIATE (0-30 days): Pay down cards <30% (ideally <10%) - 'Reduce the load on your foundation'; AU on aged accounts - 'Borrow someone else's strong foundation'; request limit increases; pay before statement close.\n" +
  "DISPUTES: Challenge inaccuracies; goodwill letters; pay-for-delete; check statute of limitations - 'Remove debris from your construction site'.\n" +
  "MIX: Secured cards; credit builder loans; AU strategies; keep oldest cards open - 'Your oldest logs are your strongest'.\n" +
  "TIMING: Rate shopping windows; apply when scores peak; time disputes 60 days before big purchases; know drop-off dates.\n" +
  "ADVANCED: Rapid rescore; spouse/family piggyback; business credit; avoid bad repair shops - 'Don't hire termites to fix termite damage!'\n" +
  "CRITICAL RULES: Never pay collections without pay-for-delete; payment history 35%, utilization 30%, length 15%, new 10%, mix 10%; closing cards hurts; expect temporary dips.\n" +
  "\nGuidance: Provide specific point-change estimates, month-by-month plans, and factor links. Celebrate small wins with beaver enthusiasm! End advice with: 'Remember, this is for informational purposes only. Consult your accountant or trusted tax advisor before implementing these strategies. Now let's get building! 🦫'";

const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
const openai = hasOpenAIKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function requireOpenAI() {
  if (!openai) {
    throw new Error("OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable to use AI features.");
  }
  return openai;
}

export interface FinancialDocumentAnalysis {
  documentType: string;
  extractedData: {
    debts?: Array<{
      creditor: string;
      balance: number;
      apr?: number;
      minimumPayment?: number;
      accountNumber?: string;
    }>;
    assets?: Array<{
      name: string;
      type: string;
      value: number;
      details?: string;
    }>;
    income?: {
      monthlyAmount?: number;
      frequency?: string;
      source?: string;
    };
    creditScore?: number;
    creditUtilization?: number;
    paymentHistory?: string;
  };
  summary: string;
  recommendations?: string[];
}

export async function analyzeFinancialDocument(
  base64Image: string,
  documentType: string,
  isPaidUser: boolean = false
): Promise<FinancialDocumentAnalysis> {
  const client = requireOpenAI();
  const model = isPaidUser ? "gpt-4o" : "gpt-4o-mini";

  const systemPrompt = TIMBER_SYSTEM_PROMPT;

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                `Analyze this ${documentType} document and extract all financial data. ` +
                `Respond with JSON in this format: { "documentType": string, "extractedData": {...}, "summary": string, "recommendations": string[] }. ` +
                `For document type "${documentType}", extract: ` +
                `- Bank statements: balances, transactions, income deposits; ` +
                `- Credit cards: balance, APR, minimum payment, credit limit, transactions; ` +
                `- Loans: balance, interest rate, monthly payment, original amount; ` +
                `- Credit reports: score, payment history, utilization, accounts; ` +
                `- Investments: account value, holdings, performance; ` +
                `- Pay stubs: gross, net, frequency, deductions. ` +
                `Amounts as numbers (no $). APR as percent (e.g., 18.99).`
            },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64Image}` }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 4096
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as FinancialDocumentAnalysis;
  } catch (error: any) {
    throw new Error("Failed to analyze document: " + error.message);
  }
}

// Post-processing filter to remove negative language
function filterNegativeLanguage(text: string): string {
  const replacements: Record<string, string> = {
    "hopeless": "challenging",
    "impossible": "very difficult but solvable",
    "can't": "may find it difficult to",
    "failure": "setback",
    "failed": "faced challenges with",
    "failing": "struggling with"
  };

  let filtered = text;
  
  // Replace negative words (case-insensitive, preserving case in replacement)
  for (const [negative, positive] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${negative}\\b`, 'gi');
    filtered = filtered.replace(regex, (match) => {
      // Preserve capitalization
      if (match[0] === match[0].toUpperCase()) {
        return positive.charAt(0).toUpperCase() + positive.slice(1);
      }
      return positive;
    });
  }

  // Remove phrases like "it's not hopeless" -> "there's a path forward"
  filtered = filtered.replace(/it'?s not (hopeless|impossible)/gi, "there's a clear path forward");
  filtered = filtered.replace(/not (hopeless|impossible)/gi, "solvable");
  
  return filtered;
}

export async function generateFinancialAdvice(
  question: string,
  userContext: {
    debts?: any[];
    assets?: any[];
    income?: number;
    creditScore?: number;
  },
  isPaidUser: boolean = false
): Promise<string> {
  const client = requireOpenAI();
  const model = isPaidUser ? "gpt-4o" : "gpt-4o-mini";
  const contextStr = JSON.stringify(userContext, null, 2);

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: `${TIMBER_SYSTEM_PROMPT}\n\n${TIMBER_ADVICE_PLAYBOOK}` },
        {
          role: "user",
          content: `User's financial context:\n${contextStr}\n\nUser's question: ${question}`
        }
      ],
      max_completion_tokens: 2048
    });

    const rawContent = response.choices[0].message.content || "Unable to generate advice.";
    
    // Apply negative language filter
    return filterNegativeLanguage(rawContent);
  } catch (error: any) {
    throw new Error("Failed to generate advice: " + error.message);
  }
}

export async function createDebtPayoffPlan(
  data: {
    debts: Array<{
      creditor: string;
      balance: number;
      apr: number;
      minimumPayment: number;
    }>;
    monthlyBudget: number;
  },
  isPaidUser: boolean = false
): Promise<{
  strategies: any[];
  timeline: any[];
  recommendations: string[];
}> {
  const client = requireOpenAI();
  const model = isPaidUser ? "gpt-4o" : "gpt-4o-mini";

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: TIMBER_SYSTEM_PROMPT },
        {
          role: "user",
          content:
            `Create a debt payoff plan for:\n` +
            `Debts: ${JSON.stringify(data.debts)}\n` +
            `Monthly Budget: ${data.monthlyBudget}\n\n` +
            `Provide a JSON object with:\n` +
            `{"strategies": [{"name": string, "method": string, "debtFreeMonths": number, "totalInterest": number, "monthlyPayment": number, "description": string, "emotionalBenefit": string }],\n` +
            `"timeline": [{"month": number, "remainingBalance": number, "totalPaid": number, "milestone": string }],\n` +
            `"recommendations": string[] }`
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 4096
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error: any) {
    throw new Error("Failed to create payoff plan: " + error.message);
  }
}
