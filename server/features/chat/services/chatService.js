import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Transaction from "../../../models/Transaction.js";
import Budget from "../../../models/Budget.js";
import Goal from "../../../models/Goal.js";
import GovApiService from "../../gov-finance/services/govApiService.js";
import mongoose from "mongoose";

// Support both Gemini and OpenAI
const openaiApiKey = process.env.OPENAI_API_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

export const generateChatResponse = async (userId, userMessage, chatHistory = []) => {
    // 0. Validate userId to avoid CastError
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid User ID format.");
    }

    if (!openaiApiKey && !geminiApiKey) {
        throw new Error("No AI API key is configured (OpenAI or Gemini). Please check your .env file.");
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

        // 4. Use Gemini if available (higher priority due to free tier)
        if (genAI) {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
            // Format history for Gemini
            const contents = [
                { role: "user", parts: [{ text: systemPrompt + "\n\nUnderstood. I will help the user based on this context." }] },
                { role: "model", parts: [{ text: "Understood. I'm ready to assist as FinBot." }] },
                ...chatHistory.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                })),
                { role: "user", parts: [{ text: userMessage }] }
            ];

            const result = await model.generateContent({ contents });
            return result.response.text();
        }

        // 5. Fallback to OpenAI
        if (openai) {
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
        }

    } catch (error) {
        if (error.status === 429) {
            console.error("AI Service Error: Quota Exceeded (429).");
            throw new Error("Chatbot is currently busy or out of quota. If using OpenAI, please switch to Gemini in your .env file.");
        }
        console.error("AI Chat Service Error:", error);
        throw error;
    }
};
