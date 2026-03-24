import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Check for AI API Keys
const openaiApiKey = process.env.OPENAI_API_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

export const generateAIInsights = async (userTransactions, userBudget) => {
  if (!openaiApiKey && !geminiApiKey) {
    return null;
  }

  const prompt = `
    You are a financial advisor for a young user in India.
    Based on their transactions and budget, provide 3 short, punchy, and helpful financial insights or tips.
    
    User Budget: ${JSON.stringify(userBudget)}
    User Transactions (Recent): ${JSON.stringify(userTransactions.slice(0, 20))}
    
    Provide your response as a JSON array of 3 strings. Each string should be a single helpful insight.
    Return ONLY THE JSON ARRAY. NO MARKDOWN.
  `;

  try {
    // Try Gemini first
    if (genAI) {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const data = JSON.parse(text);
      return Array.isArray(data) ? data : (data.insights || Object.values(data)[0] || []);
    }

    // Fallback to OpenAI
    if (openai) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const text = response.choices[0].message.content;
      const data = JSON.parse(text);
      return Array.isArray(data) ? data : (data.insights || Object.values(data)[0] || []);
    }
  } catch (error) {
    console.error("AI Insight Error:", error);
    return null;
  }
};
