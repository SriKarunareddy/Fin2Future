import OpenAI from "openai";
import Transaction from "../../../models/Transaction.js";
import Budget from "../../../models/Budget.js";
import Goal from "../../../models/Goal.js";
import GovApiService from "../../gov-finance/services/govApiService.js";

// Check for OpenAI API Key (support both GEMINI and OPENAI but prioritize OPENAI now as requested)
const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export const generateChatResponse = async (userId, userMessage, chatHistory = []) => {
    if (!apiKey) {
        throw new Error("OpenAI API key is not configured across your .env file.");
    }

    try {
        // 1. Fetch User Data for context
        const [transactions, budget, goals] = await Promise.all([
            Transaction.find({ user: userId }).sort({ date: -1 }).limit(20),
            Budget.findOne({ user: userId }),
            Goal.find({ user: userId })
        ]);

        // 2. Fetch Gov Finance Trends
        const govData = await GovApiService.getEconomicTrends();

        // 3. Prepare System Prompt
        const systemPrompt = `
You are FinBot, an intelligent financial assistant for the Fin2Future platform.
Your goal is to help users manage their personal finances effectively, answer general financial questions, and provide insights based on their data and government finance updates.

CONTEXT:
---
USER DATA (IF AVAILABLE):
- Recent Transactions: ${JSON.stringify(transactions)}
- Monthly Budget: ${JSON.stringify(budget)}
- Savings Goals: ${JSON.stringify(goals)}

GOVERNMENT FINANCE UPDATES (India):
- Inflation: ${JSON.stringify(govData.inflation)}
- Spending Trends: ${JSON.stringify(govData.spending)}
- Taxation Updates: ${JSON.stringify(govData.taxation)}
- Recent News/Policy Updates: ${govData.updates.map(u => u.title).join(", ")}
---

INSTRUCTIONS:
1. Be helpful, concise, and professional yet friendly.
2. If the user asks about their own data, use the USER DATA section.
3. If the user asks general finance questions, use your base knowledge.
4. If the user asks about Indian government policies, use the GOVERNMENT FINANCE UPDATES section.
5. Provide actionable advice where possible.
6. Keep responses in Markdown format for better readability in the chat UI.
7. If data is missing for the user, politely inform them they can start by adding a budget or transactions.
`;

        const messages = [
            { role: "system", content: systemPrompt },
            ...chatHistory.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            })),
            { role: "user", content: userMessage }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messages,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("OpenAI Chat Service Error:", error);
        throw error;
    }
};
