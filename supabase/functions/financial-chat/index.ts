import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, financialData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build dynamic system prompt with real financial data
    let dataContext = "";
    if (financialData) {
      const totalExpenses = financialData.expenses?.reduce((sum: number, e: any) => sum + e.amount, 0) || 0;
      const totalIncome = financialData.income?.reduce((sum: number, i: any) => sum + i.amount, 0) || 0;
      const totalBudget = financialData.budgets?.reduce((sum: number, b: any) => sum + b.limit, 0) || 0;
      const totalSpent = financialData.budgets?.reduce((sum: number, b: any) => sum + b.spent, 0) || 0;
      const activeGoals = financialData.goals?.filter((g: any) => !g.isCompleted) || [];
      const completedGoals = financialData.goals?.filter((g: any) => g.isCompleted) || [];

      dataContext = `

CURRENT FINANCIAL DATA:

Income Summary:
- Total Income: $${totalIncome.toFixed(2)}
- Income Sources: ${financialData.income?.map((i: any) => `${i.source} ($${i.amount})`).join(", ") || "None"}

Expense Summary:
- Total Expenses: $${totalExpenses.toFixed(2)}
- Expenses by Category: ${financialData.expenses?.reduce((acc: any, e: any) => {
  acc[e.category] = (acc[e.category] || 0) + e.amount;
  return acc;
}, {}) ? Object.entries(financialData.expenses.reduce((acc: any, e: any) => {
  acc[e.category] = (acc[e.category] || 0) + e.amount;
  return acc;
}, {})).map(([cat, amt]) => `${cat} ($${amt})`).join(", ") : "None"}

Budget Status:
- Total Budget: $${totalBudget.toFixed(2)}
- Total Spent: $${totalSpent.toFixed(2)} (${((totalSpent / totalBudget) * 100).toFixed(1)}%)
- Budget Details: ${financialData.budgets?.map((b: any) => `${b.category}: $${b.spent}/$${b.limit} (${((b.spent / b.limit) * 100).toFixed(1)}%)`).join(", ") || "None"}

Financial Goals:
- Active Goals: ${activeGoals.length}
${activeGoals.map((g: any) => `  • ${g.title}: $${g.currentAmount}/$${g.targetAmount} (${((g.currentAmount / g.targetAmount) * 100).toFixed(1)}%) - Deadline: ${g.deadline}`).join("\n") || "  None"}
- Completed Goals: ${completedGoals.length}
${completedGoals.map((g: any) => `  • ${g.title} (✓)`).join("\n") || "  None"}

Net Savings: $${(totalIncome - totalExpenses).toFixed(2)}
`;
    }

    const systemPrompt = `You are a helpful financial assistant for Finalyser, a personal finance management app. 
You help users with:
- Budgeting advice and expense analysis
- Savings strategies and financial goal planning
- Understanding their spending patterns
- General financial guidance

You have access to the user's real-time financial data. Use this data to provide personalized, specific advice.
${dataContext}

Keep responses clear, concise, and actionable. Use a friendly, supportive tone. Reference specific numbers from their data when relevant.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
