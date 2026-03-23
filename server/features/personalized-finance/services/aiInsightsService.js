import OpenAI from "openai";

// Check for OpenAI API Key
const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export const generateAIInsights = async (userTransactions, userBudget) => {
  if (!apiKey) {
      return null;
  }

  try {
    const prompt = `
      You are a financial advisor for a young user in India.
      Based on their transactions and budget, provide 3 short, punchy, and helpful financial insights or tips.
      
      User Budget: ${JSON.stringify(userBudget)}
      User Transactions (Recent): ${JSON.stringify(userTransactions.slice(0, 20))}
      
      Provide your response as a JSON array of 3 strings. Each string should be a single helpful insight.
      Return ONLY THE JSON ARRAY. NO MARKDOWN.
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
    });

    const text = response.choices[0].message.content;
    const data = JSON.parse(text);
    
    // Support cases where model returns { insights: [...] } instead of [ ...]
    return Array.isArray(data) ? data : (data.insights || Object.values(data)[0]);
  } catch (error) {
    console.error("OpenAI Insight Error:", error);
    return null;
  }
};
